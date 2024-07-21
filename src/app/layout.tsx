import type { Metadata } from 'next';
import './styles/globals.css';
import styles from './styles/app.module.css';
import { UserContextProvider } from '../context/userContext';
import Header from '../components/Header';
import { SWRConfig } from 'swr';

export const metadata: Metadata = {
  title: { default: `Younggeun Jun`, template: `Younggeun Jun | %s` },
  description: 'Software Engineer Younggeun Jun',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className={styles.contents}>
          <Header />
          <UserContextProvider>
         
              {children}
          </UserContextProvider>
        </main>
      </body>
    </html>
  );
}
