import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    // 1. 챗봇에서 사용자가 입력한 질문
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // 2. Gemini API Key
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Gemini API Key is missing!");

      return NextResponse.json(
        { error: "API Key is missing" },
        { status: 500 }
      );
    }

    // 3. Gemini 초기화
    const ai = new GoogleGenAI({
      apiKey,
    });

    // 4. 배포된 웹사이트 주소
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    // 5. CV 페이지 하나만 가져오기
    const cvRes = await fetch(`${baseUrl}/cv`, {
      cache: "no-store",
    });

    if (!cvRes.ok) {
      throw new Error(
        `Failed to fetch CV page: ${cvRes.status}`
      );
    }

    const cvHtml = await cvRes.text();

    // 디버깅
    console.log("CV page:", cvRes.status);

    // 6. Gemini에게 전달할 프롬프트
    const fullPrompt = `
You are an AI assistant for Younggeun Jun's personal portfolio website.

Your job is to answer questions about Younggeun Jun using ONLY
the information contained in the CV page provided below.

IMPORTANT RULES:

1. Use ONLY the information from the CV content below.
2. Do NOT use outside knowledge.
3. Do NOT make up, guess, or infer information that is not explicitly
   provided in the CV.
4. You may summarize and explain the information from the CV.
5. If the answer cannot be found in the CV, say:
   "I don't have that information on this website."
6. Keep your answers clear and concise.
7. Answer in the same language as the user's question.
8. If the user asks for a summary, summarize only information
   contained in the CV.
9. Do not pretend to know anything about Younggeun Jun that is not
   provided in the CV.

========================
CV PAGE CONTENT
========================

${cvHtml}

========================
USER QUESTION
========================

${prompt}
`;

    // 7. Gemini 호출
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt,
    });

    // 8. Gemini 답변 반환
    return NextResponse.json({
      text: response.text,
    });

  } catch (error) {
    console.error("Detailed Gemini API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch from Gemini",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}