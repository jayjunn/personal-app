import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './styles/globals.css';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthInitializer from '../components/common/AuthInitializer';
import Chatbot from '../components/common/Chatbot';
import { COOKIE_NAME, LanguageType } from '@/constants/language';

export const dynamic = 'force-dynamic';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: { default: 'Younggeun Jun', template: 'Younggeun Jun | %s' },
  description: 'Software Engineer Younggeun Jun',
  openGraph: {
    title: 'Younggeun Jun | Software Engineer',
    description: 'Software Engineer Younggeun Jun',
    url: 'https://younggeun-jun.vercel.app',
    siteName: 'Younggeun Jun',
    images: [
      {
        url: 'https://younggeun-jun.vercel.app/image/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  const initialLanguage: LanguageType =
    cookie?.value === 'ENGLISH' || cookie?.value === 'KOREAN'
      ? (cookie.value as LanguageType)
      : 'KOREAN';

  return (
    <html lang={initialLanguage === 'ENGLISH' ? 'en' : 'ko'}>
      <body>
        <main className="w-full max-w-[1400px] mx-auto min-h-screen flex flex-col justify-between bg-[#e7e2d0]">
          <ReactQueryProvider>
            <LanguageProvider initialLanguage={initialLanguage}>
              <AuthInitializer />
              <div className="flex-1 flex flex-col">
                <Header />
                <div className="flex-1 pt-24 sm:pt-28 md:pt-[11.5rem]">
                  {children}
                </div>
              </div>
              <Footer />
              <Chatbot />
            </LanguageProvider>
          </ReactQueryProvider>
        </main>
      </body>
    </html>
  );
}
