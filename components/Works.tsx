import React from "react";
import Image from "next/image";
import styles from "../styles/Works.module.css";
import anglesRight from "../public/image/anglesRight.svg";
import Work from "../components/Work";
import data from "../data.js";

const Works = () => (
  <div className={styles.container}>
    <div>
      <Image
        className={styles.arrow}
        src={anglesRight}
        alt="icon"
        width="40px"
        height="40px"
      />
      <span className={styles.title}>WORKS</span>
    </div>
    <div className={styles.list}>
      {data.map((item) => {
        return (
          <Work
            key={item.id}
            name={item.name}
            img={item.img}
            description={item.description}
            stacks={item.stacks}
            link={item.link}
          />
        );
      })}
    </div>
  </div>
);

export default Works;
