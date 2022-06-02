import React from "react";
import Image from "next/image";
import styles from "../styles/Works.module.css";
import anglesRight from "../public/image/anglesRight.svg";

const Works = () => (
  <main className={styles.container}>
    <div className={styles.work__box}>
      <Image
        className={styles.arrow}
        src={anglesRight}
        alt="icon"
        width="40px"
        height="40px"
      />
      <div className={styles.title}>WORKS</div>
    </div>
  </main>
);

export default Works;
