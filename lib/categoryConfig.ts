/**
 * Category Configuration Loader
 * 
 * Loads categories from config/categories.json (git-ignored, user-customizable)
 * Falls back to config/categories.example.json if not found
 */

import fs from 'fs';
import path from 'path';

export interface CategoryConfig {
  name: string;
  icon: string;
  description: string;
}

export interface CategoriesConfig {
  categories: CategoryConfig[];
}

let cachedConfig: CategoriesConfig | null = null;

/**
 * Get the path to the categories config file
 * Tries categories.json first (user's custom), falls back to categories.example.json
 */
function getCategoriesConfigPath(): string {
  const configDir = path.join(process.cwd(), 'config');
  const userConfigPath = path.join(configDir, 'categories.json');
  const exampleConfigPath = path.join(configDir, 'categories.example.json');

  // Check if user has created their own config
  if (fs.existsSync(userConfigPath)) {
    return userConfigPath;
  }

  // Fall back to example config
  if (fs.existsSync(exampleConfigPath)) {
    console.warn(
      '⚠️  No config/categories.json found. Using categories.example.json as fallback.\n' +
      '   To customize categories, copy categories.example.json to categories.json and edit it.\n' +
      '   See docs/CUSTOMIZE_CATEGORIES.md for details.'
    );
    return exampleConfigPath;
  }

  throw new Error(
    'No category configuration file found. ' +
    'Please create config/categories.json or restore config/categories.example.json'
  );
}

/**
 * Load categories configuration from JSON file
 * Caches the result for performance
 */
export function loadCategoriesConfig(): CategoriesConfig {
  // Return cached config if available
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const configPath = getCategoriesConfigPath();
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent) as CategoriesConfig;

    // Validate structure
    if (!config.categories || !Array.isArray(config.categories)) {
      throw new Error('Invalid config: "categories" must be an array');
    }

    if (config.categories.length === 0) {
      throw new Error('Invalid config: "categories" array cannot be empty');
    }

    // Validate each category
    config.categories.forEach((category, index) => {
      if (!category.name || typeof category.name !== 'string') {
        throw new Error(`Invalid config: Category at index ${index} missing "name"`);
      }
      if (!category.icon || typeof category.icon !== 'string') {
        throw new Error(`Invalid config: Category "${category.name}" missing "icon"`);
      }
      if (!category.description || typeof category.description !== 'string') {
        throw new Error(`Invalid config: Category "${category.name}" missing "description"`);
      }
    });

    // Cache and return
    cachedConfig = config;
    return config;

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load categories config: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Get array of category names (for validation)
 */
export function getCategoryNames(): string[] {
  const config = loadCategoriesConfig();
  return config.categories.map(c => c.name);
}

/**
 * Get category icon by name
 */
export function getCategoryIcon(categoryName: string): string {
  const config = loadCategoriesConfig();
  const category = config.categories.find(c => c.name === categoryName);
  return category?.icon || '📝'; // Default icon if not found
}

/**
 * Get category description by name (for AI prompts)
 */
export function getCategoryDescription(categoryName: string): string {
  const config = loadCategoriesConfig();
  const category = config.categories.find(c => c.name === categoryName);
  return category?.description || '';
}

/**
 * Get all categories (for generating AI prompts)
 */
export function getAllCategories(): CategoryConfig[] {
  const config = loadCategoriesConfig();
  return config.categories;
}

/**
 * Clear the cache (useful for testing or hot-reload scenarios)
 */
export function clearCategoryCache(): void {
  cachedConfig = null;
}

/**
 * Validate that a category name exists in config
 */
export function isValidCategory(categoryName: string): boolean {
  const validNames = getCategoryNames();
  return validNames.includes(categoryName);
}
