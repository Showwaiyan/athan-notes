import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { createVoiceNotePage, validateDatabase } from '@/lib/notion';

/**
 * Test endpoint to verify Notion integration is working
 * GET /api/notion/test
 * 
 * This endpoint:
 * 1. Checks authentication
 * 2. Validates Notion database access
 * 3. Creates a test page with sample data
 * 4. Returns the page URL
 * 
 * You can safely delete the test page from Notion after verification.
 */
export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getSession();
    
    if (!session.isLoggedIn) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check environment variables
    if (!process.env.NOTION_API_KEY) {
      return NextResponse.json(
        { 
          success: false,
          error: 'NOTION_API_KEY is not configured in environment variables' 
        },
        { status: 500 }
      );
    }

    if (!process.env.NOTION_DATABASE_ID) {
      return NextResponse.json(
        { 
          success: false,
          error: 'NOTION_DATABASE_ID is not configured in environment variables' 
        },
        { status: 500 }
      );
    }

    // Validate database access
    const isValid = await validateDatabase();
    
    if (!isValid) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Cannot access Notion database. Please check:\n' +
                 '1. Database ID is correct\n' +
                 '2. Database is shared with your integration\n' +
                 '3. API key is valid'
        },
        { status: 500 }
      );
    }

    // Create test page with sample data
    const testData = {
      title: 'Test Voice Note',
      summary: 'This is a test page created by Athan Notes to verify Notion integration is working correctly.',
      content: 'Full test content here. This page was automatically created to test the connection between Athan Notes and your Notion workspace. If you see this page with all properties filled correctly, the integration is working! You can safely delete this test page.',
      category: 'Personal',
      tags: ['test', 'system-check', 'athan-notes'],
    };

    const result = await createVoiceNotePage(testData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test page created successfully in Notion!',
        pageId: result.pageId,
        pageUrl: result.pageUrl,
        categoryMapped: result.categoryMapped,
        note: 'You can safely delete this test page from your Notion database.',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to create test page',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in Notion test endpoint:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
