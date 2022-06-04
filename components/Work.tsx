import React from "react";
import Image from "next/image";
import styles from "../styles/Work.module.css";

type Work = {
  name: string;
  img: string;
  description: string;
  stacks: string[];
  link: string;
};

const Work = (props: Work) => {
  const { name, img, description, stacks, link } = props;
  return (
    <section className={styles.projects}>
      <div className={styles.project__container}>
        <h5 className={styles.project__name}>{name}</h5>
        <div className={styles.project__img}>
          <a href={link} target="_blank">
            <Image src={img} width={1000} height={750} />
          </a>
        </div>
        <div className={styles.project__details}>
          <p className={styles.project__des}>{description}</p>
          <p className={styles.project__stacks}>
            {stacks.map((i, index) => {
              return (
                <span key={index}>
                  {i} {index === stacks.length - 1 ? "" : "/ "}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Work;
