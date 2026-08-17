import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {
  profileData,
  experienceData,
  workData,
  cvData,
  skillCategories,
} from "@/data/portfolioData";

export async function POST(req: Request) {
  try {
    const { prompt, language } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Gemini API Key is missing!");
      return NextResponse.json(
        { error: "API Key is missing" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const portfolioContext = `
========================================
YOUNGGEUN JUN PORTFOLIO & CV DATA
========================================

[PROFILE - ENGLISH]
Name: ${profileData.en.name}
Role: ${profileData.en.role}
Headline: ${profileData.en.headLine}
About: ${profileData.en.about}
Location: ${profileData.en.location}
Availability: ${profileData.en.availability}
Taglines: ${profileData.en.taglines.join(", ")}

[PROFILE - KOREAN]
이름: ${profileData.kr.name}
역할: ${profileData.kr.role}
헤드라인: ${profileData.kr.headLine}
소개: ${profileData.kr.about}
위치: ${profileData.kr.location}
상태: ${profileData.kr.availability}
태그라인: ${profileData.kr.taglines.join(", ")}

[SKILLS & TECH STACK]
${skillCategories
        .map(
          (cat) =>
            `- ${cat.title.en} (${cat.title.kr}): ${cat.skills.map((s) => s.name).join(", ")}`
        )
        .join("\n")}

[EXPERIENCES]
${experienceData
        .map(
          (exp, idx) => `
${idx + 1}. Company: ${exp.company}
   Role: ${exp.role} (${exp.period}) - ${exp.location}
   Highlights: ${exp.highlights.join(", ")}
   Tech Stacks: ${exp.stacks.join(", ")}
   Description (EN): ${exp.description.en.join(" ")}
   Description (KR): ${exp.description.kr.join(" ")}
`
        )
        .join("\n")}

[PROJECTS / WORKS]
${workData
        .map(
          (work, idx) => `
${idx + 1}. Name: ${work.name} ${work.company ? `(${work.company})` : ""}
   Tech Stacks: ${work.stacks.join(", ")}
   Description (EN): ${work.description.en}
   Description (KR): ${work.description.kr}
   Link: ${work.link}
`
        )
        .join("\n")}

[CV SUMMARY]
Summary (EN): ${cvData.en.summary}
Summary (KR): ${cvData.kr.summary}
Education: ${cvData.en.education.map((e) => `${e.institution} - ${e.degree} (${e.period})`).join(", ")}
Languages: ${cvData.en.languages.map((l) => `${l.language} (${l.proficiency})`).join(", ")}
`;

    const systemPrompt = `
You are the dedicated AI portfolio assistant for frontend developer Younggeun Jun (전영근).
Your mission is to represent Younggeun Jun professionally, guide visitors through his portfolio, projects, tech stack, work experience, and development career.

========================================
CRITICAL GUARDRAIL & BEHAVIOR RULES:
========================================

1. DEFLECT UNRELATED QUESTIONS (비관련 질문 우회):
   - If the user asks about topics completely unrelated to Younggeun Jun, frontend development, coding, or this portfolio (e.g., general trivia, math homework, weather, celebrity gossip, recipes, stock trading, jokes, politics, etc.):
   - DO NOT answer the unrelated question directly.
   - Politely, wittily, and tactfully steer the conversation back to Younggeun Jun.
   - Example (Korean): "저는 프론트엔드 개발자 전영근님의 포트폴리오를 안내해 드리는 AI 비서입니다! 🤖 영근님의 프로젝트, 기술 스택, 경력 사항에 대해 물어봐 주시면 성심껏 답변해 드릴게요!"
   - Example (English): "I am the AI assistant for Younggeun Jun's portfolio! 🤖 I'm specialized in answering questions about Younggeun's projects, tech stack, and experience. How can I help you learn more about his work?"

2. PROTECT PERSONAL & SENSITIVE INFORMATION (개인정보 및 사생활 보호):
   - If the user asks for private or confidential information NOT disclosed in the portfolio (e.g., resident registration number, private home address, personal phone number, private dating/relationship status, personal finances, salary history, family details, passwords, private contacts):
   - NEVER disclose, invent, or guess private personal information.
   - Respond with a polite, tactful, and safe deflection advising them to reach out directly via the Contact page.
   - Example (Korean): "영근님의 상세한 개인정보나 사생활에 관한 정보는 안내해 드릴 수 없습니다. 🔒 프로젝트 제안이나 채용 관련 문의는 웹사이트의 Contact 페이지를 통해 직접 메시지를 남겨주시면 영근님이 확인 후 연락드릴 거예요! ✉️"
   - Example (English): "I cannot share personal or private details about Younggeun Jun. 🔒 For job opportunities or collaboration inquiries, please leave a message through the Contact page!"

3. ACCURACY & SCOPE (포트폴리오 정보 활용):
   - Answer professional questions accurately based on the portfolio data provided below.
   - Highlight Younggeun's strengths in React, Next.js, TypeScript, frontend architecture, build speed optimization (e.g. Rspack), and interactive UX.
   - Do not invent experience or companies that are not in the portfolio data.

4. TONE AND MANNER:
   - Professional, courteous, friendly, witty, and helpful.
   - Keep answers clear, engaging, and concise without being overly verbose.
   - Match the user's language (${language || "Korean or English based on user query"}).

${portfolioContext}

========================================
USER QUESTION:
========================================
${prompt}
`;

    const candidateModels = ["gemini-flash-latest", "gemini-3-flash-preview"];
    let responseText = "";
    let lastError: unknown = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: systemPrompt,
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Model ${model} failed, trying next candidate...`);
      }
    }

    if (!responseText && lastError) {
      throw lastError;
    }

    return NextResponse.json({
      text: responseText,
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