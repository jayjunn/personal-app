import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './styles/globals.css';
import styles from './styles/app.module.css';
import { UserContextProvider } from '../context/userContext';
import Header from '../components/Header';

const sans = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: `Younggeun Jun`, template: `Jay's Blog | %s` },
  description: 'Software Engineer Younggeun Jun',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className={styles.contents}>
          <Header />
          <UserContextProvider> {children} </UserContextProvider>
        </main>
      </body>
    </html>
  );
}
