import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { ALLOWED_CATEGORIES, type Category } from './notion';

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

// Zod schema for validating Gemini's response
const ProcessedNoteSchema = z.object({
  title: z.string().max(100, 'Title must be 100 characters or less'),
  content: z.string().min(1, 'Content cannot be empty'),
  summary: z.string().min(1, 'Summary cannot be empty').max(500, 'Summary too long'),
  category: z.enum(['Project', 'Learning', 'Personal', 'Task']),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(10, 'Maximum 10 tags allowed'),
});

export type ProcessedNote = z.infer<typeof ProcessedNoteSchema>;

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
): Promise<ProcessedNote> {
  try {
    // Use Gemini 2.0 Flash model (optimized for multimodal tasks)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Convert buffer to base64
    const base64Audio = audioBuffer.toString('base64');

    // Craft the prompt with strong category constraints
    const prompt = `
You are analyzing a Burmese voice note. Follow these steps PRECISELY:

STEP 1: TRANSCRIBE
Transcribe the audio to Burmese text. This becomes the CONTENT field.
Preserve the original meaning and nuance. Do NOT translate to English.

STEP 2: SUMMARIZE
Create a brief, intelligent summary (1-2 sentences) in Burmese.
Focus on KEY POINTS and main ideas. This is the SUMMARY field.
The summary should be different from and shorter than the full transcription.

STEP 3: CATEGORIZE
Choose EXACTLY ONE category from this list. You MUST use the EXACT name (case-sensitive):
- Project: Business ideas, app ideas, work projects, startups, brainstorming, entrepreneurship
- Learning: Study notes, education, courses, knowledge acquisition, research
- Personal: Private thoughts, diary entries, personal reflections, feelings
- Task: To-dos, action items, reminders, things to complete, deadlines

CRITICAL: Pick the PRIMARY purpose of the note based on the main intent.
You MUST return one of these EXACT strings: "Project", "Learning", "Personal", or "Task"
Do NOT use variations, lowercase, or synonyms. Use the exact category name shown above.

STEP 4: EXTRACT TAGS
Extract 3-5 relevant tags in Burmese that describe key topics, themes, or keywords.
Tags should help organize and find this note later.

STEP 5: CREATE TITLE
Generate a brief, descriptive title in Burmese (maximum 10 words).
The title should capture the main point or topic of the voice note.

Return your response as valid JSON in this EXACT format:
{
  "title": "string in Burmese (max 10 words)",
  "content": "full transcription in Burmese",
  "summary": "1-2 sentence summary in Burmese",
  "category": "Project|Learning|Personal|Task",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

EXTREMELY IMPORTANT:
- The "category" field MUST be exactly one of: "Project", "Learning", "Personal", "Task"
- Use the EXACT spelling and capitalization shown above
- If you're unsure which category fits best, default to "Personal"
- Do NOT invent new categories or use variations

Language: All text fields (title, content, summary, tags) should be in Burmese (my-MM).
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

    // Validate response with Zod
    const validatedData = ProcessedNoteSchema.parse(parsedResponse);

    return validatedData;
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
