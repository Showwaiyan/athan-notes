import { jest } from '@jest/globals';

// Import functions - we'll test the pure functions directly
// For functions that use the Notion client, we'll need to mock the module
import {
  getCategoryIcon,
  mapCategory,
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

  describe('mapCategory', () => {
    describe('exact matches', () => {
      test('maps exact category names', () => {
        expect(mapCategory('Project')).toBe('Project');
        expect(mapCategory('Learning')).toBe('Learning');
        expect(mapCategory('Personal')).toBe('Personal');
        expect(mapCategory('Task')).toBe('Task');
      });
    });

    describe('lowercase variations', () => {
      test('maps lowercase category names', () => {
        expect(mapCategory('project')).toBe('Project');
        expect(mapCategory('learning')).toBe('Learning');
        expect(mapCategory('personal')).toBe('Personal');
        expect(mapCategory('task')).toBe('Task');
      });

      test('maps plural forms', () => {
        expect(mapCategory('projects')).toBe('Project');
        expect(mapCategory('tasks')).toBe('Task');
      });
    });

    describe('common synonyms', () => {
      test('maps business/work-related synonyms to Project', () => {
        expect(mapCategory('business')).toBe('Project');
        expect(mapCategory('work')).toBe('Project');
        expect(mapCategory('office')).toBe('Project');
        expect(mapCategory('job')).toBe('Project');
        expect(mapCategory('app')).toBe('Project');
        expect(mapCategory('startup')).toBe('Project');
      });

      test('maps learning-related synonyms to Learning', () => {
        expect(mapCategory('study')).toBe('Learning');
        expect(mapCategory('education')).toBe('Learning');
        expect(mapCategory('course')).toBe('Learning');
      });

      test('maps task-related synonyms to Task', () => {
        expect(mapCategory('todo')).toBe('Task');
        expect(mapCategory('to-do')).toBe('Task');
        expect(mapCategory('action')).toBe('Task');
        expect(mapCategory('reminder')).toBe('Task');
      });

      test('maps idea-related synonyms to Project', () => {
        expect(mapCategory('idea')).toBe('Project');
        expect(mapCategory('ideas')).toBe('Project');
        expect(mapCategory('brainstorm')).toBe('Project');
      });

      test('maps personal-related synonyms to Personal', () => {
        expect(mapCategory('private')).toBe('Personal');
        expect(mapCategory('note')).toBe('Personal');
        expect(mapCategory('notes')).toBe('Personal');
        expect(mapCategory('diary')).toBe('Personal');
        expect(mapCategory('thought')).toBe('Personal');
        expect(mapCategory('thoughts')).toBe('Personal');
      });
    });

    describe('fallback behavior', () => {
      test('falls back to Personal for unknown categories', () => {
        expect(mapCategory('random')).toBe('Personal');
        expect(mapCategory('unknown')).toBe('Personal');
        expect(mapCategory('xyz123')).toBe('Personal');
      });

      test('falls back to Personal for empty string', () => {
        expect(mapCategory('')).toBe('Personal');
      });

      test('falls back to Personal for mixed case unknown', () => {
        expect(mapCategory('RaNdOm')).toBe('Personal');
      });

      test('logs warning for unknown categories', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        
        mapCategory('unknown_category');
        
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          'Unknown category "unknown_category", using fallback: Personal'
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
      
      expect(result).toHaveLength(203); // 200 chars + '...'
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
      // Should truncate at maxLength since last space is too far back (< 80% threshold)
      expect(result.length).toBe(203); // 200 + '...'
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

    test('uses default maxLength of 200 when not specified', () => {
      const longText = 'a'.repeat(250);
      const result = truncateSummary(longText);
      
      expect(result).toHaveLength(203); // 200 + '...'
      expect(result.endsWith('...')).toBe(true);
    });
  });

  // Note: validateDatabase() and createVoiceNotePage() are integration tests
  // that require the actual Notion client. These are tested via:
  // 1. The API route tests (app/api/notion/test.test.ts)
  // 2. Manual testing using the /api/notion/test endpoint
});

