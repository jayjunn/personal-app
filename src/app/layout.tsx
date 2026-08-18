import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './styles/globals.css';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthInitializer from '../components/common/AuthInitializer';
import Chatbot from '../components/common/Chatbot';
import CommandPalette from '../components/common/CommandPalette';
import SpotlightCursor from '../components/common/SpotlightCursor';
import { COOKIE_NAME, LanguageType } from '@/constants/language';
import { THEME_COOKIE_NAME, ThemeType } from '@/constants/theme';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-mono',
  display: 'swap',
});

export const dynamic = 'force-dynamic';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://younggeun-jun.vercel.app'),
  title: {
    default: 'Younggeun Jun | Software Engineer',
    template: '%s | Younggeun Jun | Software Engineer',
  },
  description:
    'Younggeun Jun (전영근) - Software Engineer & Front-End Specialist crafting high-performance, accessible, and interactive digital web experiences.',
  keywords: [
    'Younggeun Jun',
    '전영근',
    'Software Engineer',
    'Front-End Developer',
    '소프트웨어 엔지니어',
    '프론트엔드 개발자',
    '웹 개발자',
    'React',
    'Next.js',
    'TypeScript',
    'Rspack',
    'Portfolio',
    '웹 포트폴리오',
    'eBay',
    'Blocko',
    'COS',
  ],
  authors: [{ name: 'Younggeun Jun', url: 'https://younggeun-jun.vercel.app' }],
  creator: 'Younggeun Jun',
  publisher: 'Younggeun Jun',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Younggeun Jun | Software Engineer',
    description:
      'Younggeun Jun (전영근) - Software Engineer & Front-End Specialist. Crafting high-performance interactive web experiences.',
    url: 'https://younggeun-jun.vercel.app',
    siteName: 'Younggeun Jun | Software Engineer',
    images: [
      {
        url: '/image/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Younggeun Jun | Software Engineer Portfolio',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get(COOKIE_NAME);
  const themeCookie = cookieStore.get(THEME_COOKIE_NAME);

  const initialLanguage: LanguageType =
    langCookie?.value === 'ENGLISH' || langCookie?.value === 'KOREAN'
      ? (langCookie.value as LanguageType)
      : 'KOREAN';

  const initialTheme: ThemeType =
    themeCookie?.value === 'dark' ? 'dark' : 'light';

  return (
    <html
      lang={initialLanguage === 'ENGLISH' ? 'en' : 'ko'}
      className={`${initialTheme === 'dark' ? 'dark' : ''} ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Younggeun Jun',
              alternateName: '전영근',
              jobTitle: 'Software Engineer',
              description:
                'Software Engineer & Front-End Specialist crafting high-performance, accessible, and interactive digital web experiences.',
              url: 'https://younggeun-jun.vercel.app',
              sameAs: [
                'https://github.com/jayjunn',
                'https://velog.io/@jayjunn/posts',
                'https://www.linkedin.com/in/younggeun',
              ],
            }),
          }}
        />
      </head>
      <body className="bg-[#e7e2d0] dark:bg-[#0d0e12] text-black dark:text-[#f3f4f6] font-sans transition-colors duration-200">
        <main className="w-full max-w-[1400px] mx-auto min-h-screen flex flex-col justify-between bg-[#e7e2d0] dark:bg-[#0d0e12] transition-colors duration-200">
          <ReactQueryProvider>
            <ThemeProvider initialTheme={initialTheme}>
              <LanguageProvider initialLanguage={initialLanguage}>
                <AuthInitializer />
                <SpotlightCursor />
                <CommandPalette />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <div className="flex-1 pt-[4.75rem] sm:pt-[5.25rem] md:pt-[9.75rem]">
                    {children}
                  </div>
                </div>
                <Footer />
                <Chatbot />
              </LanguageProvider>
            </ThemeProvider>
          </ReactQueryProvider>
        </main>
      </body>
    </html>
  );
}
