export interface GeminiRequest {
  prompt: string;
  language: 'English' | 'Korean';
}

export interface GeminiResponse {
  text: string;
}

/**
 * Call Gemini API endpoint
 */
export const fetchGeminiResponse = async ({
  prompt,
  language,
}: GeminiRequest): Promise<string> => {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, language }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch response from Gemini');
  }

  return data.text;
};
