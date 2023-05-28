import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import Profile from '../components/Profile';
import styles from '../styles/app.module.css';
import WorkList from '../components/WorkList';
import Experience from '../components/Experience';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Younggeun Jun</title>
        <meta name="description" content="Younggeun Jun" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.contents}>
        <Header />
        <Profile />
        <Experience />
        <WorkList />
      </main>
    </>
  );
};

export default Home;
