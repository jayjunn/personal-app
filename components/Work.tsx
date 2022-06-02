import React from "react";
import Image from "next/image";
import glue from "../public/image/glue.png";
import styles from "../styles/Work.module.css";
const Work = () => {
  return (
    <main className={styles.projects}>
      <div className={styles.project__container}>
        <h1 className={styles.project__name}>GLUE</h1>
        <div className={styles.project__img}>
          <Image src={glue} alt="icon" layout="responsive" />
        </div>
        <div className={styles.project__details}>
          <p className={styles.project__des}>
            An ongoing digital sketch series exploring generative art, WebGL and
            machine learning
          </p>
          <p className={styles.project__p}>
            REACT REACT HOOK COMMERCE.JS, STRIPE.JS MTERIAL-UI,
            STYLED-COMPONENTS.JS
          </p>
        </div>
      </div>
      <div className={styles.project__container}>
        <h1 className={styles.project__name}>GLUE</h1>
        <div className={styles.project__img}>
          <Image src={glue} alt="icon" layout="responsive" />
        </div>
        <div className={styles.project__details}>
          <p className={styles.project__des}>
            An ongoing digital sketch series exploring generative art, WebGL and
            machine learning
          </p>
          <p className={styles.project__p}>
            REACT REACT HOOK COMMERCE.JS, STRIPE.JS MTERIAL-UI,
            STYLED-COMPONENTS.JS
          </p>
        </div>
      </div>
    </main>
  );
};

export default Work;
