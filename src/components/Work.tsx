import React from 'react';
import Image from 'next/image';
import styles from '../app/styles/Work.module.css';

type WorkProps = {
  name: string;
  img: string;
  description: string;
  stacks: string[];
  link: string;
  company?: string;
};

const Work = (props: WorkProps) => {
  const { name, img, description, stacks, link, company } = props;

  return (
    <div className={styles.project__container} id={company ? company.toLowerCase().replace(/\s+/g, '-') : name.toLowerCase().replace(/\s+/g, '-')}>
      <div className={styles.project__name}>
        <span>{name}</span>
        {company && <span className={styles.project__company}>{company}</span>}
      </div>
      <a href={link} target="_blank" rel="noreferrer" className={styles.image__link}>
        <div className={styles.project__img__container}>
          <Image src={img} alt={name} fill className={styles.project__image} sizes="500px" />
        </div>
      </a>
      <div className={styles.project__details}>
        <p className={styles.project__des}>{description}</p>
        <p className={styles.project__stacks}>
          {stacks.map((i, index) => (
            <span key={index}>
              {i} {index === stacks.length - 1 ? '' : '/ '}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};

export default Work;
