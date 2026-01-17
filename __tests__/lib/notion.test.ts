import { jest } from '@jest/globals';

// Mock categoryConfig before importing notion module
jest.mock('../../lib/categoryConfig', () => ({
  getCategoryNames: jest.fn(() => ['Project', 'Learning', 'Personal', 'Task']),
  getCategoryIcon: jest.fn((name: string) => {
    const icons: Record<string, string> = {
      'Project': '🚀',
      'Learning': '📚',
      'Personal': '✨',
      'Task': '✅',
    };
    return icons[name] || '📝';
  }),
  isValidCategory: jest.fn((name: string) => {
    return ['Project', 'Learning', 'Personal', 'Task'].includes(name);
  }),
  getAllCategories: jest.fn(() => [
    { name: 'Project', icon: '🚀', description: 'Business ideas and projects' },
    { name: 'Learning', icon: '📚', description: 'Study notes' },
    { name: 'Personal', icon: '✨', description: 'Personal thoughts' },
    { name: 'Task', icon: '✅', description: 'To-dos and tasks' },
  ]),
  getCategoryDescription: jest.fn(),
  clearCategoryCache: jest.fn(),
  loadCategoriesConfig: jest.fn(),
}));

// Import functions - we'll test the pure functions directly
// For functions that use the Notion client, we'll need to mock the module
import {
  getCategoryIcon,
  validateCategory,
  truncateSummary,
  type VoiceNoteData,
} from '../../lib/notion';

describe('lib/notion.ts', () => {
  describe('getCategoryIcon', () => {
    test('returns rocket emoji for Project category', () => {
      expect(getCategoryIcon('Project')).toBe('🚀');
    });

    test('returns books emoji for Learning category', () => {
      expect(getCategoryIcon('Learning')).toBe('📚');
    });

    test('returns sparkles emoji for Personal category', () => {
      expect(getCategoryIcon('Personal')).toBe('✨');
    });

    test('returns checkmark emoji for Task category', () => {
      expect(getCategoryIcon('Task')).toBe('✅');
    });
  });

  describe('validateCategory', () => {
    describe('valid categories', () => {
      test('validates exact category names (case-sensitive)', () => {
        expect(validateCategory('Project')).toBe('Project');
        expect(validateCategory('Learning')).toBe('Learning');
        expect(validateCategory('Personal')).toBe('Personal');
        expect(validateCategory('Task')).toBe('Task');
      });
    });

    describe('invalid categories fallback', () => {
      test('falls back to Personal for lowercase variations', () => {
        expect(validateCategory('project')).toBe('Personal');
        expect(validateCategory('learning')).toBe('Personal');
        expect(validateCategory('personal')).toBe('Personal');
        expect(validateCategory('task')).toBe('Personal');
      });

      test('falls back to Personal for unknown categories', () => {
        expect(validateCategory('random')).toBe('Personal');
        expect(validateCategory('unknown')).toBe('Personal');
        expect(validateCategory('xyz123')).toBe('Personal');
      });

      test('falls back to Personal for empty string', () => {
        expect(validateCategory('')).toBe('Personal');
      });

      test('logs warning for invalid categories', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        
        validateCategory('invalid_category');
        
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          'Invalid category "invalid_category", falling back to: Personal'
        );
        
        consoleWarnSpy.mockRestore();
      });
    });
  });

  describe('truncateSummary', () => {
    test('returns empty string for empty input', () => {
      expect(truncateSummary('')).toBe('');
    });

    test('returns short text unchanged', () => {
      const shortText = 'This is a short text.';
      expect(truncateSummary(shortText, 200)).toBe(shortText);
    });

    test('returns text at exactly maxLength unchanged', () => {
      const text = 'a'.repeat(200);
      expect(truncateSummary(text, 200)).toBe(text);
    });

    test('truncates long text and adds ellipsis', () => {
      const longText = 'a'.repeat(250);
      const result = truncateSummary(longText, 200);
      
      // New behavior: uses maxLength - 10 for safety (190) + '...' = 193
      expect(result).toHaveLength(193); // (200 - 10) chars + '...'
      expect(result.endsWith('...')).toBe(true);
    });

    test('preserves word boundaries when possible', () => {
      const text = 'This is a very long sentence that should be truncated at a word boundary to avoid cutting words in half and making it look ugly.';
      const result = truncateSummary(text, 80);
      
      expect(result.endsWith('...')).toBe(true);
      expect(result.length).toBeLessThanOrEqual(83); // 80 + '...'
      
      // Should not end with partial word (check no letters before ...)
      const beforeEllipsis = result.slice(0, -3).trim();
      expect(beforeEllipsis.endsWith(' ')).toBe(false);
    });

    test('truncates at maxLength if no good word boundary found', () => {
      // Text with no spaces near the boundary
      const text = 'a'.repeat(50) + ' ' + 'b'.repeat(200);
      const result = truncateSummary(text, 200);
      
      expect(result.endsWith('...')).toBe(true);
      // Should truncate at safeMaxLength (maxLength - 10) since no good boundary found
      expect(result.length).toBe(193); // (200 - 10) + '...'
    });

    test('handles Burmese text (Unicode) correctly', () => {
      const burmeseText = 'မြန်မာဘာသာ '.repeat(50); // Repeat to make it long
      const result = truncateSummary(burmeseText, 100);
      
      expect(result.endsWith('...')).toBe(true);
      expect(result.length).toBeLessThanOrEqual(103);
    });

    test('trims whitespace before adding ellipsis', () => {
      const text = 'This is a test     ' + 'x'.repeat(200);
      const result = truncateSummary(text, 50);
      
      // Should not have trailing spaces before ellipsis
      expect(result.endsWith('...')).toBe(true);
      expect(result).not.toMatch(/\s+\.\.\.$/);
    });

    test('uses default maxLength of 150 when not specified', () => {
      const longText = 'a'.repeat(250);
      const result = truncateSummary(longText);
      
      // Default is now 150, uses 150 - 10 = 140 for safety, + '...' = 143
      expect(result).toHaveLength(143); // (150 - 10) + '...'
      expect(result.endsWith('...')).toBe(true);
    });
  });

  // Note: validateDatabase() and createVoiceNotePage() are integration tests
  // that require the actual Notion client. These are tested via:
  // 1. The API route tests (app/api/notion/test.test.ts)
  // 2. Manual testing using the /api/notion/test endpoint
});

