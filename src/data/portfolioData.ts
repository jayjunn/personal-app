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
    role: 'CREATIVE FRONT-END DEVELOPER',
    location: 'Seoul & Tokyo',
    availability: 'Open to exciting opportunities & collaborations',
    headLine: 'I make digital screens do cool stuff.',
    taglines: [
      'Creative Software Developer',
      'Interactive UI/UX Craftsman',
      'Web Performance & Modern Architecture',
      'React & Next.js Specialist',
    ],
    about: `I'm a Creative Software Developer who bridges engineering precision and design aesthetics. With deep experience spanning enterprise e-commerce (eBay Japan, COS) and cutting-edge Web3 SaaS (Blocko), I specialize in building responsive, high-performance, and delightful web applications.`,
    secondaryAbout: `I obsess over fluid micro-interactions, clean architectural patterns, lightning-fast build pipelines, and accessibility. Outside of work, I experiment with creative coding, kinetic UI, and full-stack side projects.`,
    stats: [
      { value: '5+', label: 'Years Experience', sub: 'Front-End & Creative Dev' },
      { value: '20%', label: 'Build Speed Gain', sub: 'Rspack Migration @ eBay' },
      { value: '10+', label: 'Shipped Projects', sub: 'Enterprise & Consumer' },
      { value: '100%', label: 'Responsive UX', sub: 'Pixel-perfect Design' },
    ],
  },
  kr: {
    name: '전영근',
    role: '프론트엔드 개발자 & 인터랙티브 엔지니어',
    location: '서울 & 도쿄',
    availability: '새로운 기회와 혁신적인 프로젝트에 열려있습니다',
    headLine: '디지털 화면 위에 특별하고 직관적인 경험을 만듭니다.',
    taglines: [
      '크리에이티브 프론트엔드 개발자',
      '인터랙티브 UI/UX 엔지니어',
      '웹 성능 최적화 & 모던 웹 아키텍처',
      'React & Next.js 전문가',
    ],
    about: `성장에서 즐거움을 찾고 뛰어난 사용자 경험을 제공하는 혁신적이고 신뢰할 수 있는 서비스를 만드는 개발자 전영근입니다. 글로벌 이커머스(eBay Japan, COS)와 블록체인 SaaS(Blocko) 등 다양한 도메인에서 대규모 서비스 개선 및 고성능 프론트엔드를 구축해 왔습니다.`,
    secondaryAbout: `매끄러운 마이크로 인터랙션, 클린 아키텍처, 빠른 빌드 파이프라인(Webpack → Rspack 마이그레이션 등), 그리고 크로스 브라우징 및 반응형 UX 완성도에 깊은 열정을 가지고 있습니다.`,
    stats: [
      { value: '5년+', label: '실무 경력', sub: '프론트엔드 & 풀스택 개발' },
      { value: '20%', label: '빌드 속도 개선', sub: 'eBay Japan Rspack 도입' },
      { value: '10+', label: '완성 프로젝트', sub: '엔터프라이즈 & 토이 서비스' },
      { value: '100%', label: '완성도 높은 반응형', sub: '직관적이고 유려한 UX' },
    ],
  },
};

