import type { Metadata } from 'next';
import './styles/globals.css';
import { AuthProvider } from '../context/authContext';
import ReactQueryProvider from '../context/queryProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LanguageInitializer from '../components/common/LanguageInitializer';
import LanguageModal from '../components/common/LanguageModal';
import Chatbot from '../components/common/Chatbot';

export const metadata: Metadata = {
  title: {
    default: 'Younggeun Jun',
    template: 'Younggeun Jun | %s',
  },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="m-0 p-0">
        <main
          className="
            w-full
            max-w-[1400px]
            mx-auto
            min-h-screen
            flex
            flex-col
            bg-[#e7e2d0]
          "
        >
          <ReactQueryProvider>
            <AuthProvider>
              <LanguageInitializer />

              {/* Fixed Header */}
              <Header />

              {/* Header가 fixed라서 콘텐츠에 공간을 만들어줌 */}
              <div
                className="
                  flex-1
                  pt-[110px]
                  md:pt-[190px]
                "
              >
                {children}
              </div>

              <Footer />

              <LanguageModal />
            </AuthProvider>

            <Chatbot />
          </ReactQueryProvider>
        </main>
      </body>
    </html>
  );
}