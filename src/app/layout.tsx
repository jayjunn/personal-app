import type { Metadata } from 'next';
import './styles/globals.css';
import styles from './styles/app.module.css';
import { UserContextProvider } from '../context/userContext';
import { AuthContextProvider } from '../context/authContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: { default: 'Younggeun Jun', template: 'Younggeun Jun | %s' },
  description: 'Software Engineer Younggeun Jun',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className={`${styles.contents} min-h-screen flex flex-col justify-between`}>
          <UserContextProvider>
            <AuthContextProvider>
              <div className="flex-1 flex flex-col">
                <Header />
                <div className="flex-1">{children}</div>
              </div>
              <Footer />
            </AuthContextProvider>
          </UserContextProvider>
        </main>
      </body>
    </html>
  );
}
