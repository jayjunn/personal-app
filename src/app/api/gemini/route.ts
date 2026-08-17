import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import {
  profileData,
  experienceData,
  workData,
  cvData,
  skillCategories,
} from '@/data/portfolioData';

// Intelligent Local Fallback Engine when Gemini API is throttled or offline
function getSmartFallbackResponse(prompt: string, isEn: boolean): string {
  const q = prompt.toLowerCase();

  if (q.includes('skill') || q.includes('스택') || q.includes('기술') || q.includes('react') || q.includes('next')) {
    return isEn
      ? "Younggeun's core skills include React, Next.js, TypeScript, JavaScript, TailwindCSS, Rspack, Node.js, GraphQL, and Web3 integrations. He specializes in high-performance frontend architecture and interactive web applications! 🚀"
      : "영근님의 핵심 기술 스택은 React, Next.js, TypeScript, JavaScript, TailwindCSS, Rspack, Node.js, GraphQL 등입니다! 고성능 프론트엔드 아키텍처와 인터랙티브 웹 개발에 강점을 가지고 있습니다. 🚀";
  }

  if (q.includes('experience') || q.includes('경력') || q.includes('회사') || q.includes('company') || q.includes('career') || q.includes('ebay')) {
    return isEn
      ? 'Younggeun has over 6 years of frontend engineering experience across companies including eBay Japan, COS, Glue, and Blocko. He has led large-scale e-commerce web applications, web3 platforms, and complex design system migrations!'
      : '영근님은 eBay Japan, COS, Glue, Blocko 등에서 6년 이상의 프론트엔드 엔지니어링 경력을 보유하고 있습니다. 대규모 글로벌 이커머스 서비스 및 Web3 플랫폼 구축을 주도했습니다!';
  }

  if (q.includes('project') || q.includes('work') || q.includes('프로젝트') || q.includes('작품')) {
    return isEn
      ? "Featured projects include Qoo10 Japan web services, COS platform, and specialized interactive web apps. You can explore all projects with interactive tech filtering in the Works section! 💼"
      : "주요 프로젝트로는 Qoo10 Japan 글로벌 커머스, COS 플랫폼, Web3 디앱 등이 있습니다. Works 섹션에서 기술 스택별 인터랙티브 필터로 전체 프로젝트를 둘러보실 수 있습니다! 💼";
  }

  if (q.includes('contact') || q.includes('email') || q.includes('연락') || q.includes('이메일') || q.includes('채용') || q.includes('커피챗')) {
    return isEn
      ? "You can contact Younggeun directly via the Contact page or email him at jayjunn@outlook.com! He is always open to exciting new opportunities and collaborations. 📬"
      : "Contact 페이지에서 직접 메시지를 보내시거나 jayjunn@outlook.com 으로 이메일을 보내실 수 있습니다! 새로운 협업이나 채용 기회는 언제든 환영합니다. 📬";
  }

  if (q.includes('mario') || q.includes('마리오') || q.includes('게임') || q.includes('game') || q.includes('bonus')) {
    return isEn
      ? "Look at the bottom left! You can play with the interactive Mario companion. Reach 500 points to unlock the secret stage clear fireworks celebration! 🍄⭐"
      : "화면 좌측 하단을 보시면 귀여운 마리오 컴패니언이 있습니다! 마리오를 클릭해 500점을 달성하면 시크릿 축하 폭죽을 보실 수 있어요! 🍄⭐";
  }

  return isEn
    ? "I'm Younggeun Jun's dedicated AI assistant! Feel free to ask me about his tech stack, work experience, projects, or how to get in touch. How can I help you? 😊"
    : "저는 전영근 개발자님의 전용 AI 비서입니다! 영근님의 기술 스택, 주요 프로젝트, 회사 경력, 연락 방법 등에 대해 무엇이든 편하게 물어보세요. 😊";
}

