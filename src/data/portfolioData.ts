export interface Project {
  id: number;
  name: string;
  category: 'all' | 'web' | 'enterprise' | 'web3' | 'mobile';
  company?: string;
  period?: string;
  img: string;
  description: {
    en: string;
    kr: string;
  };
  fullDescription?: {
    en: string;
    kr: string;
  };
  keyFeatures?: {
    en: string[];
    kr: string[];
  };
  stacks: string[];
  link: string;
  github?: string;
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
  description: {
    en: string[];
    kr: string[];
  };
  stacks: string[];
}

export interface SkillCategory {
  title: { en: string; kr: string };
  skills: { name: string; level?: string; icon?: string; badge?: string }[];
}

export const profileData = {
  en: {
    name: 'YOUNGGEUN JUN',
    role: 'SOFTWARE ENGINEER / FRONT-END DEVELOPER',
    location: 'Seoul',
    availability: 'Open to exciting opportunities & collaborations',
    headLine: 'I make digital screens do cool stuff.',
    taglines: [
      'Front-End Software Engineer',
      'Auth & Security Architecture (Passkeys / OAuth)',
      'Cross-Platform WebView & Next.js Specialist',
      'CI/CD Test Automation & Performance',
    ],
    about: `Seasoned Front-End Software Engineer with 6+ years of experience across high-traffic global e-commerce, blockchain enterprise solutions, and large-scale web applications. Proven track record in leading authentication domain modernizations, implementing phishing-resistant Passkeys and OAuth flows, optimizing hybrid mobile WebView bridges, and dramatically speeding up CI/CD test automation pipelines.`,
    secondaryAbout: `I obsess over frictionless authentication UX, clean architectural patterns, bi-directional web-to-native bridges, and high-velocity CI/CD pipelines.`,
    skills: [
      'TYPESCRIPT',
      'JAVASCRIPT (ES6+)',
      'REACT',
      'NEXT.JS',
      'REDUX',
      'REACT QUERY',
      'REACT NATIVE',
      'TAILWIND CSS',
      'PASSKEYS (FIDO2 / WEBAUTHN)',
      'OAUTH 2.0',
      'WEBVIEW NATIVE BRIDGE',
      'PLAYWRIGHT / CYPRESS',
      'JEST',
      'NODE.JS / EXPRESS',
      'CI/CD PARALLELIZATION',
    ],
    stats: [
      { value: '6+', label: 'Years Experience', sub: 'Front-End Software Engineer' },
      { value: '10+', label: 'Shipped Projects', sub: 'Enterprise & Consumer' },
      { value: '100%', label: 'Responsive UX', sub: 'Pixel-perfect Design' },
      { value: '+24%', label: 'Conversion Lift', sub: 'E-Commerce UX Optimization' },
    ],
  },
  kr: {
    name: '전영근',
    role: 'SOFTWARE ENGINEER / FRONT-END DEVELOPER',
    location: '서울',
    availability: '새로운 기회와 혁신적인 프로젝트에 열려있습니다',
    headLine: '디지털 기기 화면에 표시되는 무언가를 만드는걸 좋아하는 프론트엔드 개발자 입니다.',
    taglines: [
      '프론트엔드 소프트웨어 엔지니어',
      '차세대 인증·보안 아키텍처 (Passkeys / OAuth)',
      '크로스 플랫폼 WebView & Next.js 전문가',
      'CI/CD 테스트 자동화 및 성능 최적화',
    ],
    about: `대규모 트래픽의 글로벌 이커머스(eBay Japan, Germanier, COS), 블록체인 엔터프라이즈 솔루션(Blocko), 대규모 웹 애플리케이션 전반에서 6년 이상의 실무 경험을 쌓은 프론트엔드 소프트웨어 엔지니어입니다. 레거시 인증(Auth)·회원 도메인의 모던화 주도, 피싱 방지 패스키(Passkeys) 및 OAuth 2.0 플로우 구축, 하이브리드 모바일 WebView 네이티브 브릿지 최적화, 그리고 CI/CD 테스트 자동화 파이프라인의 획기적인 속도 개선(42%+ 단축) 등 검증된 기술적 성과를 보유하고 있습니다.`,
    secondaryAbout: `매끄러운 온보딩·인증 UX, 확장 가능한 클린 아키텍처, 양방향 웹-네이티브 브릿지 연동, 그리고 고속 CI/CD 배포 파이프라인에 깊은 열정을 가지고 있습니다.`,
    skills: [
      'TYPESCRIPT',
      'JAVASCRIPT (ES6+)',
      'REACT',
      'NEXT.JS',
      'REDUX',
      'REACT QUERY',
      'REACT NATIVE',
      'TAILWIND CSS',
      'PASSKEYS (FIDO2 / WEBAUTHN)',
      'OAUTH 2.0',
      'WEBVIEW NATIVE BRIDGE',
      'PLAYWRIGHT / CYPRESS',
      'JEST',
      'NODE.JS / EXPRESS',
      'CI/CD PARALLELIZATION',
    ],
    stats: [
      { value: '6년+', label: '실무 경력', sub: '프론트엔드 소프트웨어 엔지니어' },
      { value: '10+', label: '완성 프로젝트', sub: '엔터프라이즈 & 토이 서비스' },
      { value: '100%', label: '완성도 높은 반응형', sub: '직관적이고 유려한 UX' },
      { value: '+24%', label: '구매 전환 상승', sub: '이커머스 UX 최적화' },
    ],
  },
};

