import React from "react";
import Image from "next/image";
import styles from "../styles/WorkList.module.css";
import anglesRight from "../public/image/anglesRight.svg";
import Work from "./Work";
import data from "../data.js";

const WorkList = () => (
  <section className={styles.container}>
    <div className={styles.header}>
      <Image
        className={styles.arrow}
        src={anglesRight}
        alt="icon"
        width="40px"
        height="40px"
      />
      <span className={styles.title}>WORKS</span>
    </div>
    <div className={styles.wrapper}>
      <section className={styles.list__container}>
        <ul className={styles.list}>
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
        </ul>
      </section>
    </div>
  </section>
);

export default WorkList;
