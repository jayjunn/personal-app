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
    role: 'FRONT-END DEVELOPER',
    location: 'Seoul',
    availability: 'Open to exciting opportunities & collaborations',
    headLine: 'I make digital screens do cool stuff.',
    taglines: [
      'Creative Software Developer',
      'Interactive UI/UX Craftsman',
      'Web Performance & Modern Architecture',
      'React & Next.js Specialist',
    ],
    about: `I'm a Creative Software Developer who enjoys interactive design, creative coding and full-stack web development. Experienced in building responsive, high-performance web applications across enterprise e-commerce (eBay, COS) and blockchain SaaS (Blocko).`,
    secondaryAbout: `I obsess over fluid micro-interactions, clean architectural patterns, lightning-fast build pipelines, and accessibility.`,
    stats: [
      { value: '5+', label: 'Years Experience', sub: 'Front-End & Creative Dev' },
      { value: '20%', label: 'Build Speed Gain', sub: 'Rspack Migration @ eBay' },
      { value: '10+', label: 'Shipped Projects', sub: 'Enterprise & Consumer' },
      { value: '100%', label: 'Responsive UX', sub: 'Pixel-perfect Design' },
    ],
  },
  kr: {
    name: '전영근',
    role: 'FRONT-END DEVELOPER',
    location: '서울',
    availability: '새로운 기회와 혁신적인 프로젝트에 열려있습니다',
    headLine: '디지털 기기 화면에 표시되는 무언가를 만드는걸 좋아하는 프론트엔드 개발자 입니다.',
    taglines: [
      '크리에이티브 프론트엔드 개발자',
      '인터랙티브 UI/UX 엔지니어',
      '웹 성능 최적화 & 모던 웹 아키텍처',
      'React & Next.js 전문가',
    ],
    about: `성장에서 즐거움을 찾고 뛰어난 사용자 경험을 제공하는 혁신적이고 신뢰할 수 있는 서비스를 만드는 데 열정을 쏟고 있는 개발자 전영근입니다. 글로벌 이커머스(eBay, COS)와 블록체인 SaaS(Blocko) 등 다양한 도메인에서 대규모 서비스 개선 및 고성능 프론트엔드를 구축해 왔습니다.`,
    secondaryAbout: `매끄러운 마이크로 인터랙션, 클린 아키텍처, 빠른 빌드 파이프라인, 그리고 크로스 브라우징 및 반응형 UX 완성도에 깊은 열정을 가지고 있습니다.`,
    stats: [
      { value: '5년+', label: '실무 경력', sub: '프론트엔드 & 풀스택 개발' },
      { value: '20%', label: '빌드 속도 개선', sub: 'eBay Rspack 도입' },
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
      { name: 'Firebase / Firestore', badge: 'Cloud DB' },
      { name: 'Jotai', badge: 'Atomic' },
      { name: 'GraphQL / Apollo', badge: 'API' },
      { name: 'RESTful APIs', badge: 'Integration' },
      { name: 'Node.js / Express', badge: 'Backend' },
    ],
  },
  {
    title: { en: 'Styling & Motion', kr: '스타일링 & 모션' },
    skills: [
      { name: 'Tailwind CSS', badge: 'Utility-First' },
      { name: 'Framer Motion', badge: 'Kinetic' },
      { name: 'CSS3 / PostCSS', badge: 'Responsive' },
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
];

export const workData: Project[] = [
  {
    id: 7,
    name: 'eBay',
    company: 'Company',
    category: 'enterprise',
    period: '2023 - Present',
    featured: true,
    img: '/logos/ebay.svg',
    description: {
      en: 'High-traffic e-commerce engineering at eBay, driving video ad streaming, build system migration to Rspack, and user onboarding UX.',
      kr: 'eBay의 대규모 이커머스 플랫폼(Qoo10)에서 HLS 비디오 광고 스트리밍, Rspack 빌드 시스템 마이그레이션, 회원 온보딩 UX 개선을 주도했습니다.',
    },
    stacks: ['React', 'TypeScript', 'Rspack', 'HLS.js', 'Next.js', 'Tailwind CSS'],
    link: 'https://www.qoo10.jp',
    github: 'https://github.com/jayjunn',
  },
  {
    id: 4,
    name: 'COS',
    company: 'Company',
    category: 'enterprise',
    period: '2019 - 2021',
    featured: true,
    img: '/logos/cos.png',
    description: {
      en: 'A global fashion ecommerce project. Global luxury fashion e-commerce content deployment, A/B conversion testing, and international localized digital campaigns.',
      kr: '글로벌 패션 브랜드 COS(H&M 그룹)의 글로벌 이커머스 프로젝트. 웹사이트 콘텐츠 운영, CMS 최적화, A/B 테스트 및 데이터 기반 디지털 캠페인 개발.',
    },
    stacks: ['JavaScript', 'HTML5', 'CSS3', 'CMS', 'Adobe'],
    link: 'https://www.cos.com/',
    github: 'https://github.com/jayjunn',
  },
  {
    id: 5,
    name: 'Blocko',
    company: 'Company',
    category: 'web3',
    period: '2022 - 2023',
    featured: true,
    img: '/logos/blocko.svg',
    description: {
      en: 'Blockchain platforms and services that help to utilize blockchain in a variety of ways, from the enterprise to the general public.',
      kr: '엔터프라이즈부터 일반인까지 블록체인을 다양하게 활용할 수 있도록 돕는 블록체인 플랫폼 및 서비스를 전달합니다.',
    },
    stacks: ['React', 'TypeScript', 'TanStack Query', 'Tailwind CSS'],
    link: 'https://beta.silvermine.me/',
    github: 'https://github.com/jayjunn',
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
      en: 'This is a project for a Full Stack Airbnb Clone with Next.js 13 App Router: React, Tailwind, Prisma, MongoDB, NextAuth.',
      kr: '이 프로젝트는 Next.js 13를 사용한 Full Stack Airbnb 클론 프로젝트입니다.',
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
      en: 'Humble Bank is an iOS app aimed at helping us track and categorize your transactions.',
      kr: 'Humble Bank는 사용자의 거래를 기록하고 분류하는 것을 도와주는 리액트 네이티브와 Node.js로 만들어진 앱입니다.',
    },
    stacks: ['React Native', 'Expo', 'Express', 'MongoDB'],
    link: 'https://github.com/jayjunn/humble-bank',
    github: 'https://github.com/jayjunn/humble-bank',
  },
  {
    id: 1,
    name: 'Glue',
    company: 'Company',
    category: 'web',
    period: '2021 - 2022',
    featured: false,
    img: '/logos/glue.svg',
    description: {
      en: 'Glue is a knowledge marketplace where you can find interesting and smart people with a skill to offer.',
      kr: 'Glue는 사용자들이 때때로 필요로한 숙련된 기술을 가진 사람들이 제공할 수 있는 서비스를 찾을 수 있는 마켓플레이스입니다.',
    },
    stacks: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'PostgreSQL'],
    link: 'https://github.com/jayjunn',
    github: 'https://github.com/jayjunn',
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
      en: 'A web platform where customers can leave reviews with star rating system.',
      kr: '고객이 별점 시스템으로 리뷰를 남길 수 있는 웹 플랫폼.',
    },
    stacks: ['React', 'TypeScript'],
    link: 'https://github.com/jayjunn/Customer-feedback',
    github: 'https://github.com/jayjunn/Customer-feedback',
  },
];

