import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/WorkList.module.css';
import anglesRight from '../public/image/anglesRight.svg';
import Work from './Work';
import data from '../data.js';

const WorkList = () => {
  const [isFolded, setIsFolded] = useState(false);

  const handleTitleClick = () => {
    setIsFolded(!isFolded);
  };

  return (
    <section className={styles.container}>
      <div className={styles.header} id="work-list" onClick={handleTitleClick}>
        <Image className={styles.arrow} src={anglesRight} alt="icon" width="40px" height="40px" />
        <span className={styles.title}>WORKS</span>
      </div>
      <div className={styles.wrapper}>
        <section className={`${styles.list__container} ${isFolded ? styles.folded : styles.open}`}>
          <ul className={styles.list}>
            {data.map((item, index) => {
              return (
                <Work
                  key={index}
                  name={item.name}
                  img={item.img}
                  description={item.description}
                  stacks={item.stacks}
                  link={item.link}
                  company={item.company}
                />
              );
            })}
          </ul>
        </section>
      </div>
    </section>
  );
};

export default WorkList;