export const skillCategories: SkillCategory[] = [
  {
    title: { en: 'Languages & Core', kr: '언어 & 코어 (Languages & Core)' },
    skills: [
      { name: 'TypeScript', badge: 'Core' },
      { name: 'JavaScript (ES6+)', badge: 'Core' },
      { name: 'HTML5', badge: 'Semantic' },
      { name: 'CSS3 / SCSS', badge: 'Styling' },
      { name: 'SQL', badge: 'Database' },
    ],
  },
  {
    title: { en: 'Frameworks & State', kr: '프레임워크 & 상태 관리 (Frameworks & State)' },
    skills: [
      { name: 'React', badge: 'Frontend' },
      { name: 'Next.js', badge: 'App / Pages' },
      { name: 'Redux', badge: 'State' },
      { name: 'React Query', badge: 'Server State' },
      { name: 'React Native', badge: 'Mobile' },
      { name: 'Tailwind CSS', badge: 'UI' },
      { name: 'Node.js', badge: 'Runtime' },
      { name: 'Express', badge: 'Backend' },
    ],
  },
  {
    title: { en: 'Auth & Security', kr: '인증 & 보안 (Auth & Security)' },
    skills: [
      { name: 'Passkeys (WebAuthn / FIDO2)', badge: 'Next-Gen Auth' },
      { name: 'OAuth 2.0', badge: 'Social Login' },
      { name: 'WebView Native Bridge', badge: 'iOS / Android' },
      { name: 'Token & Session Management', badge: 'Security' },
    ],
  },
  {
    title: { en: 'Testing & DevOps', kr: '테스팅 & 데브옵스 (Testing & DevOps)' },
    skills: [
      { name: 'Jest', badge: 'Unit Test' },
      { name: 'Cypress', badge: 'E2E' },
      { name: 'Playwright', badge: 'Automation' },
      { name: 'CI/CD Test Parallelization', badge: 'Runtime -42%+' },
      { name: 'Git', badge: 'VCS' },
      { name: 'GitHub Actions', badge: 'CI/CD' },
    ],
  },
];

