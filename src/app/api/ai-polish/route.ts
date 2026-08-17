import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export type AiPolishMode =
  | 'polish'
  | 'translate-en'
  | 'translate-kr'
  | 'summarize'
  | 'extract-stacks'
  | 'bulletize';

interface RequestBody {
  text: string;
  mode: AiPolishMode;
  contextType?: 'profile' | 'experience' | 'works' | 'cv' | 'general';
  fieldLabel?: string;
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const { text, mode, contextType = 'general', fieldLabel = '' } = body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { error: 'Text is required to process' },
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

    switch (mode) {
      case 'polish':
        systemInstruction = `
You are a world-class tech recruiter and senior engineering manager specializing in developer portfolios and CVs.
Your job is to polish, refine, and elevate the user's draft into an impactful, professional, and clear developer statement.

Guidelines:
1. Maintain the original language (if Korean, output polished Korean; if English, output polished English).
2. For Korean: Use polite, professional, and clear tone (존댓말/명확한 어조). Avoid excessive buzzwords while emphasizing technical clarity and outcomes.
3. For English: Use strong action verbs (e.g. Architected, Engineered, Optimized, Spearheaded), concise sentence structures, and outcome-oriented language.
4. Keep the output directly usable without extra markdown chat greetings, introductions, or quotes. Output ONLY the polished text.
`;
        userPrompt = `Context: ${contextType} (${fieldLabel})\nOriginal Draft:\n"""\n${text}\n"""\n\nPlease polish and improve this text for a senior frontend developer portfolio:`;
        break;

      case 'translate-en':
        systemInstruction = `
You are a specialized translator and technical copywriter who translates developer career descriptions into natural, high-impact English suitable for global tech companies (Silicon Valley standard).

Guidelines:
1. Translate accurately while enhancing technical terminology and readability.
2. Use active voice and industry-standard technical phrasing.
3. Output ONLY the translated English text with no quotes, greetings, or conversational remarks.
`;
        userPrompt = `Context: ${contextType} (${fieldLabel})\nOriginal Text (Korean/Other):\n"""\n${text}\n"""\n\nTranslate into professional, impactful tech English for a developer portfolio:`;
        break;

      case 'translate-kr':
        systemInstruction = `
You are a specialized translator who translates English developer career descriptions and project overviews into natural, professional Korean.

Guidelines:
1. Translate into clean, professional Korean (개발자 포트폴리오/이력서에 어울리는 정돈된 한국어).
2. Keep widely used technical terms in standard English/Korean format (e.g., Next.js, TypeScript, CI/CD, 상태 관리 등).
3. Output ONLY the translated Korean text with no quotes, greetings, or conversational remarks.
`;
        userPrompt = `Context: ${contextType} (${fieldLabel})\nOriginal Text (English):\n"""\n${text}\n"""\n\nTranslate into natural and professional Korean for a developer portfolio:`;
        break;

      case 'summarize':
        systemInstruction = `
You are an expert tech writer. Your goal is to create a punchy, engaging 1-sentence headline or short summary based on the provided text.
Output ONLY the short summary sentence without quotes or greetings. Match the language of the original text unless specified.
`;
        userPrompt = `Context: ${contextType} (${fieldLabel})\nOriginal Text:\n"""\n${text}\n"""\n\nGenerate a crisp 1-sentence summary/headline:`;
        break;

      case 'extract-stacks':
        systemInstruction = `
You are an expert frontend/fullstack software engineer.
Analyze the provided project/experience description and extract all relevant technical stack keywords, tools, libraries, and frameworks (e.g., REACT, NEXT.JS, TYPESCRIPT, TAILWINDCSS, GRAPHQL, DOCKER, CI/CD, JEST, AWS, FIREBASE, etc.).

Guidelines:
1. Return ONLY a JSON array of uppercase stack string names, e.g. ["REACT", "NEXT.JS", "TYPESCRIPT", "TAILWINDCSS"].
2. Do not include duplicate or trivial non-tech words.
3. Maximum 10 most relevant tags.
4. Output RAW JSON ONLY. Do not wrap in markdown \`\`\`json blocks.
`;
        userPrompt = `Description:\n"""\n${text}\n"""\n\nExtract tech stacks as a JSON array:`;
        break;

      case 'bulletize':
        systemInstruction = `
You are a senior tech resume expert. Transform the provided text into 2-4 clean, bullet points following the STAR / XYZ method ("Accomplished [X], as measured by [Y], by doing [Z]").

Guidelines:
1. Output each bullet on a new line starting with a bullet marker (• or -).
2. Match the language of the source text (Korean for Korean, English for English).
3. Focus on impact, architecture, and technology used.
4. Output ONLY the bullet list.
`;
        userPrompt = `Original Description:\n"""\n${text}\n"""\n\nTransform into structured bullet points:`;
        break;

      default:
        return NextResponse.json({ error: 'Invalid mode specified' }, { status: 400 });
    }

    const candidateModels = [
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-3.7-flash',
      'gemini-3.1-flash-lite',
      'gemini-flash-lite-latest',
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
            setTimeout(() => reject(new Error('Model timeout (10s)')), 10000)
          ),
        ]);

        if (response.text && response.text.trim()) {
          resultText = response.text.trim();
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`AI Polish model candidate ${model} error:`, err?.message || err);
      }
    }

    if (!resultText) {
      throw new Error(lastError?.message || 'Failed to generate content from AI models');
    }

    // Clean quotes or markdown wrappers if needed
    if (mode === 'extract-stacks') {
      try {
        const cleanJson = resultText.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
        const parsed = JSON.parse(cleanJson);
        if (Array.isArray(parsed)) {
          return NextResponse.json({ result: resultText, stacks: parsed });
        }
      } catch (e) {
        console.warn('Failed to parse stack JSON:', e);
      }
    }

    // Remove surrounding quotes if any
    if (resultText.startsWith('"') && resultText.endsWith('"') && resultText.length > 2) {
      resultText = resultText.slice(1, -1).trim();
    }

    return NextResponse.json({
      result: resultText,
      mode,
    });
  } catch (error: any) {
    console.error('AI Polish API error:', error);
    return NextResponse.json(
      { error: error?.message || 'AI processing failed' },
      { status: 500 }
    );
  }
}
