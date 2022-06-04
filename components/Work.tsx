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
    <li className={styles.project__container}>
      <span className={styles.project__name}>{name}</span>
      <div className={styles.project__img}>
        <a href={link} target="_blank" rel="noreferrer">
          <Image src={img} alt="project image" width={1000} height={750} />
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
    </li>
  );
};

export default Work;
