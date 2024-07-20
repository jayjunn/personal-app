'use client';

import React from 'react';
import styles from '../app/styles/Experience.module.css';
import anglesRight from '../../public/image/anglesRight.svg';
import Image from 'next/image';
import { experienceData } from '../../data';
import { useUserContext } from '../context/userContext';

export default function Experience() {
  const { isEnglish } = useUserContext();

  const handleExperienceClick = (company: string) => {
    document.getElementById(`${company.toLocaleLowerCase()}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const languageSelector = (description: { en: string[]; kr: string[] }) => {
    return isEnglish ? description.en : description.kr;
  };

  return (
    <section className={styles.container}>
      <div className={styles.header} id="experiences">
        <Image className={styles.arrow} src={anglesRight} alt="icon" width="40" height="40" />
        <h4 className={styles.title}>Experience</h4>
      </div>
      <ul className={`${styles.experience__list} ${styles.open}`}>
        {experienceData.map(({ role, company, description }, index) => (
          <li className={styles.experience} key={index} onClick={() => handleExperienceClick(company)}>
            <div className={styles.experience__name}>
              <h5 className={styles.role}>{role},</h5>
              <h5>{company}</h5>
            </div>
            <ul className={styles.descriptions}>
              {languageSelector(description).map((item, index) => (
                <li className={styles.description} key={index}>
                  <p>- {item}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
