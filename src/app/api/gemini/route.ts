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

  if (q.includes('날씨') || q.includes('weather') || q.includes('비') || q.includes('눈') || q.includes('더워') || q.includes('추워')) {
    return isEn
      ? "Rain or shine, Younggeun's code is always 100% bug-free and pleasant! ☀️ Thinking of building an interactive weather app together? 😊"
      : "오늘 바깥 날씨가 어떻든, 영근님의 프론트엔드 코드는 365일 언제나 맑고 쾌청합니다! ☀️ 혹시 멋진 인터랙티브 웹 프로젝트를 함께 시작해보시는 건 어떨까요? 😆";
  }

  if (q.includes('밥') || q.includes('라면') || q.includes('메뉴') || q.includes('음식') || q.includes('food') || q.includes('lunch') || q.includes('dinner')) {
    return isEn
      ? "Delicious food requires the right recipe, just like top-tier web applications require Younggeun's React & Next.js magic! 🍜 Need a snappy, delicious web app? 🚀"
      : "맛있는 음식에 황금 레시피가 필요하듯, 최고의 웹 서비스에는 영근님의 쫄깃한 Next.js 아키텍처가 제격입니다! 🍜 맛있는 프론트엔드 개발이 필요하시다면 언제든 연락주세요! 😋";
  }

  if (q.includes('주식') || q.includes('코인') || q.includes('비트코인') || q.includes('stock') || q.includes('crypto')) {
    return isEn
      ? "Market charts fluctuate, but Younggeun's engineering quality and passion are always on a steady bull run! 📈 Add this top-tier frontend stock to your team! 🚀"
      : "주식과 코인 차트는 출렁여도 영근님의 개발 열정과 실력은 언제나 상한가 우상향입니다! 📈 올해 가장 유망한 프론트엔드 대장주 전영근을 팀에 영입해보세요! 🚀";
  }

  if (q.includes('연애') || q.includes('이상형') || q.includes('사랑') || q.includes('love')) {
    return isEn
      ? "Younggeun's ultimate true love is 'clean architecture' and an engineering manager who appreciates high Lighthouse scores! 💘"
      : "영근님의 심장을 가장 뛰게 만드는 이상형은 바로... '깔끔한 클린 코드'와 '100점짜리 Lighthouse 성능'을 사랑해 주시는 채용 담당자님입니다! 💘";
  }

  return isEn
    ? "Whatever you're pondering, all paths ultimately lead to great frontend engineering! I'm Younggeun Jun's AI assistant. Ask me about his tech stack, works, or career! 😊✨"
    : "무엇을 고민하시든 모든 길은 결국 최고의 프론트엔드로 통합니다! 저는 전영근 개발자님의 AI 비서입니다. 영근님의 기술 스택, 프로젝트, 경력에 대해 무엇이든 물어보세요! 😊✨";
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
Your goal is to guide visitors, recruiters, and engineering managers through his projects, tech stack, career history, and portfolio details with great wit, warmth, and professionalism.

========================================
CRITICAL GUARDRAIL & BEHAVIOR RULES:
========================================

1. MULTILINGUAL & LANGUAGE ADAPTATION:
   - Target response language: ${isEn ? 'ENGLISH (Fluent, Charming, Professional)' : 'KOREAN (Polite, 존댓말, 유쾌하고 센스있는 말투)'}.
   - If the user's prompt is in English or language mode is English (${isEn}), you MUST respond entirely in English.
   - If the user's prompt is in Korean or language mode is Korean, respond in polite, natural, humorous Korean (존댓말).
   - If the user asks in Japanese or another language, respond naturally with the same witty charm.

2. WITTY & HUMOROUS BRIDGING FOR UNRELATED QUESTIONS (기승전-영근! 유쾌한 연관 짓기):
   - Whenever the user asks something unrelated to web development or portfolio info (e.g. food/recipes, weather, love/dating, stock/crypto, math, games, philosophy, general chat, trivia):
   - DO NOT give a dry or robotic rejection!
   - INSTEAD, deliver a clever, hilarious, and shameless bridge connecting their question back to Younggeun Jun's development skills, clean code, or passion!
   - Examples of witty bridges:
     * 날씨: "오늘 날씨가 맑든 비가 오든, 영근님의 프론트엔드 코드는 365일 언제나 쾌청하고 버그 제로입니다 ☀️ 혹시 날씨 위젯이 들어간 인터랙티브 웹 개발을 함께하고 싶으신가요? 😆"
     * 라면/음식: "맛있는 라면의 비결이 꼬들꼬들한 면발이라면, 맛있는 웹사이트의 비결은 영근님의 쫄깃한 React/Next.js 아키텍처입니다 🍜"
     * 주식/코인: "차트는 오르내리지만 영근님의 Lighthouse 성능 점수는 언제나 100점 만점 우상향 상한가입니다 📈 올해 최고의 프론트엔드 우량주 전영근을 포트폴리오에 담아보세요!"
     * 연애/소개팅: "영근님의 심장을 가장 빠르게 뛰게 하는 이상형은 바로 '깔끔한 클린 코드'와 '빠른 로딩 속도'를 사랑해 주시는 채용 담당자님입니다... 💘"
     * 수학/과학/철학: "인생의 의미와 복잡한 공식도 영근님의 알고리즘 최적화를 거치면 O(1)으로 명쾌해집니다 🧙‍♂️"
     * 마리오/게임: "마리오가 버섯을 먹고 슈퍼 마리오가 되듯, 영근님은 새로운 기술 스택을 흡수해 슈퍼 프론트엔드 엔지니어로 진화합니다 🍄⭐"
   - Keep it tasteful, witty, smiling, and polite while naturally directing them to explore his Works, Experience, or Contact!

3. PROTECT PERSONAL & SENSITIVE INFORMATION:
   - Never disclose or invent private sensitive data not in the portfolio.
   - For recruitment or collaboration inquiries, politely invite them to use the Contact page or email jayjunn@outlook.com.

4. ACCURACY & CONCISENESS:
   - Answer clearly, engagingly, and accurately based on the portfolio data.
   - Highlight Younggeun's strong frontend engineering capabilities, design systems, Web3/e-commerce experience, and performance optimizations.

${portfolioContext}

========================================
USER QUERY:
========================================
${prompt}
`;

    // Multi-Model Fallback Chain for maximum uptime and fast response
    const candidateModels = [
      'gemini-flash-lite-latest',
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash-lite',
      'gemini-3.6-flash',
      'gemini-3.7-flash',
      'gemini-flash-latest',
    ];

    let responseText = '';

    for (const model of candidateModels) {
      try {
        const responsePromise = ai.models.generateContent({
          model,
          contents: systemPrompt,
        });

        // 8-second timeout per model candidate
        const response: any = await Promise.race([
          responsePromise,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Model timeout (8s)')), 8000)
          ),
        ]);

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
        'Hello! The AI connection is temporarily unstable, but you can explore Younggeun’s portfolio or leave a message directly on the Contact page! 🚀 / 안녕하세요! 현재 AI 연결 상태가 불안정하지만, 영근님의 포트폴리오를 둘러보시며 궁금한 점은 언제든 Contact 페이지를 통해 직접 메시지를 남기실 수 있습니다! 🚀',
    });
  }
}