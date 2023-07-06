const profileData = {
  en: {
    headLine: 'I BUILD SOMETHING THAT DISPLAYS ON DIGITAL SCREENS.',
    about: `I'm a Creative Software Developer who enjoys interactive design, creative coding and full-stack web development.`,
    skills:
      ' REACT, TYPESCRIPT, JAVASCRIPT, NEXT.JS, REACT QUERY, SCSS, NODE.JS, VUE.JS, GIT, GRAPH QL, REACT NATIVE, MONGO DB, A/B TEST, FIGAMA, HTML, CSS',
    name: 'YOUNGGEUN JUN',
  },
  kr: {
    headLine: '디지털 기기 화면에 표시되는 무언가를 만드는걸 좋아하는 개발자입니다.',
    about: `성장에서 즐거움을 찾고 뛰어난 사용자 경험을 제공하는 혁신적이고 신뢰할 수 있는 서비스를 만드는 데 열정을 쏟고 있는 개발자 전영근입니다.
    `,
    skills:
      'REACT, TYPESCRIPT, JAVASCRIPT, NEXT.JS, REACT QUERY, SCSS, NODE.JS, VUE.JS, GIT, GRAPH QL, REACT NATIVE, MONGO DB, A/B TEST, FIGAMA, HTML, CSS',
    name: '전영근',
  },
};

const workData = [
  {
    id: 7,
    name: `Airbnb Clone`,
    company: 'Toy Project',
    img: `https://res.cloudinary.com/dgmnoyv6u/image/upload/v1688622910/Screenshot_2023-07-06_at_2.54.03_PM_a8dssi.png`,
    description: {
      en: `This is a project for a Full Stack Airbnb Clone with Next.js 13 App Router: React, Tailwind, Prisma, MongoDB, NextAuth.`,
      kr: `이 프로젝트는 Next.js 13를 사용한 Full Stack Airbnb 클론 프로젝트입니다.`,
    },
    stacks: ['Next.js', 'React', 'Tailwind', 'Prisma', 'MongoDB', 'NextAuth'],
    link: `https://full-stack-arirbnb-jd65ilvto-jayjunn.vercel.app/`,
  },
  {
    id: 6,
    name: `SILVER MINE`,
    company: 'Blocko',
    img: `https://res.cloudinary.com/dgmnoyv6u/image/upload/v1685156087/Screenshot_2023-05-27_at_11.54.27_AM_qviyp4.png`,
    description: {
      en: `Token-issuing SaaS for a wide range of companies preparing for an open securities token (STO) market`,
      kr: `공개 증권 토큰(STO) 시장을 준비하는 다양한 기업을 위한 토큰 발행 SaaS 형태의 서비스`,
    },
    stacks: [`REACT`, `TYPESCRIPT`, `REACT QUERY`, `SCSS`],
    link: `https://beta.silvermine.me/`,
  },
  {
    id: 5,
    name: `CCCV NFT`,
    company: 'Blocko',
    img: `https://res.cloudinary.com/dgmnoyv6u/image/upload/v1685157442/Screenshot_2023-05-27_at_12.16.55_PM-removebg-preview_zygl4p.png`,
    description: {
      en: `A platform that allows you to conveniently issue NFTs without installing a separate wallet.`,
      kr: `별도의 개인 지갑 설치 없이 편리하게 NFT 발급이 가능한 플랫폼입니다.`,
    },
    stacks: [`VUE.JS`, `VUEX`, `SCSS`],
    link: `https://cccv.to/nft`,
  },
  {
    id: 4,
    name: `COS`,
    img: `https://res.cloudinary.com/dgmnoyv6u/image/upload/v1685155499/Screenshot_2023-05-27_at_11.44.37_AM_u8no2c.png`,
    description: {
      en: `A global fashion ecommerce project.`,
      kr: `글로벌 패션 브랜드 이커머스 프로젝트.      `,
    },
    stacks: [`JAVASCRIPT`, `CSS`, 'HTML', 'ADOBE'],
    link: `https://www.cos.com/`,
  },

  {
    id: 0,
    name: `humble bank`,
    company: 'Toy Project',
    img: `https://res.cloudinary.com/dgmnoyv6u/image/upload/v1654311191/portfolio/humble_bank_ekxbro.png`,
    description: {
      en: `Humble Bank is an iOS app aimed at helping us track and categorize your transactions.`,
      kr: `Humble Bank는 사용자의 거래를 기록하고 분류하는 것을 도와주는 리액트 네이티브와 NODE.JS로 만들어진 앱입니다.
      `,
    },
    stacks: [`REACT NATIVE`, `EXPO`, `EXPRESS`, `MONGODB`],
    link: `https://github.com/jayjunn/humble-bank`,
  },

  {
    id: 1,
    name: `glue`,
    img: `https://res.cloudinary.com/dgmnoyv6u/image/upload/v1654311191/portfolio/glue_zdfvfz.png`,
    description: {
      en: `Glue is a knowledge marketplace where you can find interesting and smart people with a skill to offer.`,
      kr: `Glue는 사용자들이 때때로 필요로한 숙련된 기술을 가진 사람들이 제공할 수 있는 서비스를 찾을수있는 마켓플레이스 입니다
      `,
    },
    stacks: [`REACT`, `TYPESCRIPT`, `NEXT.JS`, `GRAPH QL`, `POSTGRES QL`],
    link: ``,
  },
  {
    id: 2,
    name: `FeedBack`,
    company: 'Toy Project',
    img: `https://res.cloudinary.com/dgmnoyv6u/image/upload/v1654311190/portfolio/feedback_jtx4kl.png`,
    description: {
      en: `A web platform where customers can leave reviews with star rating system.`,
      kr: `고객이 별점 시스템으로 리뷰를 남길 수 있는 웹 플랫폼.
      `,
    },
    stacks: [`REACT`, `TYPESCRIPT`],
    link: `https://github.com/jayjunn/Customer-feedback`,
  },
];

