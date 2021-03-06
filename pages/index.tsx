import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import Profile from "../components/Profile";
import WorkList from "../components/WorkList";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Younggeun Jun</title>
        <meta name="description" content="Younggeun Jun" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Profile />
      <WorkList />
    </div>
  );
};

export default Home;