export const experienceData: ExperienceItem[] = [
  {
    id: 'ebay',
    role: 'Software Engineer',
    company: 'eBay',
    period: '2023 - Present',
    location: 'Seoul / Tokyo',
    highlights: ['+20% Build Speed (Rspack)', 'HLS Video Ads', 'Onboarding UX'],
    description: {
      en: [
        'Implemented efficient HLS video ad integrations, ensuring smooth playback and minimal performance impact.',
        'Migrated the build system from Webpack to Rspack, resulting in a 20% improvement in build speed, leading to faster development cycles and increased team productivity.',
        'Crafted a seamless user onboarding experience with intuitive UI flows and responsive design to boost engagement and retention.',
        'Developed user profile configuration interfaces, enabling real-time updates and a personalized user experience.',
        'Maintained and enhanced front-end components of the website, focusing on performance, cross-browser compatibility, and responsive design.',
      ],
      kr: [
        'HLS 기반 영상 스트리밍을 구현하여 웹페이지 내 비디오 광고의 원활한 재생과 성능 저하 없는 사용자 경험을 제공했습니다.',
        'Webpack에서 Rspack으로 빌드 시스템을 마이그레이션하여 빌드 속도를 약 20% 향상시켜 개발 주기 단축 및 팀 생산성 향상에 기여했습니다.',
        '직관적인 UI 흐름을 적용한 회원가입 페이지를 설계하여 신규 사용자 유입과 전환율을 향상시켰습니다.',
        '프로필 설정 변경 사항이 즉시 반영되는 인터페이스를 구현해 사용자 편의성과 맞춤형 경험을 향상시켰습니다.',
        'qoo10.jp의 유지보수 및 개선을 담당하며, 로딩 속도 향상, 크로스 브라우저 호환성 확보, 반응형 UI 구현을 통해 사용자 경험을 최적화했습니다.',
      ],
    },
    stacks: ['React', 'TypeScript', 'Next.js', 'Rspack', 'HLS.js', 'Tailwind CSS', 'Jotai'],
  },
  {
    id: 'cos',
    role: 'Website Publisher & Digital Coordinator',
    company: 'COS',
    period: '2019 - 2021',
    location: 'Seoul, South Korea',
    highlights: ['Global E-Commerce', 'A/B Testing', 'CMS Automation'],
    description: {
      en: [
        'Working closely with product designers to update website content in line with commercial plan using ES6+, HTML5+, CSS3+ and CMS.',
        'Launched and Contributed A/B test to improve UX/UI Web maintenance to ensure stability and accessibility on a global scale.',
        'Error tracking in Content Management System, identifying any issues.',
        'Build and execution of newsletter using CMS and Javascript sending out to communication send-outs to COS worldwide database.',
        'Planned paid social, digital display advertising in line with commercial plan working with external agencies such as Google, Meta, Kakao and Naver.',
      ],
      kr: [
        '제품 디자이너와 긴밀히 협력하여 ES6+, HTML5+, CSS3+, CMS를 사용한 상용 계획에 따라 웹 사이트 콘텐츠를 업데이트했습니다.',
        '글로벌 규모의 안정성과 접근성 확보를 위한 UX/UI 웹 유지관리 개선을 위한 A/B 테스트 착수 및 기여했습니다.',
        '콘텐츠 관리 및 웹사이트 오류 추적, 문제 식별 및 해결을 수행했습니다.',
        'CMS 및 Javascript를 사용하여 COS 전 세계 데이터베이스로 통신 송출을 위한 뉴스레터 구축 및 실행했습니다.',
        '구글, 메타, 카카오, 네이버 등 외부 에이전시와 협업하여 유료 소셜 및 디지털 디스플레이 광고를 기획하고 성과를 분석했습니다.',
      ],
    },
    stacks: ['JavaScript', 'HTML5', 'CSS3', 'CMS', 'Adobe'],
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
        'Developed highly engaging user interfaces using React and TypeScript, resulting in a seamless UX.',
        'Implemented blockchain SaaS such as SilverMine and CCCV NFT.',
        'Implemented and delivered front-end data visualization.',
        'Played an integral part in the design and architecture process, collaborating closely with stakeholders.',
        'Based on the scrum methodology, experienced the Agile development process by developing the product in a 2-week sprint.',
      ],
      kr: [
        'React 및 TypeScript를 사용하여 참여도가 높은 사용자 인터페이스를 개발하여 원활한 UX를 제공했습니다.',
        '실버마인, CCCV NFT 등 블록체인 SaaS 구현.',
        '프런트 엔드 데이터 시각화 구현 및 제공.',
        '설계 및 아키텍처 프로세스에서 중요한 역할을 수행하여 이해 관계자와 긴밀하게 협력했습니다.',
        '스크럼 방법론을 기반으로 2주간의 스프린트로 제품을 개발하여 Agile 개발 프로세스를 경험했습니다.',
      ],
    },
    stacks: ['React', 'TypeScript', 'TanStack Query', 'Tailwind CSS', 'Recharts', 'Web3.js'],
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
        'Worked in an agile team of 5 developers using Git workflow.',
        'Developed the front-end structure including app flow, logic and UX/UI Collaborated with back-end team on database structure and API design.',
        'Implemented user authentication Auth0.',
      ],
      kr: [
        'Git Workflow를 사용하여 5명의 개발자로 구성된 Agile 팀에서 근무했습니다.',
        '사용자 플로우, 로직, UX/UI를 포함한 프런트 엔드 구조 개발 및 백엔드 팀과 데이터베이스 구조 및 API 설계를 협업했습니다.',
        'Auth0를 이용한 사용자 로그인과 사용자 인증을 구현했습니다.',
      ],
    },
    stacks: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'PostgreSQL', 'Auth0'],
  },
];

export const cvData = {
  en: {
    title: 'CURRICULUM VITAE',
    name: 'YOUNGGEUN JUN',
    role: 'FRONT-END DEVELOPER',
    email: 'jayjunn@outlook.com',
    location: 'Seoul, South Korea',
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
    role: 'FRONT-END DEVELOPER',
    email: 'jayjunn@outlook.com',
    location: '대한민국 서울',
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
