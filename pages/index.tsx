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
        <meta
          name="description"
          content="Younggeun Jun is a front-end developer who builds accessible, inclusive products and digital experiences for the web."
        />
        <meta property="og:title" content="Younggeun Jun" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://younggeun-jun.netlify.app" />
        <meta property="og:image" content="https://res.cloudinary.com/dgmnoyv6u/image/upload/c_thumb,w_200,g_face/v1699409874/og_ugafxm.jpg"></meta>
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
