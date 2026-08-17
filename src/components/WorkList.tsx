'use client';

import React from 'react';
import styles from '../app/styles/WorkList.module.css';
import Work from './Work';
import { workData } from '../data/portfolioData';
import { useUserContext } from '../context/userContext';
import PageWrap from './common/PageWrap';

interface WorkListProps {
  limit?: number;
  showMoreLink?: boolean;
}

const WorkList = ({ limit, showMoreLink = false }: WorkListProps) => {
  const { isEnglish } = useUserContext();

  const displayedWorks = limit ? workData.slice(0, limit) : workData;

  return (
    <PageWrap
      title="Works"
      moreLink={showMoreLink ? '/works' : undefined}
      moreText={isEnglish ? 'VIEW ALL WORKS ➔' : '전체 프로젝트 보기 ➔'}>
      <div className={styles.wrapper}>
        <div className={styles.list}>
          {displayedWorks.map((item, index) => (
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
