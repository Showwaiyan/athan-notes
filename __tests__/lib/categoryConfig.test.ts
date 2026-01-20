/**
 * Tests for Category Configuration Loader
 */

import {
  loadCategoriesConfig,
  getCategoryNames,
  getCategoryIcon,
  getCategoryDescription,
  getAllCategories,
  clearCategoryCache,
  isValidCategory,
} from '@/lib/categoryConfig';
import fs from 'fs';
import path from 'path';

// Mock filesystem
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('categoryConfig', () => {
  const validConfig = {
    categories: [
      {
        name: 'Project',
        icon: '🚀',
        description: 'Business ideas and projects',
      },
      {
        name: 'Learning',
        icon: '📚',
        description: 'Study notes and education',
      },
    ],
  };

  beforeEach(() => {
    // Clear cache before each test
    clearCategoryCache();
    jest.clearAllMocks();
  });

  describe('loadCategoriesConfig', () => {
    it('should load categories from categories.json if it exists', () => {
      mockFs.existsSync.mockImplementation((filePath) => {
        return filePath.toString().includes('categories.json');
      });
      mockFs.readFileSync.mockReturnValue(JSON.stringify(validConfig));

      const result = loadCategoriesConfig();

      expect(result).toEqual(validConfig);
      expect(mockFs.existsSync).toHaveBeenCalled();
      expect(mockFs.readFileSync).toHaveBeenCalled();
    });

    it('should fall back to categories.example.json if categories.json does not exist', () => {
      mockFs.existsSync.mockImplementation((filePath) => {
        return filePath.toString().includes('categories.example.json');
      });
      mockFs.readFileSync.mockReturnValue(JSON.stringify(validConfig));

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const result = loadCategoriesConfig();

      expect(result).toEqual(validConfig);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('config/categories.json not found')
      );
      
      consoleWarnSpy.mockRestore();
    });

    it('should cache the config for subsequent calls', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(validConfig));

      // First call
      loadCategoriesConfig();
      
      // Second call (should use cache)
      const result = loadCategoriesConfig();

      expect(result).toEqual(validConfig);
      // Should only read file once due to caching
      expect(mockFs.readFileSync).toHaveBeenCalledTimes(1);
    });

    it('should throw error if no config file exists', () => {
      mockFs.existsSync.mockReturnValue(false);

      expect(() => loadCategoriesConfig()).toThrow(
        'No category configuration file found'
      );
    });

    it('should throw error if categories array is missing', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({}));

      expect(() => loadCategoriesConfig()).toThrow(
        'Invalid config: "categories" must be an array'
      );
    });

    it('should throw error if categories array is empty', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({ categories: [] }));

      expect(() => loadCategoriesConfig()).toThrow(
        'Invalid config: "categories" array cannot be empty'
      );
    });

    it('should throw error if category is missing name', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        JSON.stringify({
          categories: [
            { icon: '🚀', description: 'Test' }
          ]
        })
      );

      expect(() => loadCategoriesConfig()).toThrow(
        'Category at index 0 missing "name"'
      );
    });

    it('should throw error if category is missing icon', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        JSON.stringify({
          categories: [
            { name: 'Test', description: 'Test' }
          ]
        })
      );

      expect(() => loadCategoriesConfig()).toThrow(
        'Category "Test" missing "icon"'
      );
    });

    it('should throw error if category is missing description', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        JSON.stringify({
          categories: [
            { name: 'Test', icon: '🚀' }
          ]
        })
      );

      expect(() => loadCategoriesConfig()).toThrow(
        'Category "Test" missing "description"'
      );
    });

    it('should throw error if JSON is invalid', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue('invalid json {');

      expect(() => loadCategoriesConfig()).toThrow(
        'Failed to load categories config'
      );
    });
  });

  describe('getCategoryNames', () => {
    it('should return array of category names', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(validConfig));

      const names = getCategoryNames();

      expect(names).toEqual(['Project', 'Learning']);
    });
  });

  describe('getCategoryIcon', () => {
    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(validConfig));
    });

    it('should return icon for existing category', () => {
      const icon = getCategoryIcon('Project');
      expect(icon).toBe('🚀');
    });

    it('should return default icon for non-existent category', () => {
      const icon = getCategoryIcon('NonExistent');
      expect(icon).toBe('📝');
    });
  });

  describe('getCategoryDescription', () => {
    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(validConfig));
    });

    it('should return description for existing category', () => {
      const description = getCategoryDescription('Learning');
      expect(description).toBe('Study notes and education');
    });

    it('should return empty string for non-existent category', () => {
      const description = getCategoryDescription('NonExistent');
      expect(description).toBe('');
    });
  });

  describe('getAllCategories', () => {
    it('should return all categories', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(validConfig));

      const categories = getAllCategories();

      expect(categories).toEqual(validConfig.categories);
    });
  });

  describe('isValidCategory', () => {
    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(validConfig));
    });

    it('should return true for valid category', () => {
      expect(isValidCategory('Project')).toBe(true);
      expect(isValidCategory('Learning')).toBe(true);
    });

    it('should return false for invalid category', () => {
      expect(isValidCategory('Invalid')).toBe(false);
    });

    it('should be case-sensitive', () => {
      expect(isValidCategory('project')).toBe(false); // lowercase
      expect(isValidCategory('PROJECT')).toBe(false); // uppercase
      expect(isValidCategory('Project')).toBe(true);  // exact match
    });
  });

  describe('clearCategoryCache', () => {
    it('should clear the cache', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(validConfig));

      // Load config (caches it)
      loadCategoriesConfig();
      expect(mockFs.readFileSync).toHaveBeenCalledTimes(1);

      // Clear cache
      clearCategoryCache();

      // Load again (should read file again)
      loadCategoriesConfig();
      expect(mockFs.readFileSync).toHaveBeenCalledTimes(2);
    });
  });
});
