import '@testing-library/jest-dom'

// Set up test environment variables globally
process.env.NOTION_API_KEY = 'test_notion_api_key';
process.env.NOTION_DATABASE_ID = 'test_database_id';
process.env.GEMINI_API_KEY = 'test_gemini_api_key';

// Polyfill fetch for Notion client (needed in Node environment)
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn();
}
