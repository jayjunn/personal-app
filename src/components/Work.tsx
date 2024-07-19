import React from 'react';
import Image from 'next/image';
import styles from '../app/styles/Work.module.css';

type Work = {
  name: string;
  img: string;
  description: string;
  stacks: string[];
  link: string;
  company?: string;
};

const Work = (props: Work) => {
  const { name, img, description, stacks, link, company } = props;

  return (
    <li className={styles.project__container} id={company ? company.toLocaleLowerCase() : name}>
      <div className={styles.project__name}>
        <p>{name}</p>
        <p className={styles.project__company}>{company}</p>
      </div>
      <a href={link} target="_blank" rel="noreferrer" className={styles.image__link}>
        <button className={styles.project__img__container}>
          <Image src={img} alt="project__image" className={styles.project__image} layout="fill" />
        </button>
      </a>
      <div className={styles.project__details}>
        <p className={styles.project__des}>{description}</p>
        <p className={styles.project__stacks}>
          {stacks.map((i, index) => {
            return (
              <span key={index}>
                {i} {index === stacks.length - 1 ? '' : '/ '}
              </span>
            );
          })}
        </p>
      </div>
    </li>
  );
};

export default Work;
