import type { Metadata } from 'next';
import './styles/globals.css';
import styles from './styles/app.module.css';
import { UserContextProvider } from '../context/userContext';
import { AuthContextProvider } from '../context/authContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Younggeun Jun | Creative Front-End Developer',
    template: '%s | Younggeun Jun',
  },
  description:
    'Creative Software Developer & Front-End Engineer specializing in React, Next.js, interactive UI/UX, and web performance optimization.',
  keywords: [
    'Younggeun Jun',
    'Frontend Developer',
    'Creative Developer',
    'React',
    'Next.js',
    'TypeScript',
    'eBay Japan',
    'Portfolio',
  ],
  authors: [{ name: 'Younggeun Jun', url: 'https://github.com/jayjunn' }],
  creator: 'Younggeun Jun',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          <UserContextProvider>
            <div className={styles.contents}>
              <Header />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
            </div>
          </UserContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
