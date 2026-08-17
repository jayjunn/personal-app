'use client';

import React from 'react';
import styles from '../app/styles/WorkList.module.css';
import Work from './Work';
import { workData } from '../data/portfolioData';
import { useUserContext } from '../context/userContext';
import PageWrap from './common/PageWrap';

const WorkList = () => {
  const { isEnglish } = useUserContext();

  return (
    <PageWrap title="Works">
      <div className={styles.wrapper}>
        <div className={styles.list}>
          {workData.map((item, index) => (
            <Work
              key={index}
              name={item.name}
              img={item.img}
              description={isEnglish ? item.description.en : item.description.kr}
              stacks={item.stacks}
              link={item.link}
              company={item.company}
            />
          ))}
        </div>
      </div>
    </PageWrap>
  );
};

export default WorkList;