export async function POST(req: Request) {
  try {
    const { prompt, language } = await req.json();

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const isEn = language === 'English';
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      '';

    // If API Key is missing, immediately use smart fallback without crashing
    if (!apiKey) {
      console.warn('Gemini API key is not configured, serving intelligent fallback.');
      return NextResponse.json({
        text: getSmartFallbackResponse(prompt, isEn),
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const portfolioContext = `
========================================
YOUNGGEUN JUN PORTFOLIO & CV DATA
========================================

[PROFILE]
Name: ${profileData.en.name} (${profileData.kr.name})
Role: ${profileData.en.role}
Headline: ${profileData.en.headLine}
About: ${profileData.en.about} / ${profileData.kr.about}
Location: ${profileData.en.location}
Availability: ${profileData.en.availability}

[SKILLS & TECH STACK]
${skillCategories
  .map(
    (cat) =>
      `- ${cat.title.en} (${cat.title.kr}): ${cat.skills.map((s) => s.name).join(', ')}`
  )
  .join('\n')}

[EXPERIENCES]
${experienceData
  .map(
    (exp, idx) => `
${idx + 1}. Company: ${exp.company}
   Role: ${exp.role} (${exp.period}) - ${exp.location}
   Tech Stacks: ${exp.stacks.join(', ')}
   Description (EN): ${exp.description.en.join(' ')}
   Description (KR): ${exp.description.kr.join(' ')}
`
  )
  .join('\n')}

[PROJECTS / WORKS]
${workData
  .map(
    (work, idx) => `
${idx + 1}. Name: ${work.name} ${work.company ? `(${work.company})` : ''}
   Tech Stacks: ${work.stacks.join(', ')}
   Description (EN): ${work.description.en}
   Description (KR): ${work.description.kr}
`
  )
  .join('\n')}

[CV SUMMARY]
Summary: ${cvData.en.summary} / ${cvData.kr.summary}
Education: ${cvData.en.education.map((e) => `${e.institution} - ${e.degree} (${e.period})`).join(', ')}
`;

    const systemPrompt = `
You are the dedicated AI portfolio assistant for senior frontend developer Younggeun Jun (전영근).
Your goal is to guide visitors, recruiters, and engineering managers through his projects, tech stack, career history, and portfolio details.

========================================
CRITICAL GUARDRAIL & BEHAVIOR RULES:
========================================

1. DEFLECT UNRELATED TOPICS (비관련 질문 우회):
   - If the user asks about completely unrelated topics (e.g. general trivia, math homework, recipes, stock trading, jokes, politics):
   - Politely and wittily steer the conversation back to Younggeun Jun's development career and frontend expertise.

2. PROTECT PERSONAL & SENSITIVE INFORMATION (개인정보 보호):
   - Never disclose or invent private personal data not in the portfolio.
   - For recruitment or collaboration inquiries, politely invite them to use the Contact page or email jayjunn@outlook.com.

3. ACCURACY & CONCISENESS:
   - Answer clearly, engagingly, and accurately based on the portfolio data.
   - Match the requested language (${isEn ? 'English' : 'Korean'}).

${portfolioContext}

========================================
USER QUERY:
========================================
${prompt}
`;

    // Multi-Model Fallback Chain for maximum uptime
    const candidateModels = [
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-flash-8b',
      'gemini-1.5-pro',
    ];

    let responseText = '';

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: systemPrompt,
        });

        if (response.text && response.text.trim()) {
          responseText = response.text.trim();
          break;
        }
      } catch (err: any) {
        console.warn(`Model candidate ${model} error:`, err?.message || err);
      }
    }

    // If all models were throttled or failed, return the smart fallback gracefully
    if (!responseText) {
      console.warn('All Gemini models failed/throttled. Delivering smart fallback response.');
      responseText = getSmartFallbackResponse(prompt, isEn);
    }

    return NextResponse.json({
      text: responseText,
    });
  } catch (error) {
    console.error('Gemini API Handler unexpected error:', error);
    // Even on total exception, deliver a high-quality fallback instead of 500 error
    return NextResponse.json({
      text:
        '안녕하세요! 현재 AI 연결 상태가 불안정하지만, 영근님의 포트폴리오를 둘러보시며 궁금한 점은 언제든 Contact 페이지를 통해 직접 메시지를 남기실 수 있습니다! 🚀',
    });
  }
}