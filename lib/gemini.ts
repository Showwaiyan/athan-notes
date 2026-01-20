import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { getAllowedCategories, type Category, createVoiceNotePage, type VoiceNoteData } from './notion';
import { getAllCategories, getCategoryIcon } from './categoryConfig';

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Build Zod schema dynamically based on categories from config
 */
function buildProcessedNoteSchema() {
  const categories = getAllowedCategories();
  
  if (categories.length === 0) {
    throw new Error('No categories found in config');
  }
  
  // Create enum validator from category names
  const categoryEnum = z.enum(categories as [string, ...string[]]);
  
  return z.object({
    title: z.string().max(100, 'Title must be 100 characters or less'),
    content: z.string().min(1, 'Content cannot be empty'),
    summary: z.string().min(1, 'Summary cannot be empty').max(200, 'Summary must be 200 characters or less'),
    category: categoryEnum,
    tags: z.array(z.string()).min(1, 'At least one tag is required').max(10, 'Maximum 10 tags allowed'),
  });
}

export type ProcessedNote = z.infer<ReturnType<typeof buildProcessedNoteSchema>>;

// Extended type with additional fields returned by the API
export type ProcessedNoteWithMetadata = ProcessedNote & {
  categoryIcon?: string;
  notionUrl?: string;
};

// Audio format validation
const ALLOWED_MIME_TYPES = [
  'audio/webm',
  'audio/wav',
  'audio/mpeg',
  'audio/mp3',
  'audio/mp4',
  'audio/m4a',
  'audio/ogg',
  'audio/flac',
];

const MAX_AUDIO_DURATION_MS = 15 * 60 * 1000; // 15 minutes in milliseconds
const MAX_AUDIO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

// Gemini model fallback configuration
// Models are tried in order. If primary fails with transient errors (404, 503, 429, 500),
// the next model in the list is attempted automatically.
// Note: Using current generation models (tested and verified January 2026)
const GEMINI_MODELS = [
  'gemini-2.5-flash',                    // Primary: Latest stable multimodal model
  'gemini-2.5-flash-preview-09-2025',    // Fallback 1: Preview model (September 2025)
  'gemini-3-flash-preview',              // Fallback 2: Gemini 3.0 preview (newest)
];

// Timeout per model attempt (60 seconds)
const MODEL_TIMEOUT_MS = 60 * 1000;

/**
 * Validates audio file format and size
 */
export function validateAudioFile(file: { size: number; type?: string }): {
  valid: boolean;
  error?: string;
} {
  // Check file size
  if (file.size > MAX_AUDIO_SIZE_BYTES) {
    return {
      valid: false,
      error: `Audio file too large. Maximum size is ${MAX_AUDIO_SIZE_BYTES / 1024 / 1024}MB`,
    };
  }

  // Check MIME type if provided
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported audio format: ${file.type}. Allowed formats: ${ALLOWED_MIME_TYPES.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Checks if an error is a transient error that should trigger model fallback
 * Transient errors: 404 (Not Found), 503 (Service Unavailable), 429 (Rate Limit), 500 (Internal Server Error)
 */
function isTransientError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  
  const errorMessage = error.message.toLowerCase();
  
  // Check for HTTP status codes in error message
  const has404 = errorMessage.includes('404') || errorMessage.includes('not found') || errorMessage.includes('is not found');
  const has503 = errorMessage.includes('503') || errorMessage.includes('service unavailable') || errorMessage.includes('overloaded');
  const has429 = errorMessage.includes('429') || errorMessage.includes('rate limit') || errorMessage.includes('quota exceeded');
  const has500 = errorMessage.includes('500') || errorMessage.includes('internal server error');
  
  return has404 || has503 || has429 || has500;
}

/**
 * Wraps a promise with a timeout
 * Rejects if the promise doesn't resolve within the specified timeout
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timeout after ${timeoutMs / 1000} seconds`));
      }, timeoutMs);
    }),
  ]);
}

/**
 * Attempts to generate content using a specific Gemini model with timeout
 * 
 * @param modelName - The Gemini model to use
 * @param base64Audio - Base64-encoded audio data
 * @param mimeType - MIME type of the audio
 * @param prompt - The prompt to send to the model
 * @returns The generated text response
 */
async function tryGenerateWithModel(
  modelName: string,
  base64Audio: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: modelName });
  
  const generationPromise = model.generateContent([
    {
      inlineData: {
        mimeType,
        data: base64Audio,
      },
    },
    { text: prompt },
  ]);
  
  // Apply timeout to the generation request
  const result = await withTimeout(generationPromise, MODEL_TIMEOUT_MS);
  const response = await result.response;
  return response.text();
}

