import type { Metadata } from 'next';
import './styles/globals.css';
import { AuthProvider } from '../context/authContext';
import ReactQueryProvider from '../context/queryProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LanguageInitializer from '../components/common/LanguageInitializer';
import LanguageModal from '../components/common/LanguageModal';

export const metadata: Metadata = {
  title: { default: 'Younggeun Jun', template: 'Younggeun Jun | %s' },
  description: 'Software Engineer Younggeun Jun',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="w-full max-w-[1400px] mx-auto min-h-screen flex flex-col justify-between bg-[#e7e2d0]">
          <ReactQueryProvider>
            <AuthProvider>
              <LanguageInitializer />
              <div className="flex-1 flex flex-col">
                <Header />
                <div className="flex-1">{children}</div>
              </div>
              <Footer />
              <LanguageModal />
            </AuthProvider>
          </ReactQueryProvider>
        </main>
      </body>
    </html>
  );
}
