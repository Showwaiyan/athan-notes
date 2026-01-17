import { jest } from '@jest/globals';
import { validateAudioFile } from '../../lib/gemini';

// Note: processAudio() requires actual Gemini API calls, so we'll test it via API endpoint tests
// Here we focus on testing validateAudioFile() which is a pure function

describe('lib/gemini.ts', () => {
  describe('validateAudioFile', () => {
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB

    describe('valid audio files', () => {
      test('accepts WebM audio files', () => {
        const result = validateAudioFile({
          size: 1024 * 1024, // 1MB
          type: 'audio/webm',
        });
        
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      test('accepts WAV audio files', () => {
        const result = validateAudioFile({
          size: 1024 * 1024,
          type: 'audio/wav',
        });
        
        expect(result.valid).toBe(true);
      });

      test('accepts MP3 audio files', () => {
        const result = validateAudioFile({
          size: 1024 * 1024,
          type: 'audio/mpeg',
        });
        
        expect(result.valid).toBe(true);
      });

      test('accepts M4A audio files', () => {
        const result = validateAudioFile({
          size: 1024 * 1024,
          type: 'audio/m4a',
        });
        
        expect(result.valid).toBe(true);
      });

      test('accepts OGG audio files', () => {
        const result = validateAudioFile({
          size: 1024 * 1024,
          type: 'audio/ogg',
        });
        
        expect(result.valid).toBe(true);
      });

      test('accepts FLAC audio files', () => {
        const result = validateAudioFile({
          size: 1024 * 1024,
          type: 'audio/flac',
        });
        
        expect(result.valid).toBe(true);
      });

      test('accepts files at maximum size limit', () => {
        const result = validateAudioFile({
          size: MAX_SIZE,
          type: 'audio/webm',
        });
        
        expect(result.valid).toBe(true);
      });

      test('accepts files when no type is provided', () => {
        const result = validateAudioFile({
          size: 1024 * 1024,
        });
        
        expect(result.valid).toBe(true);
      });
    });

    describe('invalid audio files', () => {
      test('rejects files exceeding maximum size', () => {
        const result = validateAudioFile({
          size: MAX_SIZE + 1,
          type: 'audio/webm',
        });
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Audio file too large');
        expect(result.error).toContain('50MB');
      });

      test('rejects unsupported audio format (video)', () => {
        const result = validateAudioFile({
          size: 1024 * 1024,
          type: 'video/mp4',
        });
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Unsupported audio format');
      });

      test('rejects unsupported audio format (text)', () => {
        const result = validateAudioFile({
          size: 1024 * 1024,
          type: 'text/plain',
        });
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Unsupported audio format');
      });

      test('rejects unsupported audio format (image)', () => {
        const result = validateAudioFile({
          size: 1024 * 1024,
          type: 'image/jpeg',
        });
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Unsupported audio format');
      });
    });

    describe('edge cases', () => {
      test('accepts zero-size files', () => {
        const result = validateAudioFile({
          size: 0,
          type: 'audio/webm',
        });
        
        expect(result.valid).toBe(true);
      });

      test('handles very small files', () => {
        const result = validateAudioFile({
          size: 1, // 1 byte
          type: 'audio/webm',
        });
        
        expect(result.valid).toBe(true);
      });
    });
  });

  // Note: processAudio() tests are in __tests__/api/process-audio.test.ts
  // We test it via the API endpoint with mocked Gemini responses
  // This is more reliable than trying to mock the GoogleGenerativeAI SDK directly
});