/**
 * Processes audio file with Gemini AI to extract structured data
 * Automatically falls back to alternative models if primary model fails with transient errors
 * 
 * @param audioBuffer - Audio file buffer
 * @param mimeType - MIME type of the audio file
 * @returns Processed note with transcription, summary, category, and tags
 */
export async function processAudio(
  audioBuffer: Buffer,
  mimeType: string
): Promise<ProcessedNoteWithMetadata> {
  // Convert buffer to base64 once (shared across all model attempts)
  const base64Audio = audioBuffer.toString('base64');

  // Get categories from config for dynamic prompt generation
  const categories = getAllCategories();
  const categoryNames = categories.map(c => c.name);
  
  // Build category descriptions for prompt
  const categoryDescriptions = categories.map(c => 
    `- ${c.name}: ${c.description}`
  ).join('\n');
  
  // Build list of exact category names for validation reminder
  const categoryList = categoryNames.map(name => `"${name}"`).join(', ');

  // Craft the prompt with strong category constraints (using config categories)
  const prompt = `
You are analyzing a Burmese voice note. Follow these steps PRECISELY:

STEP 1: TRANSCRIBE & CORRECT
Transcribe the audio to Burmese text with the following improvements:
- CORRECT any spelling mistakes in Burmese (check Burmese orthography)
- FIX fragmented sentences (if user starts a sentence, pauses, then continues later, merge them naturally)
- REMOVE filler words, repetitions, and false starts ("အဲ့တော့... ဒီ... ဒီ..." → clear sentence)
- NORMALIZE the text to sound natural and coherent while PRESERVING the original meaning
- Fix any grammatical errors to make sentences flow properly
- If speech is disorganized, reorganize into logical, complete sentences
- Keep the same ideas and content, just make it read naturally

IMPORTANT: 
- Do NOT change the meaning or add information not in the audio
- Do NOT translate to English
- Just make the Burmese text cleaner, more natural, and easier to read
- This corrected, natural text becomes the CONTENT field

STEP 2: SUMMARIZE
Create a brief, concise summary (ONE short sentence, maximum 15-20 words) in Burmese.
Focus on the SINGLE most important key point or main idea.
Keep it extremely concise - just the essence of the note.
The summary should be much shorter than the full transcription.

STEP 3: CATEGORIZE
Choose EXACTLY ONE category from this list. You MUST use the EXACT name (case-sensitive):
${categoryDescriptions}

CRITICAL: Pick the PRIMARY purpose of the note based on the main intent.
You MUST return one of these EXACT strings: ${categoryList}
Do NOT use variations, lowercase, or synonyms. Use the exact category name shown above.
If you're unsure which category fits best, default to "${categoryNames[0]}" or the most general category.

STEP 4: EXTRACT TAGS
Extract 3-5 relevant tags in ENGLISH ONLY that describe key topics, themes, or keywords.
Tags should help organize and find this note later.
IMPORTANT: Tags must be in English, not Burmese. Use simple, descriptive English words.

STEP 5: CREATE TITLE
Generate a brief, descriptive title (maximum 10 words).
IMPORTANT: 
- Keep the title in the SAME LANGUAGE as spoken in the audio
- If the user speaks Burmese, the title should be in Burmese
- If the user speaks English, the title should be in English
- If the user speaks BOTH languages mixed, keep BOTH languages in the title (do NOT translate)
- Just capture what was said naturally, preserving the original language(s)
- Correct any spelling mistakes in the title as well

Return your response as valid JSON in this EXACT format:
{
  "title": "string in original language(s) spoken (max 10 words, spelling corrected)",
  "content": "full transcription in Burmese (corrected, natural, coherent)",
  "summary": "one short sentence in Burmese (max 15-20 words)",
  "category": "${categoryNames.join('|')}",
  "tags": ["english_tag1", "english_tag2", "english_tag3"]
}

EXTREMELY IMPORTANT:
- The "category" field MUST be exactly one of: ${categoryList}
- Use the EXACT spelling and capitalization shown above
- Do NOT invent new categories or use variations
- Tags MUST be in English only
- Title should preserve the original language(s) as spoken (no translation)
- Content should be corrected, natural Burmese text (fix spelling, merge fragments, remove fillers)

Language Rules:
- title: Keep original language(s) as spoken (Burmese, English, or mixed) - CORRECTED spelling
- content: Burmese transcription - CORRECTED, NATURAL, and COHERENT
- summary: Burmese summary - corrected spelling
- tags: English only
`;

  let lastError: Error | null = null;
  
  // Try each model in sequence until one succeeds
  for (let i = 0; i < GEMINI_MODELS.length; i++) {
    const modelName = GEMINI_MODELS[i];
    
    try {
      console.log(`Attempting to process audio with model: ${modelName}`);
      
      // Try to generate content with this model
      const text = await tryGenerateWithModel(modelName, base64Audio, mimeType, prompt);

      // Parse JSON response
      let parsedResponse;
      try {
        // Try to extract JSON from markdown code blocks if present
        const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        const jsonText = jsonMatch ? jsonMatch[1] : text;
        parsedResponse = JSON.parse(jsonText);
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', text);
        throw new Error('Gemini returned invalid JSON response');
      }

      // Validate response with Zod (build schema dynamically)
      const ProcessedNoteSchema = buildProcessedNoteSchema();
      const validatedData = ProcessedNoteSchema.parse(parsedResponse);

      // Save to Notion
      const voiceNoteData: VoiceNoteData = {
        title: validatedData.title,
        content: validatedData.content,
        summary: validatedData.summary,
        category: validatedData.category,
        tags: validatedData.tags,
      };

      const notionResult = await createVoiceNotePage(voiceNoteData);

      if (!notionResult.success) {
        console.error('Failed to save to Notion:', notionResult.error);
        throw new Error(`Failed to save to Notion: ${notionResult.error}`);
      }

      // Success! Return data with icon and Notion URL
      console.log(`Successfully processed audio with model: ${modelName}`);
      return {
        ...validatedData,
        categoryIcon: getCategoryIcon(validatedData.category),
        notionUrl: notionResult.pageUrl,
      };
      
    } catch (error) {
      console.error(`Model ${modelName} failed:`, error);
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Check if this is a transient error and we have more models to try
      const isLastModel = i === GEMINI_MODELS.length - 1;
      
      if (isTransientError(error) && !isLastModel) {
        // This is a transient error and we have fallback models, continue to next model
        console.log(`Transient error detected, trying next model...`);
        continue;
      } else if (!isLastModel && lastError.message.includes('timeout')) {
        // Timeout error, try next model
        console.log(`Timeout detected, trying next model...`);
        continue;
      } else {
        // Non-transient error, or this was the last model - propagate the error
        break;
      }
    }
  }
  
  // All models failed, throw the last error
  console.error('All Gemini models failed. Last error:', lastError);
  
  if (lastError instanceof z.ZodError) {
    const issues = lastError.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
    throw new Error(`Invalid response format from Gemini: ${issues}`);
  }
  
  if (lastError instanceof Error) {
    throw new Error(`Failed to process audio: ${lastError.message}`);
  }
  
  throw new Error('Unknown error occurred while processing audio');
}
