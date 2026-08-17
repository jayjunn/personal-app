'use client';

import React from 'react';
import styles from '../app/styles/Experience.module.css';
import { experienceData as defaultExperienceData } from '../data/portfolioData';
import { ExperienceItem } from '../service/portfolioService';
import { useUserContext } from '../context/userContext';
import PageWrap from './common/PageWrap';
import { motion } from 'framer-motion';

interface ExperienceProps {
  limit?: number;
  showMoreLink?: boolean;
  initialExperiences?: ExperienceItem[];
}

export default function Experience({ limit, showMoreLink = false, initialExperiences }: ExperienceProps) {
  const { isEnglish } = useUserContext();

  const experiences = initialExperiences || defaultExperienceData;
  const displayedExperiences = limit ? experiences.slice(0, limit) : experiences;

  const languageSelector = (description: { en: string[]; kr: string[] }) => {
    if (!description) return [];
    return isEnglish ? description.en || [] : description.kr || [];
  };

  return (
    <PageWrap
      title="Experience"
      moreLink={showMoreLink ? '/experience' : undefined}
      moreText={isEnglish ? 'VIEW ALL EXPERIENCES ➔' : '전체 경력 보기 ➔'}>
      <ul className={styles.experience__list}>
        {displayedExperiences.map(({ role, company, description, stacks, id }, index) => (
          <motion.li
            className={styles.experience}
            key={`exp-${id || company}-${index}`}
            id={company.toLowerCase().replace(/\s+/g, '-')}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}>
            <div className={styles.experience__name}>
              <span className={styles.role}>{role},</span>
              <span className={styles.company}>{company}</span>
            </div>
            <ul className={styles.descriptions}>
              {languageSelector(description).map((item, dIndex) => (
                <li className={styles.description} key={`exp-desc-${company}-${dIndex}`}>
                  <p>- {item}</p>
                </li>
              ))}
            </ul>
            {stacks && (
              <div className={styles.experience__stacks}>
                {stacks.map((stack, sIdx) => (
                  <span key={`exp-stack-${company}-${stack}-${sIdx}`} className={styles.stack__badge}>
                    {stack}
                  </span>
                ))}
              </div>
            )}
          </motion.li>
        ))}
      </ul>
    </PageWrap>
  );
}