export const skillCategories: SkillCategory[] = [
  {
    title: { en: 'Core & Frameworks', kr: '코어 & 프레임워크' },
    skills: [
      { name: 'React', badge: 'Expert' },
      { name: 'Next.js', badge: 'App Router' },
      { name: 'TypeScript', badge: 'Advanced' },
      { name: 'JavaScript ES6+', badge: 'Core' },
      { name: 'HTML5 / Semantic Web', badge: 'A11y' },
      { name: 'React Native', badge: 'Mobile' },
    ],
  },
  {
    title: { en: 'State & Data Layer', kr: '상태 관리 & 데이터 레이어' },
    skills: [
      { name: 'TanStack Query', badge: 'Data Sync' },
      { name: 'SWR', badge: 'Cache' },
      { name: 'Jotai', badge: 'Atomic' },
      { name: 'GraphQL / Apollo', badge: 'API' },
      { name: 'RESTful APIs', badge: 'Integration' },
      { name: 'Node.js / Express', badge: 'Backend' },
    ],
  },
  {
    title: { en: 'Styling & Motion', kr: '스타일링 & 모션' },
    skills: [
      { name: 'Framer Motion', badge: 'Kinetic' },
      { name: 'TailwindCSS', badge: 'Modern' },
      { name: 'SCSS / CSS Modules', badge: 'Design System' },
      { name: 'Styled Components', badge: 'CSS-in-JS' },
      { name: 'HTML5 Canvas API', badge: 'Creative' },
      { name: 'Swiper.js', badge: 'Interactive' },
    ],
  },
  {
    title: { en: 'Build, Tools & DevOps', kr: '빌드, 도구 & 엔지니어링' },
    skills: [
      { name: 'Rspack / Webpack', badge: 'Speed +20%' },
      { name: 'Vite', badge: 'Tooling' },
      { name: 'Git / GitHub Actions', badge: 'CI/CD' },
      { name: 'Postman', badge: 'Testing' },
      { name: 'Figma', badge: 'Design Handoff' },
      { name: 'Vercel / Cloudflare', badge: 'Deploy' },
    ],
  },
  {
    title: { en: 'Specialized & Enterprise', kr: '특화 역량 & 엔터프라이즈' },
    skills: [
      { name: 'HLS Video Streaming', badge: 'Media' },
      { name: 'A/B Testing & Conversion', badge: 'Growth' },
      { name: 'Web Performance & Core Web Vitals', badge: 'Optimization' },
      { name: 'Web3 & Blockchain SaaS', badge: 'Fintech' },
      { name: 'Auth0 & NextAuth', badge: 'Security' },
    ],
  },
];

