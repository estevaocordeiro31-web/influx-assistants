import { describe, it, expect } from 'vitest';
import { ENV } from './_core/env';

describe('Gemini API Integration', () => {
  it('should have GEMINI_API_KEY configured', () => {
    expect(ENV.geminiApiKey).toBeDefined();
    expect(ENV.geminiApiKey).not.toBe('');
  });

  it('should successfully call Gemini API', async () => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${ENV.geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello, this is a test message. Please respond with "OK".'
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
    }
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.candidates).toBeDefined();
    expect(data.candidates.length).toBeGreaterThan(0);
  }, 15000); // 15 second timeout for API call
});