const experienceData = [
  {
    role: 'Font-end Developer',
    company: 'Blocko',
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
  },
  {
    role: 'Font-end Developer',
    company: 'Glue',
    description: {
      en: [
        'Worked in an agile team of 5 developers using Git workflow',
        'Developed the front-end structure including app flow, logic and UX/UI Collaborated with back-end team on database structure and API design',
        'Implemented user authentication Auth0',
      ],
      kr: [
        `Git Workflow를 사용하여 5명의 개발자로 구성된 Agile 팀에서 근무`,
        'Implemented blockchain SaaS such as SilverMine and CCCV NFT.',
        '사용자 플로우, 로직, UX/UI를 포함한 프런트 엔드 구조 개발 백엔드 팀과 데이터베이스 구조 및 API 설계 협업',
        'Auth0를 이용한 사용자 로그인과 사용자 인증 구현',
      ],
    },
  },
  {
    role: 'Digital Marketing Coordinator',
    company: 'COS',
    description: {
      en: [
        'Optimize localization of social media activities in local markets',
        'Planned paid social, digital display advertising in line with commercial plan working with external agencies such as Google, Meta, Kakao and Naver.',
        'Analyze social content including click through, conversion, traffic and report back results',
        'Working closely with the digital experience team and launching the a/b test as a main key member of the project',
      ],
      kr: [
        '지역 시장에서 소셜 미디어 활동의 현지화 최적화',
        '구글, 메타, 카카오, 네이버 등 외부 에이전시와 협업한 상용화 계획에 따른 유료 소셜, 디지털 디스플레이 광고 기획',
        '클릭 스루, 변환, 트래픽 및 결과 보고를 포함한 소셜 콘텐츠 분석',
        'digital experience팀과 긴밀히 협력하여 프로젝트의 주요 핵심 멤버로서 웹사이트 A/B 테스트를 런칭 및 진행.',
      ],
    },
  },
  {
    role: 'Website Publisher',
    company: 'COS',
    description: {
      en: [
        'Working closely with product designers to update website content in line with commercial plan using ES6+, HTML5+, CSS3+ and CMS',
        ' Launched and Contributed A/B test to improve UX/UI Web maintenance to ensure stability and accessibility on a global scale',
        'Error tracking in Content Management System, identifying any issues',
        'Build and execution of newsletter using CMS and Javascript sending out to communication send-outs to COS worldwide database',
      ],
      kr: [
        '제품 디자이너와 긴밀히 협력하여 ES6+, HTML5+, CSS3+, CMS를 사용한 상용 계획에 따라 웹 사이트 콘텐츠를 업데이트.',
        `글로벌 규모의 안정성과 접근성 확보를 위한 UX/UI 웹 유지관리 개선을 위한 A/B 테스트 착수 및 기여`,
        '콘텐츠 관리 및 웹사이트 오류 추적, 문제 식별',
        'CMS 및 Javascript를 사용하여 COS 전 세계 데이터베이스로 통신 송출을 위한 뉴스레터 구축 및 실행',
      ],
    },
  },
];

export { workData, experienceData, profileData };