export const workData: Project[] = [
  {
    id: 7,
    name: 'eBay Japan',
    company: 'Company',
    category: 'enterprise',
    period: '10/2022 – Present',
    featured: true,
    img: '/logos/ebay.svg',
    description: {
      en: 'Currently working as a Software Engineer (Front-End) at eBay Japan.',
      kr: '현재 eBay Japan(이베이 재팬)에서 프론트엔드 소프트웨어 엔지니어로 재직 중입니다.',
    },
    stacks: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
    ],
    link: 'https://www.qoo10.jp',
    github: 'https://github.com/jayjunn',
  },
  {
    id: 5,
    name: 'Blocko',
    company: 'Company',
    category: 'web3',
    period: '05/2022 – 10/2022',
    featured: true,
    img: '/logos/blocko.svg',
    description: {
      en: 'Engineered a personalized NFT minting and token generating web application utilizing Aergo blockchain APIs and web3 integration patterns, featuring scalable React/TypeScript UIs and complex data visual analytics.',
      kr: 'Aergo 블록체인 API와 Web3 연동 패턴을 활용한 맞춤형 NFT 민팅 및 토큰 발행 웹 애플리케이션 구축. React, TypeScript, SCSS 기반의 확장 가능한 컴포넌트 UI 및 데이터 시각화 분석 대시보드 개발.',
    },
    stacks: ['React', 'TypeScript', 'SCSS', 'Aergo API', 'Web3', 'Data Analytics'],
    link: 'https://www.blocko.io/',
    github: 'https://github.com/jayjunn',
  },
  {
    id: 9,
    name: 'Germanier',
    company: 'Company',
    category: 'enterprise',
    period: '06/2021 – 04/2022',
    featured: true,
    img: '/logos/germanier.svg',
    description: {
      en: 'Spearheaded luxury e-commerce storefront development with responsive design & accessibility (+19% online sales revenue) and engineered a dynamic "Recently Viewed Items" tracking module (+24% average items per transaction).',
      kr: '반응형 디자인과 웹 접근성 표준을 적용한 럭셔리 이커머스 스토어프론트 개발을 주도하여 온라인 매출 +19% 성장을 견인하고, 동적 "최근 본 상품" 트래킹 모듈을 설계·구현하여 거래당 평균 구매 상품 수 +24% 증가 달성.',
    },
    stacks: ['JavaScript (ES6+)', 'React', 'HTML5', 'CSS3 / SCSS', 'A/B Testing', 'Web Performance'],
    link: 'https://kevingermanier.com/',
    github: 'https://github.com/jayjunn',
  },
  {
    id: 4,
    name: 'COS (H&M Group)',
    company: 'Company',
    category: 'enterprise',
    period: '12/2017 – 02/2021',
    featured: true,
    img: '/logos/cos.png',
    description: {
      en: 'Maintained and launched commercial web content across global regional locales for COS (H&M Group), collaborating with UI/UX designers on conversion A/B testing and engineering responsive automated newsletter campaigns.',
      kr: '글로벌 패션 브랜드 COS(H&M Group)의 글로벌 로케일 상용 웹 콘텐츠 구축 및 운영. UI/UX 디자이너와 협업하여 구매 전환율 최적화 A/B 테스트를 진행하고 글로벌 고객 대상 반응형 자동화 뉴스레터 캠페인을 엔지니어링.',
    },
    stacks: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'Enterprise CMS', 'A/B Testing'],
    link: 'https://www.cos.com/',
    github: 'https://github.com/jayjunn',
  },
  {
    id: 8,
    name: 'Lucky Draw',
    company: 'Toy Project',
    category: 'web',
    period: '2024',
    featured: true,
    img: '/logos/luckydraw.svg',
    description: {
      en: 'Real-time interactive lucky draw platform for live events. Features mobile-first digital pass (QR code), 16:9 stage display, and instant WebSocket lottery synchronization.',
      kr: '현장 이벤트 및 파티를 위한 실시간 인터랙티브 럭키드로우 플랫폼. 모바일 QR 티켓 발급, 16:9 대형 전광판, WebSocket 기반 실시간 추첨 및 즉시 재추첨 시스템 구축.',
    },
    stacks: ['Next.js', 'React', 'TypeScript', 'Socket.io', 'Tailwind CSS', 'Framer Motion', 'Firebase'],
    link: 'https://github.com/jayjunn/lucky-draw',
    github: 'https://github.com/jayjunn/lucky-draw',
  },
  {
    id: 6,
    name: 'Airbnb Clone',
    company: 'Toy Project',
    category: 'web',
    period: '2023',
    featured: true,
    img: '/logos/airbnb.svg',
    description: {
      en: 'Full-stack Airbnb clone built with Next.js App Router, React, Tailwind CSS, Prisma, MongoDB, and NextAuth.',
      kr: 'Next.js App Router, React, Tailwind CSS, Prisma, MongoDB, NextAuth를 활용해 구축한 풀스택 에어비앤비 클론 프로젝트.',
    },
    stacks: ['Next.js', 'React', 'Tailwind CSS', 'Prisma', 'MongoDB', 'NextAuth'],
    link: 'https://full-stack-arirbnb-jd65ilvto-jayjunn.vercel.app/',
    github: 'https://github.com/jayjunn',
  },
  {
    id: 0,
    name: 'Humble Bank',
    company: 'Toy Project',
    category: 'mobile',
    period: '2022',
    featured: false,
    img: '/logos/humble.svg',
    description: {
      en: 'Humble Bank is an iOS app aimed at helping users track and categorize their financial transactions.',
      kr: '사용자의 금융 거래 내역을 기록하고 카테고리별로 분류할 수 있도록 돕는 React Native 및 Node.js 기반 모바일 앱.',
    },
    stacks: ['React Native', 'Expo', 'Express', 'MongoDB'],
    link: 'https://github.com/jayjunn/humble-bank',
    github: 'https://github.com/jayjunn/humble-bank',
  },
  {
    id: 2,
    name: 'FeedBack',
    company: 'Toy Project',
    category: 'web',
    period: '2022',
    featured: false,
    img: '/logos/feedback.svg',
    description: {
      en: 'A web platform where customers can leave reviews with an interactive star rating system.',
      kr: '고객이 별점 평가 시스템으로 실시간 리뷰를 남길 수 있는 웹 플랫폼.',
    },
    stacks: ['React', 'TypeScript'],
    link: 'https://github.com/jayjunn/Customer-feedback',
    github: 'https://github.com/jayjunn/Customer-feedback',
  },
];

