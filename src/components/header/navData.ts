export interface NavItem {
  title: string;
  link: string;
  isExternal?: boolean;
}

export const NAV_LIST: NavItem[] = [
  {
    title: 'HOME',
    link: '/',
  },
  {
    title: 'WORKS',
    link: '/works',
  },
  {
    title: 'EXPERIENCE',
    link: '/experience',
  },
  {
    title: 'TECH BLOG',
    link: 'https://velog.io/@jayjunn/posts',
    isExternal: true,
  },
  {
    title: 'CV',
    link: '/cv',
  },
  {
    title: 'CONTACT',
    link: '/contact',
  },
];
