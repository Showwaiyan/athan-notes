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
 * Processes audio file with Gemini AI to extract structured data
 * 
 * @param audioBuffer - Audio file buffer
 * @param mimeType - MIME type of the audio file
 * @returns Processed note with transcription, summary, category, and tags
 */
export async function processAudio(
  audioBuffer: Buffer,
  mimeType: string
): Promise<ProcessedNoteWithMetadata> {
  try {
    // Use Gemini 2.5 Flash model (latest generation for multimodal tasks)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Convert buffer to base64
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

    // Generate content with audio
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64Audio,
        },
      },
      { text: prompt },
    ]);

    const response = await result.response;
    const text = response.text();

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

    // Return data with icon and Notion URL
    return {
      ...validatedData,
      categoryIcon: getCategoryIcon(validatedData.category),
      notionUrl: notionResult.pageUrl,
    };
  } catch (error) {
    console.error('Error processing audio with Gemini:', error);
    
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
      throw new Error(`Invalid response format from Gemini: ${issues}`);
    }
    
    if (error instanceof Error) {
      throw new Error(`Failed to process audio: ${error.message}`);
    }
    
    throw new Error('Unknown error occurred while processing audio');
  }
}
