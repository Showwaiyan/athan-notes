/**
 * @jest-environment node
 */

import { GET } from '../../../app/api/notion/test/route';
import { getSession } from '@/lib/session';
import { validateDatabase, createVoiceNotePage } from '@/lib/notion';

// Mock dependencies
jest.mock('@/lib/session');
jest.mock('@/lib/notion');

const mockGetSession = getSession as jest.MockedFunction<typeof getSession>;
const mockValidateDatabase = validateDatabase as jest.MockedFunction<typeof validateDatabase>;
const mockCreateVoiceNotePage = createVoiceNotePage as jest.MockedFunction<typeof createVoiceNotePage>;

describe('GET /api/notion/test', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    // Save original environment
    originalEnv = { ...process.env };
  });

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Reset environment variables to test values
    process.env.NOTION_API_KEY = 'test_api_key';
    process.env.NOTION_DATABASE_ID = 'test_database_id';
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('authentication', () => {
    test('returns 401 when user is not logged in', async () => {
      mockGetSession.mockResolvedValue({
        isLoggedIn: false,
        save: jest.fn(),
        destroy: jest.fn(),
      } as any);

      const request = new Request('http://localhost:3000/api/notion/test');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({
        error: 'Unauthorized',
      });
    });

    test('proceeds when user is authenticated', async () => {
      mockGetSession.mockResolvedValue({
        isLoggedIn: true,
        username: 'admin',
        save: jest.fn(),
        destroy: jest.fn(),
      } as any);

      // Mock other dependencies to prevent actual calls
      mockValidateDatabase.mockResolvedValue(true);
      mockCreateVoiceNotePage.mockResolvedValue({
        success: true,
        pageId: 'test-page-id',
        pageUrl: 'https://notion.so/testpageid',
        categoryMapped: 'Personal',
      });

      const request = new Request('http://localhost:3000/api/notion/test');
      const response = await GET(request);

      expect(response.status).toBe(200);
    });
  });

  describe('environment variable validation', () => {
    beforeEach(() => {
      // Mock session as authenticated for these tests
      mockGetSession.mockResolvedValue({
        isLoggedIn: true,
        username: 'admin',
        save: jest.fn(),
        destroy: jest.fn(),
      } as any);
    });

    test('returns 500 when NOTION_API_KEY is missing', async () => {
      delete process.env.NOTION_API_KEY;

      const request = new Request('http://localhost:3000/api/notion/test');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('NOTION_API_KEY is not configured in environment variables');
    });

    test('returns 500 when NOTION_DATABASE_ID is missing', async () => {
      delete process.env.NOTION_DATABASE_ID;

      const request = new Request('http://localhost:3000/api/notion/test');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('NOTION_DATABASE_ID is not configured in environment variables');
    });

    test('proceeds when both environment variables are set', async () => {
      // Both env vars are set in beforeEach
      mockValidateDatabase.mockResolvedValue(true);
      mockCreateVoiceNotePage.mockResolvedValue({
        success: true,
        pageId: 'test-page-id',
        pageUrl: 'https://notion.so/testpageid',
        categoryMapped: 'Personal',
      });

      const request = new Request('http://localhost:3000/api/notion/test');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockValidateDatabase).toHaveBeenCalled();
    });
  });

  describe('database validation', () => {
    beforeEach(() => {
      mockGetSession.mockResolvedValue({
        isLoggedIn: true,
        username: 'admin',
        save: jest.fn(),
        destroy: jest.fn(),
      } as any);
    });

    test('returns 500 when database validation fails', async () => {
      mockValidateDatabase.mockResolvedValue(false);

      const request = new Request('http://localhost:3000/api/notion/test');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Cannot access Notion database');
      expect(data.error).toContain('Database ID is correct');
      expect(data.error).toContain('Database is shared with your integration');
      expect(data.error).toContain('API key is valid');
    });

    test('proceeds when database validation succeeds', async () => {
      mockValidateDatabase.mockResolvedValue(true);
      mockCreateVoiceNotePage.mockResolvedValue({
        success: true,
        pageId: 'test-page-id',
        pageUrl: 'https://notion.so/testpageid',
        categoryMapped: 'Personal',
      });

      const request = new Request('http://localhost:3000/api/notion/test');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockCreateVoiceNotePage).toHaveBeenCalled();
    });
  });

  describe('test page creation', () => {
    beforeEach(() => {
      mockGetSession.mockResolvedValue({
        isLoggedIn: true,
        username: 'admin',
        save: jest.fn(),
        destroy: jest.fn(),
      } as any);
      mockValidateDatabase.mockResolvedValue(true);
    });

    test('creates test page with correct data structure', async () => {
      mockCreateVoiceNotePage.mockResolvedValue({
        success: true,
        pageId: 'abc123',
        pageUrl: 'https://notion.so/abc123',
        categoryMapped: 'Personal',
      });

      const request = new Request('http://localhost:3000/api/notion/test');
      await GET(request);

      expect(mockCreateVoiceNotePage).toHaveBeenCalledWith({
        title: 'Test Voice Note',
        summary: 'This is a test page created by Athan Notes to verify Notion integration is working correctly.',
        content: expect.stringContaining('Full test content here'),
        category: 'Personal',
        tags: ['test', 'system-check', 'athan-notes'],
      });
    });

    test('returns success response when page is created', async () => {
      const mockPageId = '12345678-1234-1234-1234-123456789abc';
      const mockPageUrl = 'https://notion.so/123456781234123412341234567890abc';

      mockCreateVoiceNotePage.mockResolvedValue({
        success: true,
        pageId: mockPageId,
        pageUrl: mockPageUrl,
        categoryMapped: 'Personal',
      });

      const request = new Request('http://localhost:3000/api/notion/test');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        message: 'Test page created successfully in Notion!',
        pageId: mockPageId,
        pageUrl: mockPageUrl,
        categoryMapped: 'Personal',
        note: 'You can safely delete this test page from your Notion database.',
      });
    });

    test('returns 500 when page creation fails', async () => {
      mockCreateVoiceNotePage.mockResolvedValue({
        success: false,
        error: 'Notion API Error: Invalid database ID',
      });

      const request = new Request('http://localhost:3000/api/notion/test');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Notion API Error: Invalid database ID');
    });

    test('returns generic error when page creation fails without error message', async () => {
      mockCreateVoiceNotePage.mockResolvedValue({
        success: false,
      });

      const request = new Request('http://localhost:3000/api/notion/test');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Failed to create test page');
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      mockGetSession.mockResolvedValue({
        isLoggedIn: true,
        username: 'admin',
        save: jest.fn(),
        destroy: jest.fn(),
      } as any);
    });

    test('handles unexpected errors gracefully', async () => {
      mockValidateDatabase.mockRejectedValue(new Error('Network error'));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const request = new Request('http://localhost:3000/api/notion/test');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Network error');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error in Notion test endpoint:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    test('handles non-Error exceptions', async () => {
      mockValidateDatabase.mockRejectedValue('String error');

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const request = new Request('http://localhost:3000/api/notion/test');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unknown error occurred');

      consoleErrorSpy.mockRestore();
    });
  });
});