export const workData: Project[] = [
  {
    id: 6,
    name: 'Airbnb Full Stack Clone',
    company: 'Featured Project',
    category: 'web',
    period: '2023',
    featured: true,
    img: 'https://res.cloudinary.com/dgmnoyv6u/image/upload/v1688622910/Screenshot_2023-07-06_at_2.54.03_PM_a8dssi.png',
    description: {
      en: 'A high-fidelity Full Stack Airbnb clone engineered with Next.js 13 App Router, Tailwind CSS, Prisma ORM, MongoDB, and NextAuth.',
      kr: 'Next.js 13 App Router, Tailwind CSS, Prisma, MongoDB, NextAuth를 활용하여 정밀하게 구현한 풀스택 에어비앤비 클론 프로젝트입니다.',
    },
    fullDescription: {
      en: 'Features interactive map search, multi-step property creation wizard with image uploads, reservation booking flow, favorites list, and responsive server/client state management.',
      kr: '지도 기반 매물 탐색, 다단계 숙소 등록 위저드(이미지 업로드 포함), 실시간 예약 결제 플로우, 찜하기 및 서버/클라이언트 상태 동기화를 완벽하게 구현했습니다.',
    },
    keyFeatures: {
      en: [
        'Next.js 13 App Router with Server & Client components',
        'Prisma ORM integration with MongoDB Atlas database',
        'NextAuth authentication with Google and GitHub OAuth',
        'Interactive Leaflet maps integration with dynamic location selection',
      ],
      kr: [
        'Next.js 13 App Router 기반 서버/클라이언트 컴포넌트 최적화',
        'MongoDB Atlas 및 Prisma ORM을 통한 데이터 모델링',
        'Google & GitHub 소셜 로그인 인증 (NextAuth)',
        'Leaflet 지도 라이브러리를 연동한 인터랙티브 위치 검색',
      ],
    },
    stacks: ['Next.js 13', 'React', 'Tailwind CSS', 'Prisma', 'MongoDB', 'NextAuth', 'Leaflet'],
    link: 'https://full-stack-arirbnb-jd65ilvto-jayjunn.vercel.app/',
    github: 'https://github.com/jayjunn',
  },
  {
    id: 5,
    name: 'Blocko SilverMine & CCCV',
    company: 'Blocko Inc.',
    category: 'web3',
    period: '2022 - 2023',
    featured: true,
    img: 'https://res.cloudinary.com/dgmnoyv6u/image/upload/v1699489523/Screenshot_2023-11-09_at_9.23.51_AM_oonqih.png',
    description: {
      en: 'Enterprise-grade blockchain SaaS platforms helping enterprise clients and general users seamlessly access Web3 infrastructure and digital asset services.',
      kr: '엔터프라이즈부터 일반 사용자까지 블록체인 인프라와 디지털 자산 서비스를 손쉽게 활용할 수 있도록 돕는 엔터프라이즈 SaaS 플랫폼입니다.',
    },
    fullDescription: {
      en: 'Architected modular frontend components, interactive data visualization dashboards, wallet connection gateways, and real-time transaction tracking views in a fast-paced Agile sprint environment.',
      kr: '모듈형 프론트엔드 아키텍처를 설계하고, 실시간 트랜잭션 데이터 시각화 대시보드 및 가상자산 지갑 연동 인터페이스를 2주 단위 애자일 스프린트로 신속하게 론칭했습니다.',
    },
    keyFeatures: {
      en: [
        'Built real-time blockchain analytics and transactional charts',
        'State management using React Query & Custom Hooks for zero lag',
        'Strict TypeScript type safety and reusable design system tokens',
        'Collaborated directly with backend and UI/UX design teams in 2-week sprints',
      ],
      kr: [
        '실시간 블록체인 분석 및 트랜잭션 대시보드 시각화',
        'React Query를 통한 비동기 데이터 캐싱 및 지연 없는 UX 구현',
        '엄격한 TypeScript 타입 안정성과 재사용 가능한 디자인 시스템',
        '기획/디자인/백엔드 팀과의 긴밀한 협업을 통한 2주 단위 스프린트 완주',
      ],
    },
    stacks: ['React', 'TypeScript', 'TanStack Query', 'SCSS', 'Recharts', 'Web3.js'],
    link: 'https://beta.silvermine.me/',
    github: 'https://github.com/jayjunn',
  },
  {
    id: 7,
    name: 'eBay Japan Qoo10 Ads & Growth',
    company: 'eBay Japan',
    category: 'enterprise',
    period: '2023 - Present',
    featured: true,
    img: 'https://res.cloudinary.com/dgmnoyv6u/image/upload/v1699490958/Screenshot_2023-11-09_at_9.48.56_AM_j3tl6x.png',
    description: {
      en: 'High-traffic e-commerce engineering at eBay Japan (Qoo10), driving video ad streaming, build system migration to Rspack, and user onboarding UX.',
      kr: 'eBay Japan의 대규모 이커머스 플랫폼(Qoo10)에서 HLS 비디오 광고 스트리밍, Rspack 빌드 시스템 마이그레이션, 회원 온보딩 UX 개선을 주도했습니다.',
    },
    fullDescription: {
      en: 'Optimized video advertisement playback via HTTP Live Streaming (HLS) with zero frame drops. Migrated the legacy Webpack build pipeline to Rust-based Rspack, reducing local build and CI cycle times by 20%.',
      kr: 'HLS 스트리밍을 적용하여 성능 저하 없는 동영상 광고 플레이어를 구축하였고, 기존 Webpack을 Rust 기반 Rspack으로 마이그레이션하여 빌드 속도를 20% 단축시켰습니다.',
    },
    keyFeatures: {
      en: [
        'Migrated build tooling to Rspack for a 20% speedup across developer workflows',
        'Engineered responsive HLS video players with smooth adaptive bitrate',
        'Redesigned user onboarding and profile setting interfaces to boost conversion',
        'Optimized cross-browser performance and Core Web Vitals for millions of shoppers',
      ],
      kr: [
        'Webpack에서 Rspack으로 빌드 시스템 마이그레이션 (빌드 속도 20% 향상)',
        'HLS 기반 적응형 비디오 광고 플레이어 구현',
        '회원가입 및 프로필 관리 인터페이스 개편으로 전환율 개선',
        '수백만 사용자를 위한 크로스 브라우징 및 Core Web Vitals 최적화',
      ],
    },
    stacks: ['React', 'TypeScript', 'Rspack', 'HLS.js', 'Next.js', 'SCSS'],
    link: 'https://www.qoo10.jp',
    github: 'https://github.com/jayjunn',
  },
  {
    id: 4,
    name: 'COS Global E-Commerce',
    company: 'COS (H&M Group)',
    category: 'enterprise',
    period: '2019 - 2021',
    featured: true,
    img: 'https://res.cloudinary.com/dgmnoyv6u/image/upload/v1699490958/Screenshot_2023-11-09_at_9.48.56_AM_j3tl6x.png',
    description: {
      en: 'Global luxury fashion e-commerce initiatives, dynamic CMS content deployment, A/B conversion testing, and international localized digital campaigns.',
      kr: '글로벌 패션 브랜드 COS(H&M 그룹)의 글로벌 이커머스 웹사이트 콘텐츠 운영, CMS 최적화, A/B 테스트 및 데이터 기반 디지털 캠페인 개발.',
    },
    fullDescription: {
      en: 'Collaborated with international design and product teams across Europe and Asia to roll out responsive storefronts, conduct rigorous A/B experiments on navigation and checkout funnels, and maintain global accessibility standards.',
      kr: '글로벌 디자이너 및 기획자와 협력하여 반응형 쇼핑몰 UI를 개발하고, 구매 전환율 극대화를 위한 A/B 테스트 및 글로벌 웹 접근성 기준을 충족했습니다.',
    },
    keyFeatures: {
      en: [
        'Ran systematic A/B tests to optimize user conversion and engagement',
        'Developed dynamic newsletter templates and automated CMS pipelines',
        'Ensured high accessibility and pixel-perfect brand compliance across devices',
      ],
      kr: [
        '체계적인 A/B 테스트를 통한 사용자 전환율 및 체류 시간 개선',
        '글로벌 뉴스레터 템플릿 제작 및 CMS 파이프라인 자동화',
        '글로벌 브랜드 가이드라인 준수 및 다국어 지원 최적화',
      ],
    },
    stacks: ['JavaScript ES6+', 'HTML5', 'CSS3 / SASS', 'CMS', 'Adobe Creative Suite'],
    link: 'https://www.cos.com/',
    github: 'https://github.com/jayjunn',
  },
  {
    id: 0,
    name: 'Humble Bank Mobile',
    company: 'Mobile Project',
    category: 'mobile',
    period: '2022',
    featured: false,
    img: 'https://res.cloudinary.com/dgmnoyv6u/image/upload/v1654311191/portfolio/humble_bank_ekxbro.png',
    description: {
      en: 'An intuitive iOS & Android financial app crafted with React Native, Expo, Node.js Express, and MongoDB for tracking personal expense categories.',
      kr: 'React Native, Expo, Node.js, MongoDB로 제작한 개인 자산 및 소비 지출 내역 관리 모바일 앱입니다.',
    },
    fullDescription: {
      en: 'Provides smooth gesture-driven financial tracking, transaction categorization, dynamic charts, and cloud sync.',
      kr: '제스처 기반의 편리한 지출 기록, 스마트 카테고리 분류, 통계 차트 및 클라우드 동기화를 지원합니다.',
    },
    keyFeatures: {
      en: [
        'Cross-platform React Native & Expo architecture',
        'Custom REST API built with Node.js and Express',
        'Secure authentication and transaction history aggregation',
      ],
      kr: [
        'React Native & Expo 기반 크로스 플랫폼 모바일 아키텍처',
        'Node.js & Express 커스텀 REST API 백엔드',
        '소비 패턴 시각화 및 직관적인 입력 인터랙션',
      ],
    },
    stacks: ['React Native', 'Expo', 'Node.js', 'Express', 'MongoDB'],
    link: 'https://github.com/jayjunn/humble-bank',
    github: 'https://github.com/jayjunn/humble-bank',
  },
  {
    id: 1,
    name: 'Glue Knowledge Hub',
    company: 'Venture Project',
    category: 'web',
    period: '2021 - 2022',
    featured: false,
    img: 'https://res.cloudinary.com/dgmnoyv6u/image/upload/v1654311191/portfolio/glue_zdfvfz.png',
    description: {
      en: 'A peer-to-peer knowledge marketplace connecting subject-matter experts with learners through scheduled consultation sessions.',
      kr: '전문가와 사용자를 실시간 매칭하여 지식과 기술을 거래할 수 있는 마켓플레이스 플랫폼입니다.',
    },
    fullDescription: {
      en: 'Implemented full user journey from expert matching to calendar bookings, utilizing Next.js, GraphQL, PostgreSQL, and Auth0 security layer.',
      kr: '전문가 탐색부터 일정 예약, 결제 연동까지의 전체 흐름을 Next.js, GraphQL, PostgreSQL, Auth0 기반으로 구축했습니다.',
    },
    keyFeatures: {
      en: [
        'GraphQL queries & mutations for real-time scheduling data',
        'Auth0 authentication with RBAC (Role-Based Access Control)',
        'Responsive interactive booking and profile management cards',
      ],
      kr: [
        'GraphQL을 통한 효율적인 데이터 페칭 및 실시간 예약 시스템',
        'Auth0 기반 사용자 권한 관리 및 인증 시스템',
        '반응형 프로필 및 상담 일정 관리 카드 UI',
      ],
    },
    stacks: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'PostgreSQL', 'Auth0'],
    link: 'https://github.com/jayjunn',
    github: 'https://github.com/jayjunn',
  },
  {
    id: 2,
    name: 'Customer Feedback Platform',
    company: 'Toy Project',
    category: 'web',
    period: '2022',
    featured: false,
    img: 'https://res.cloudinary.com/dgmnoyv6u/image/upload/v1654311190/portfolio/feedback_jtx4kl.png',
    description: {
      en: 'An interactive review and rating web widget featuring customizable star ratings, sentiment analytics, and feedback sorting.',
      kr: '고객의 생생한 피드백을 수집하고 별점 및 평점을 분석하는 대화형 피드백 웹 플랫폼입니다.',
    },
    fullDescription: {
      en: 'Created an accessible, kinetic review widget with interactive rating animations, filtering by rating tiers, and smooth state updates.',
      kr: '인터랙티브 애니메이션과 실시간 별점 계산, 평점대별 필터링을 지원하는 반응형 피드백 시스템입니다.',
    },
    keyFeatures: {
      en: [
        'Micro-animated rating stars with keyboard accessibility',
        'Live filtering and sentiment score calculation',
        'Lightweight component architecture',
      ],
      kr: [
        '키보드 접근성을 갖춘 마이크로 인터랙션 별점 시스템',
        '실시간 필터링 및 평균 평점 계산 알고리즘',
        '경량화된 리액트 컴포넌트 아키텍처',
      ],
    },
    stacks: ['React', 'TypeScript', 'CSS Modules'],
    link: 'https://github.com/jayjunn/Customer-feedback',
    github: 'https://github.com/jayjunn/Customer-feedback',
  },
];

