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

    // 4. 현재 웹사이트 주소
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // 5. 웹사이트의 실제 페이지 가져오기
    const [worksRes, experienceRes, cvRes] = await Promise.all([
      fetch(`${baseUrl}/works`, {
        cache: "no-store",
      }),
      fetch(`${baseUrl}/experience`, {
        cache: "no-store",
      }),
      fetch(`${baseUrl}/cv`, {
        cache: "no-store",
      }),
    ]);

    // 6. 페이지 내용 가져오기
    const worksHtml = worksRes.ok
      ? await worksRes.text()
      : "No Works page is available.";

    const experienceHtml = experienceRes.ok
      ? await experienceRes.text()
      : "No Experience page is available.";

    const cvHtml = cvRes.ok
      ? await cvRes.text()
      : "No CV page is available.";

    // 7. 디버깅용 로그
    console.log("Website pages:", {
      works: worksRes.status,
      experience: experienceRes.status,
      cv: cvRes.status,
    });

    // 8. Gemini에게 전달할 프롬프트
    const fullPrompt = `
You are an AI assistant for my personal portfolio website.

Your job is to answer questions about me using ONLY the information
contained in the website pages provided below.

IMPORTANT RULES:

1. Only use information from the website content below.
2. Do NOT use outside knowledge.
3. Do NOT make up or guess information.
4. You can summarize, explain, and compare information from the website.
5. If the answer cannot be found in the website content, say:
   "I don't have that information on this website."
6. When possible, give a clear and concise answer.
7. If the user asks for a summary, summarize only the relevant
   information from the website.
8. Do not pretend to know information that is not provided.

========================
WORKS PAGE
========================

${worksHtml}

========================
EXPERIENCE PAGE
========================

${experienceHtml}

========================
CV PAGE
========================

${cvHtml}

========================
USER QUESTION
========================

${prompt}
`;

    // 9. Gemini 호출
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt,
    });

    // 10. Gemini 답변 반환
    return NextResponse.json({
      text: response.text,
    });

  } catch (error) {
    console.error("Detailed Gemini API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch from Gemini",
        details: error instanceof Error
          ? error.message
          : String(error),
      },
      { status: 500 }
    );
  }
}