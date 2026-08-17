'use client';

import React from 'react';
import styles from '../app/styles/Experience.module.css';
import { experienceData } from '../data/portfolioData';
import { useUserContext } from '../context/userContext';
import PageWrap from './common/PageWrap';

interface ExperienceProps {
  limit?: number;
  showMoreLink?: boolean;
}

export default function Experience({ limit, showMoreLink = false }: ExperienceProps) {
  const { isEnglish } = useUserContext();

  const displayedExperiences = limit ? experienceData.slice(0, limit) : experienceData;

  const languageSelector = (description: { en: string[]; kr: string[] }) => {
    return isEnglish ? description.en : description.kr;
  };

  return (
    <PageWrap
      title="Experience"
      moreLink={showMoreLink ? '/experience' : undefined}
      moreText={isEnglish ? 'VIEW ALL EXPERIENCES ➔' : '전체 경력 보기 ➔'}>
      <ul className={styles.experience__list}>
        {displayedExperiences.map(({ role, company, description }, index) => (
          <li className={styles.experience} key={index} id={company.toLowerCase().replace(/\s+/g, '-')}>
            <div className={styles.experience__name}>
              <span className={styles.role}>{role},</span>
              <span className={styles.company}>{company}</span>
            </div>
            <ul className={styles.descriptions}>
              {languageSelector(description).map((item, dIndex) => (
                <li className={styles.description} key={dIndex}>
                  <p>- {item}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </PageWrap>
  );
}
