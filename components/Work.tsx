import React from "react";
import Image from "next/image";
import glue from "../public/image/glue.png";
import humble from "../public/image/humble_bank.png";
import styles from "../styles/Work.module.css";
import Link from "next/link";

const Work = () => {
  return (
    <main className={styles.projects}>
      <div className={styles.project__container}>
        <h1 className={styles.project__name}>HUMBLE BANK</h1>
        <div className={styles.project__img}>
          <Link href="https://github.com/jayjunn/humble-bank">
            <Image src={humble} alt="icon" layout="responsive" />
          </Link>
        </div>
        <div className={styles.project__details}>
          <p className={styles.project__des}>
            Humble Bank is an iOS app aimed at helping us track and categorize
            your transactions.
          </p>
          <p className={styles.project__p}>
            REACT NATIVE, EXPO, EXPRESS, MONGODB
          </p>
        </div>
      </div>
      <div className={styles.project__container}>
        <h1 className={styles.project__name}>GLUE</h1>
        <div className={styles.project__img}>
          <Link href="https://github.com/jayjunn/">
            <Image
              className={styles.img}
              src={glue}
              alt="icon"
              layout="responsive"
            />
          </Link>
        </div>
        <div className={styles.project__details}>
          <p className={styles.project__des}>
            An ongoing digital sketch series exploring generative art, WebGL and
            machine learning.
          </p>
          <p className={styles.project__p}>
            REACT, NEXT.JS, GRAPH QL, POSTGRES QL
          </p>
        </div>
      </div>
    </main>
  );
};

export default Work;