export const experienceData: ExperienceItem[] = [
  {
    id: 'ebay-japan',
    role: 'Software Engineer',
    company: 'eBay Japan',
    period: '2023 - Present',
    location: 'Tokyo, Japan',
    highlights: ['+20% Build Speed (Rspack)', 'HLS Video Ads', 'Onboarding UX'],
    description: {
      en: [
        'Implemented efficient HLS (HTTP Live Streaming) video ad integrations, ensuring smooth adaptive playback with zero lag or frame drop.',
        'Migrated front-end build pipelines from legacy Webpack to Rspack, achieving a 20% improvement in local build & CI speeds.',
        'Crafted a seamless user onboarding experience with intuitive UI flows and responsive design to boost sign-up conversion rate.',
        'Developed user profile configuration interfaces, enabling real-time instant updates and personalized settings.',
        'Maintained and optimized high-traffic components for qoo10.jp, emphasizing Core Web Vitals, cross-browser compatibility, and accessibility.',
      ],
      kr: [
        'HLS(HTTP Live Streaming) 기반 영상 스트리밍을 구현하여 웹페이지 내 비디오 광고를 버벅임 없이 원활하게 재생하도록 최적화했습니다.',
        'Webpack에서 Rust 기반 Rspack으로 빌드 시스템을 마이그레이션하여 빌드 속도를 약 20% 향상시키고 팀 생산성을 개선했습니다.',
        '직관적인 UI 흐름을 적용한 회원가입 및 온보딩 플로우를 설계하여 신규 사용자 유입과 전환율을 높였습니다.',
        '사용자 프로필 설정 변경 사항이 즉각 반영되는 인터페이스를 구축하여 사용자 편의성을 극대화했습니다.',
        'qoo10.jp의 대규모 트래픽 컴포넌트를 유지보수하며, 로딩 속도 향상, 크로스 브라우저 호환성 및 반응형 UX를 지속적으로 최적화했습니다.',
      ],
    },
    stacks: ['React', 'TypeScript', 'Next.js', 'Rspack', 'HLS.js', 'SCSS', 'Jotai'],
  },
  {
    id: 'blocko',
    role: 'Front-end Developer',
    company: 'Blocko',
    period: '2022 - 2023',
    location: 'Seoul, South Korea',
    highlights: ['Blockchain SaaS', 'Data Visualization', 'Agile 2-week Sprints'],
    description: {
      en: [
        'Developed highly engaging and responsive user interfaces using React and TypeScript for enterprise blockchain services (SilverMine, CCCV NFT).',
        'Implemented dynamic front-end data visualization dashboards for blockchain network metrics and transaction histories.',
        'Played an integral part in the design and architecture process, collaborating closely with backend engineers and product designers.',
        'Practiced Scrum and Agile methodologies, shipping reliable features in fast-paced 2-week sprint cycles.',
      ],
      kr: [
        'React 및 TypeScript를 사용하여 블록체인 SaaS 플랫폼(실버마인, CCCV NFT)의 참여도 높은 사용자 인터페이스를 개발했습니다.',
        '블록체인 네트워크 데이터와 트랜잭션 내역을 한눈에 파악할 수 있는 대화형 데이터 시각화 대시보드를 구축했습니다.',
        '기획 및 디자인 팀과 긴밀히 협력하여 컴포넌트 아키텍처와 프론트엔드 표준을 수립했습니다.',
        '2주 단위 애자일/스크럼 스프린트를 통해 지속적으로 기능을 배포하고 신속한 피드백 루프를 운영했습니다.',
      ],
    },
    stacks: ['React', 'TypeScript', 'TanStack Query', 'SCSS', 'Recharts', 'Web3.js'],
  },
  {
    id: 'glue',
    role: 'Front-end Developer',
    company: 'Glue',
    period: '2021 - 2022',
    location: 'Seoul, South Korea',
    highlights: ['Knowledge Marketplace', 'Auth0 Security', 'GraphQL APIs'],
    description: {
      en: [
        'Worked in an agile team of 5 developers using standard Git branching and code review workflows.',
        'Architected front-end user flows, state logic, and UI components from scratch for the knowledge marketplace.',
        'Collaborated with backend engineers on PostgreSQL database schemas, GraphQL queries, and API response structures.',
        'Integrated Auth0 authentication with secure session handling and role-based permissions.',
      ],
      kr: [
        '5인 규모의 개발팀에서 Git 워크플로우와 체계적인 코드 리뷰를 바탕으로 협업했습니다.',
        '마켓플레이스 서비스의 전반적인 사용자 플로우, 상태 로직 및 모듈형 UI 구조를 주도적으로 개발했습니다.',
        '백엔드 팀과 함께 PostgreSQL 데이터베이스 모델 및 GraphQL 쿼리/뮤테이션 인터페이스를 설계했습니다.',
        'Auth0를 도입하여 안전한 사용자 로그인 및 권한별 접근 제어 시스템을 구축했습니다.',
      ],
    },
    stacks: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'PostgreSQL', 'Auth0'],
  },
  {
    id: 'cos',
    role: 'Website Publisher & Digital Coordinator',
    company: 'COS (H&M Group)',
    period: '2019 - 2021',
    location: 'Seoul, South Korea',
    highlights: ['Global E-Commerce', 'A/B Testing', 'CMS Automation'],
    description: {
      en: [
        'Updated and maintained website content in line with commercial strategies using ES6+, HTML5, CSS3, and enterprise CMS.',
        'Launched and analyzed A/B tests to optimize UX/UI and checkout conversion for global markets.',
        'Built and dispatched interactive multilingual newsletters to international customer databases.',
        'Collaborated with international digital experience teams to ensure stability, brand alignment, and web accessibility.',
      ],
      kr: [
        '글로벌 상용 계획에 맞춰 ES6+, HTML5, CSS3 및 CMS를 활용해 공식 웹사이트 콘텐츠를 신속하고 정확하게 퍼블리싱했습니다.',
        '글로벌 시장의 구매 전환율과 UX 개선을 위해 다양한 A/B 테스트를 기획하고 실행 및 분석했습니다.',
        '전 세계 고객을 대상으로 하는 인터랙티브 뉴스레터를 제작 및 발송하여 마케팅 성과를 극대화했습니다.',
        '글로벌 디지털 익스피어리언스 팀과 협력하여 웹 접근성과 브랜드 아이덴티티를 완벽히 유지했습니다.',
      ],
    },
    stacks: ['JavaScript ES6+', 'HTML5', 'CSS3', 'CMS', 'Adobe Suite'],
  },
];