export const experienceData: ExperienceItem[] = [
  {
    id: 'ebay-japan',
    role: 'Software Engineer (Front-End)',
    company: 'eBay Japan',
    period: '10/2022 – Present',
    location: 'Tokyo / Seoul',
    highlights: [
      'Current Employment',
      'Front-End Engineering',
      'Global E-Commerce',
    ],
    description: {
      en: [
        'Currently working as a Front-End Software Engineer at eBay Japan.',
      ],
      kr: [
        '현재 eBay Japan(이베이 재팬)에서 프론트엔드 소프트웨어 엔지니어로 재직 중입니다.',
      ],
    },
    stacks: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
    ],
  },
  {
    id: 'blocko',
    role: 'Front-End Developer',
    company: 'Blocko',
    period: '05/2022 – 10/2022',
    location: 'Seoul, South Korea',
    highlights: ['Aergo Blockchain & Web3', 'NFT Minting & Token Generation', 'Visual Data Analytics'],
    description: {
      en: [
        'Engineered a personalized NFT minting and token generating web application utilizing Aergo blockchain APIs and web3 integration patterns.',
        'Developed scalable, component-driven user interfaces using React, TypeScript, and SCSS with complex front-end data visual analytics.',
        'Collaborated within a bi-weekly Agile/Scrum sprint framework, partnering with cross-functional product stakeholders to deliver production-grade blockchain services.',
      ],
      kr: [
        'Aergo 블록체인 API 및 Web3 연동 패턴을 활용하여 맞춤형 NFT 민팅 및 토큰 생성 웹 애플리케이션 구축.',
        'React, TypeScript, SCSS를 기반으로 복잡한 프론트엔드 데이터 시각화 분석 기능을 갖춘 확장 가능한 컴포넌트 중심 UI 개발.',
        '2주 단위의 애자일/스크럼(Agile/Scrum) 스프린트 환경에서 다양한 직군의 프로덕트 이해관계자들과 긴밀히 협업하여 상용 수준의 블록체인 서비스 출시.',
      ],
    },
    stacks: ['React', 'TypeScript', 'SCSS', 'Aergo Blockchain API', 'Web3', 'Data Visualization'],
  },
  {
    id: 'germanier',
    role: 'Front-End Web Developer',
    company: 'Germanier',
    period: '06/2021 – 04/2022',
    location: 'Paris / Remote',
    highlights: ['+19% Online Sales Revenue', '+24% Avg Items per Transaction', 'A/B Testing & Web Perf'],
    description: {
      en: [
        'Spearheaded e-commerce storefront development with responsive design and accessibility standards, driving a +19% increase in online sales revenue.',
        'Designed and implemented a dynamic "Recently Viewed Items" tracking module, driving a +24% increase in average items purchased per transaction.',
        'Conducted user-centric A/B testing and optimized web performance to maximize digital conversion rates.',
      ],
      kr: [
        '반응형 디자인과 웹 접근성 표준을 준수한 이커머스 스토어프론트 개발을 주도하여 온라인 매출 +19% 증가 견인.',
        '동적 "최근 본 상품(Recently Viewed Items)" 트래킹 모듈을 직접 설계 및 구현하여 거래당 평균 구매 상품 수 +24% 상승 달성.',
        '사용자 중심의 A/B 테스트를 수행하고 웹 성능을 최적화하여 디지털 구매 전환율 극대화.',
      ],
    },
    stacks: ['JavaScript (ES6+)', 'React', 'HTML5', 'CSS3 / SCSS', 'A/B Testing', 'Web Accessibility'],
  },
  {
    id: 'cos',
    role: 'Website Publisher & Digital Marketing Coordinator',
    company: 'COS (H&M Group)',
    period: '12/2017 – 02/2021',
    location: 'Seoul, South Korea',
    highlights: ['Global Regional Locales', 'Conversion Funnel A/B Tests', 'Automated Newsletters'],
    description: {
      en: [
        'Maintained, updated, and launched commercial web content across global regional locales using modern ES6+, HTML5, CSS3, and enterprise CMS.',
        'Collaborated directly with digital experience and UI/UX designers to design and launch A/B tests aimed at optimizing visitor conversion funnels.',
        'Monitored website health, diagnosed CMS errors, and engineered responsive automated newsletter campaigns distributed to worldwide customer databases.',
      ],
      kr: [
        '모던 ES6+, HTML5, CSS3 및 엔터프라이즈 CMS를 활용하여 글로벌 지역 로케일 전반의 상용 웹 콘텐츠를 유지보수, 업데이트 및 런칭.',
        '디지털 경험(DX) 및 UI/UX 디자이너와 직접 협업하여 방문자 전환 퍼널 최적화를 위한 A/B 테스트를 설계하고 실행.',
        '웹사이트 상태를 상시 모니터링하고 CMS 오류를 진단·해결했으며, 전 세계 고객 데이터베이스에 발송되는 반응형 자동화 뉴스레터 캠페인을 엔지니어링.',
      ],
    },
    stacks: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'Enterprise CMS', 'A/B Testing'],
  },
];

