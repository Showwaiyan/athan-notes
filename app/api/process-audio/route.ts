import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { processAudio, validateAudioFile, type ProcessedNoteWithMetadata } from '@/lib/gemini';

/**
 * POST /api/process-audio
 * 
 * Processes a Burmese voice note with Gemini AI
 * 
 * Required: User must be authenticated
 * 
 * Request: multipart/form-data with audio file
 * Response: ProcessedNote JSON (title, content, summary, category, tags)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    
    if (!session.isLoggedIn) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate it's a file
    if (!(audioFile instanceof Blob)) {
      return NextResponse.json(
        { error: 'Invalid audio file format' },
        { status: 400 }
      );
    }

    // Get file metadata
    const fileSize = audioFile.size;
    const mimeType = audioFile.type || 'audio/webm'; // Default to webm if not specified

    // Validate audio file
    const validation = validateAudioFile({ size: fileSize, type: mimeType });
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Convert to buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process with Gemini and save to Notion
    const processedNote: ProcessedNoteWithMetadata = await processAudio(buffer, mimeType);

    // Return processed note (now includes categoryIcon and notionUrl)
    return NextResponse.json(processedNote, { status: 200 });

  } catch (error) {
    console.error('Audio processing error:', error);
    
    let errorMessage = 'Failed to process audio';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle specific error types
      if (error.message.includes('Invalid response format')) {
        statusCode = 502; // Bad Gateway - Gemini returned invalid data
      } else if (error.message.includes('GEMINI_API_KEY')) {
        statusCode = 500; // Server configuration error
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

/**
 * GET /api/process-audio
 * 
 * Returns information about the endpoint
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/process-audio',
    method: 'POST',
    description: 'Process Burmese voice notes with Gemini AI',
    authentication: 'Required (session-based)',
    requestFormat: 'multipart/form-data',
    requestFields: {
      audio: 'Audio file (required) - WebM, WAV, MP3, M4A, OGG, FLAC',
    },
    constraints: {
      maxFileSize: '50MB',
      maxDuration: '15 minutes',
      language: 'Burmese (my-MM)',
    },
    responseFormat: {
      success: 'boolean',
      data: {
        title: 'string (original language as spoken - Burmese, English, or mixed, max 10 words)',
        content: 'string (full transcription in Burmese)',
        summary: 'string (1-2 sentences in Burmese)',
        category: 'Project | Learning | Personal | Task',
        tags: 'string[] (3-5 tags in English only)',
      },
    },
  });
}
