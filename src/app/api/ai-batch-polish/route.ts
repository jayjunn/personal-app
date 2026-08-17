import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { WorkItem, ExperienceItem } from '@/service/portfolioService';

export async function POST(req: Request) {
  try {
    const { type, items, mode = 'all' } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required for batch polishing.' },
        { status: 400 }
      );
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      '';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured in environment variables.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    let systemInstruction = '';
    let userPrompt = '';

    if (type === 'works') {
      systemInstruction = `
You are a senior tech recruiter and principal frontend engineer.
You will be provided with a JSON array of portfolio project items for developer Younggeun Jun.

Your task is to refine and upgrade ALL project items in the list:
1. Polish the Korean description ("description.kr") into natural, impact-oriented, professional Korean.
2. Polish/generate the English description ("description.en") using high-impact tech action verbs (e.g., Architected, Engineered, Spearheaded, Built, Optimized) following Silicon Valley standards.
3. Ensure both Korean and English descriptions accurately reflect the project's purpose and frontend architecture.
4. Ensure "stacks" is an array of uppercase technical keywords (e.g. ["REACT", "NEXT.JS", "TYPESCRIPT", "TAILWINDCSS"]).
5. Keep all other fields ("id", "name", "category", "company", "img", "link") intact.
6. OUTPUT STRICTLY A VALID RAW JSON ARRAY matching the input structure. Do not wrap in markdown or backticks.
`;
      userPrompt = `Input Projects List:\n${JSON.stringify(items, null, 2)}\n\nPlease output the polished JSON array:`;
    } else if (type === 'experiences') {
      systemInstruction = `
You are a senior tech recruiter and hiring manager.
You will be provided with a JSON array of work experience career items for developer Younggeun Jun.

Your task is to refine and upgrade ALL experience items:
1. Polish the Korean bullet points ("description.kr") into 2-4 clean, outcome-focused bullet points (XYZ method: Accomplished X measured by Y using Z).
2. Polish/generate the English bullet points ("description.en") into 2-4 professional English bullet points using strong action verbs.
3. Ensure "stacks" includes relevant uppercase technology tags.
4. Keep all other fields ("id", "role", "company", "period", "location") intact.
5. OUTPUT STRICTLY A VALID RAW JSON ARRAY matching the input structure. Do not wrap in markdown or backticks.
`;
      userPrompt = `Input Experiences List:\n${JSON.stringify(items, null, 2)}\n\nPlease output the polished JSON array:`;
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const candidateModels = [
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-3.7-flash',
      'gemini-3.1-flash-lite',
    ];

    let resultText = '';
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const responsePromise = ai.models.generateContent({
          model,
          contents: `${systemInstruction}\n\n${userPrompt}`,
        });

        const response: any = await Promise.race([
          responsePromise,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Model timeout (25s)')), 25000)
          ),
        ]);

        if (response.text && response.text.trim()) {
          resultText = response.text.trim();
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Batch AI Polish model ${model} error:`, err?.message || err);
      }
    }

    if (!resultText) {
      throw new Error(lastError?.message || 'Failed to generate batch content from AI');
    }

    // Clean JSON response
    const cleanJson = resultText
      .replace(/^```json/i, '')
      .replace(/^```/, '')
      .replace(/```$/, '')
      .trim();

    const parsedItems = JSON.parse(cleanJson);

    if (!Array.isArray(parsedItems)) {
      throw new Error('AI did not return a valid array');
    }

    return NextResponse.json({
      success: true,
      items: parsedItems,
    });
  } catch (error: any) {
    console.error('Batch AI Polish error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to batch polish items' },
      { status: 500 }
    );
  }
}