export const cvData = {
  en: {
    title: 'CURRICULUM VITAE',
    name: 'YOUNGGEUN JUN',
    role: 'SOFTWARE ENGINEER / FRONT-END DEVELOPER',
    email: 'jayjunn@outlook.com',
    location: 'Seoul, South Korea',
    github: 'https://github.com/jayjunn',
    linkedin: 'https://www.linkedin.com/in/younggeun',
    summary: `Seasoned Front-End Software Engineer with 6+ years of experience across high-traffic global e-commerce, blockchain enterprise solutions, and large-scale web applications. Proven track record in leading authentication domain modernizations, implementing phishing-resistant Passkeys and OAuth flows, optimizing hybrid mobile WebView bridges, and dramatically speeding up CI/CD test automation pipelines.`,
    education: [
      {
        institution: 'Korea National Open University (KNOU)',
        degree: 'B.S. in Computer Science',
        period: 'In Progress',
        location: 'Seoul, South Korea',
      },
      {
        institution: 'Codeworks',
        degree: 'Software Engineering Immersive',
        period: '2021',
        location: 'London',
      },
    ],
    languages: [
      { language: 'Korean', proficiency: 'Native' },
      { language: 'English', proficiency: 'Professional Working Proficiency' },
      { language: 'Japanese', proficiency: 'Conversational / Business' },
    ],
  },
  kr: {
    title: '이력서 및 경력 기술서',
    name: '전영근',
    role: 'SOFTWARE ENGINEER / FRONT-END DEVELOPER',
    email: 'jayjunn@outlook.com',
    location: '대한민국 서울',
    github: 'https://github.com/jayjunn',
    linkedin: 'https://www.linkedin.com/in/younggeun',
    summary: `대규모 트래픽의 글로벌 이커머스, 블록체인 엔터프라이즈 솔루션, 대규모 웹 애플리케이션 전반에서 6년 이상의 실무 경험을 쌓은 프론트엔드 소프트웨어 엔지니어입니다. 레거시 인증(Auth)·회원 도메인의 모던화 주도, 피싱 방지 패스키(Passkeys) 및 OAuth 2.0 플로우 구축, 하이브리드 모바일 WebView 네이티브 브릿지 최적화, 그리고 CI/CD 테스트 자동화 파이프라인의 획기적인 속도 개선(42%+ 단축) 등 검증된 기술적 성과를 보유하고 있습니다.`,
    education: [
      {
        institution: '한국방송통신대학교 (KNOU)',
        degree: '컴퓨터과학과 학사 (B.S. in Computer Science)',
        period: '재학 중 (In Progress)',
        location: '대한민국 서울',
      },
      {
        institution: 'Codeworks',
        degree: 'Software Engineering Immersive',
        period: '2021',
        location: '영국 런던 (London)',
      },
    ],
    languages: [
      { language: '한국어', proficiency: '원어민' },
      { language: '영어', proficiency: '업무상 원활한 의사소통 가능' },
      { language: '일본어', proficiency: '일상 및 비즈니스 회화 가능' },
    ],
  },
};
