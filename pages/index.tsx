import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import Profile from "../components/Profile";
import Works from "../components/Works";
import Work from "../components/Work";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Younggeun Jun</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Profile />
      <Works />
      <Work />
    </div>
  );
};

export default Home;