export const cvData = {
  en: {
    title: 'CURRICULUM VITAE',
    name: 'YOUNGGEUN JUN',
    role: 'Front-End / Creative Software Developer',
    email: 'jayjunn@outlook.com',
    location: 'Seoul, South Korea / Tokyo, Japan',
    github: 'https://github.com/jayjunn',
    linkedin: 'https://www.linkedin.com/in/younggeun',
    summary: `Senior front-end developer with 5+ years of experience delivering high-traffic web applications, interactive interfaces, and enterprise platforms. Proven track record in optimizing build speeds (+20%), implementing modern media streaming (HLS), and crafting responsive, accessible user experiences.`,
    education: [
      {
        institution: 'Korea National Open University',
        degree: 'Bachelor of Science in Computer Science',
        period: 'In Progress',
        location: 'Seoul, South Korea',
      },
    ],
    languages: [
      { language: 'Korean', proficiency: 'Native' },
      { language: 'English', proficiency: 'Professional Working Proficiency' },
      { language: 'Japanese', proficiency: 'Conversational / Business' },
    ],
  },
  kr: {
    title: '이력서 및 경력 요약서',
    name: '전영근',
    role: '프론트엔드 개발자 / 크리에이티브 엔지니어',
    email: 'jayjunn@outlook.com',
    location: '대한민국 서울 / 일본 도쿄',
    github: 'https://github.com/jayjunn',
    linkedin: 'https://www.linkedin.com/in/younggeun',
    summary: `5년 이상의 웹 프론트엔드 개발 경력을 가진 엔지니어로, 대규모 트래픽 환경의 서비스 개선, 고성능 인터랙티브 UI, 빌드 시스템 최적화(Rspack 마이그레이션 +20% 속도 향상), HLS 영상 스트리밍 구현 등 기술적 도전 과제를 성공적으로 해결해 왔습니다.`,
    education: [
      {
        institution: '한국방송통신대학교',
        degree: '컴퓨터과학과 학사',
        period: '재학 중',
        location: '대한민국 서울',
      },
    ],
    languages: [
      { language: '한국어', proficiency: '원어민' },
      { language: '영어', proficiency: '업무상 원활한 의사소통 가능' },
      { language: '일본어', proficiency: '일상 및 비즈니스 회화 가능' },
    ],
  },
};
