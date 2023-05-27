import React from 'react';
import Image from 'next/image';
import styles from '../styles/Work.module.css';

type Work = {
  name: string;
  img: string;
  description: string;
  stacks: string[];
  link: string;
};

const Work = (props: Work) => {
  const { name, img, description, stacks, link } = props;
  const imageStyle = {
    borderRadius: '10px',
  };
  return (
    <li className={styles.project__container}>
      <span className={styles.project__name}>{name}</span>
      {link ? (
        <a href={link} target="_blank" rel="noreferrer">
          <button className={styles.project__img__container}>
            <Image src={img} alt="project__image" className="project__image" width={'1000'} height={750} loading="lazy" />
          </button>
        </a>
      ) : (
        <div className={styles.project__img__container}>
          <Image src={img} alt="project__image" className="project__image" width={'1000'} height={750} style={imageStyle} />
        </div>
      )}
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
