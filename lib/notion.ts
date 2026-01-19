import { Client } from '@notionhq/client';
import { 
  getCategoryNames, 
  getCategoryIcon as getIconFromConfig,
  isValidCategory,
  getAllCategories
} from './categoryConfig';

// Initialize Notion client
const notionApiKey = process.env.NOTION_API_KEY;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;

if (!notionApiKey) {
  throw new Error('NOTION_API_KEY is not defined in environment variables');
}

if (!notionDatabaseId) {
  throw new Error('NOTION_DATABASE_ID is not defined in environment variables');
}

export const notion = new Client({
  auth: notionApiKey,
});

/**
 * Get allowed categories from config file
 * Categories are now loaded from config/categories.json
 * See docs/CUSTOMIZE_CATEGORIES.md for customization instructions
 */
export function getAllowedCategories(): string[] {
  return getCategoryNames();
}

/**
 * Category type - dynamically based on config
 * Note: For type safety in tests, we use string instead of const assertion
 */
export type Category = string;

/**
 * Gets the emoji icon for a category
 * Now loaded from config file
 */
export function getCategoryIcon(category: Category): string {
  return getIconFromConfig(category);
}

/**
 * Validates that a category is one of the allowed categories
 * Falls back to 'Personal' if category is invalid
 * 
 * NOTE: Gemini should return exact category names, but this provides
 * a safety fallback in case of unexpected responses.
 */
export function validateCategory(category: string): Category {
  // Check if it's a valid category (exact match, case-sensitive)
  if (isValidCategory(category)) {
    return category;
  }
  
  // Fallback to Personal for invalid categories
  console.warn(`Invalid category "${category}", falling back to: Personal`);
  return 'Personal';
}

/**
 * Truncates text to a maximum length, preserving word boundaries
 * Handles Burmese text (Unicode) properly
 * Safer truncation with stricter limits for Notion display
 */
export function truncateSummary(text: string, maxLength: number = 150): string {
  if (!text) {
    return '';
  }
  
  // If already short enough, return as-is
  if (text.length <= maxLength) {
    return text;
  }
  
  // For safety with Burmese Unicode, truncate to maxLength - 10 to avoid splitting characters
  const safeMaxLength = maxLength - 10;
  let truncated = text.substring(0, safeMaxLength);
  
  // Find last space or Burmese sentence ending to avoid cutting mid-word
  const lastSpace = Math.max(
    truncated.lastIndexOf(' '),
    truncated.lastIndexOf('။'), // Burmese sentence ending
    truncated.lastIndexOf('၊')  // Burmese comma
  );
  
  // Only use boundary if it's in the last 30% of the text
  if (lastSpace > safeMaxLength * 0.7) {
    truncated = truncated.substring(0, lastSpace);
  }
  
  return truncated.trim() + '...';
}

/**
 * Chunks long text into smaller pieces that fit within Notion's character limits
 * Notion API limit: 2000 characters per rich_text block
 * 
 * @param text - The text to chunk
 * @param maxChunkSize - Maximum size per chunk (default: 1900 for safety margin)
 * @returns Array of text chunks
 */
export function chunkContent(text: string, maxChunkSize: number = 1900): string[] {
  if (!text) {
    return [''];
  }
  
  // If text fits in one chunk, return as-is
  if (text.length <= maxChunkSize) {
    return [text];
  }
  
  const chunks: string[] = [];
  let remainingText = text;
  
  while (remainingText.length > 0) {
    if (remainingText.length <= maxChunkSize) {
      // Last chunk
      chunks.push(remainingText);
      break;
    }
    
    // Find a good breaking point (prefer sentence/word boundaries)
    let breakPoint = maxChunkSize;
    const searchStart = Math.max(0, maxChunkSize - 200); // Search last 200 chars for boundary
    
    // Look for Burmese sentence ending
    const burmeseEnd = remainingText.lastIndexOf('။', maxChunkSize);
    const burmeseComma = remainingText.lastIndexOf('၊', maxChunkSize);
    const newline = remainingText.lastIndexOf('\n', maxChunkSize);
    const space = remainingText.lastIndexOf(' ', maxChunkSize);
    
    // Use the best boundary we can find
    const boundaries = [burmeseEnd, burmeseComma, newline, space].filter(pos => pos >= searchStart);
    if (boundaries.length > 0) {
      breakPoint = Math.max(...boundaries) + 1; // +1 to include the boundary character
    }
    
    // Extract chunk and continue with remainder
    const chunk = remainingText.substring(0, breakPoint).trim();
    chunks.push(chunk);
    remainingText = remainingText.substring(breakPoint).trim();
  }
  
  return chunks;
}

/**
 * Truncates a string to a maximum length
 * Used for title and tag validation to prevent Notion API errors
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Validates that the Notion database exists and is accessible
 */
export async function validateDatabase(): Promise<boolean> {
  try {
    await notion.databases.retrieve({
      database_id: notionDatabaseId!,
    });
    return true;
  } catch (error) {
    console.error('Failed to validate Notion database:', error);
    return false;
  }
}

/**
 * Data structure for creating a voice note page
 */
export interface VoiceNoteData {
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
}

/**
 * Result structure returned after creating a page
 */
export interface CreatePageResult {
  success: boolean;
  pageId?: string;
  pageUrl?: string;
  error?: string;
  categoryMapped?: string;
}

/**
 * Creates a voice note page in Notion with properties and body content
 * 
 * @param data - Voice note data (generated by Gemini AI in real usage)
 * @returns Result with page ID, URL, and status
 */
export async function createVoiceNotePage(
  data: VoiceNoteData
): Promise<CreatePageResult> {
  try {
    // Validate category (should be exact match from Gemini)
    const validatedCategory = validateCategory(data.category);
    
    // Get category icon
    const categoryIcon = getCategoryIcon(validatedCategory);
    
    // Truncate summary to 150 characters (safer for Burmese text)
    const truncatedSummary = truncateSummary(data.summary, 150);
    
    // Create the page with properties and content
    const response = await notion.pages.create({
      parent: {
        database_id: notionDatabaseId!,
      },
      // Set page icon based on category
      icon: {
        type: 'emoji',
        emoji: categoryIcon,
      },
      properties: {
        // Title property - truncate to prevent Notion API errors (2000 char limit, recommend 100)
        Name: {
          title: [
            {
              text: {
                content: truncateText(data.title, 100),
              },
            },
          ],
        },
        // Summary property (text)
        Summary: {
          rich_text: [
            {
              text: {
                content: truncatedSummary,
              },
            },
          ],
        },
        // Category property (select)
        Category: {
          select: {
            name: validatedCategory,
          },
        },
        // Tags property (multi-select) - truncate each tag to prevent errors (100 char limit)
        Tags: {
          multi_select: data.tags.map((tag) => ({
            name: truncateText(tag, 100),
          })),
        },
      },
      // Page body content (full transcription)
      // Split long content into multiple paragraph blocks to respect Notion's 2000-char limit
      children: chunkContent(data.content, 1900).map((chunk) => ({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: chunk,
              },
            },
          ],
        },
      })),
    });

    // Extract page URL and ID from response
    const pageId = response.id;
    // Notion pages follow this URL pattern
    const pageUrl = `https://notion.so/${pageId.replace(/-/g, '')}`;

    return {
      success: true,
      pageId,
      pageUrl,
      categoryMapped: validatedCategory,
    };
  } catch (error) {
    console.error('Failed to create Notion page:', error);
    
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}
