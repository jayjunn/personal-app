'use client';

import React from 'react';
import styles from '../app/styles/Profile.module.css';
import anglesRight from '../../public/image/anglesRight.svg';
import Image from 'next/image';
import { useUserContext } from '../context/userContext';
import { profileData } from '../data/portfolioData';

const Profile = () => {
  const handleScrollDown = () => {
    document.getElementById('works-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const { isEnglish } = useUserContext();

  const profile = isEnglish ? profileData.en : profileData.kr;

  const skills = [
    'REACT',
    'NEXT.JS',
    'TYPESCRIPT',
    'JAVASCRIPT',
    'TAILWINDCSS',
    'SCSS',
    'NODE.JS',
    'GIT',
    'HTML5',
    'RSPACK',
    'GRAPHQL',
    'REACT NATIVE',
  ];

  return (
    <section className={styles.container}>
      <div className={styles.left__row}>
        <p className={styles.about__headLine}>{profile.headLine}</p>
        <div className={styles.about__container}>
          <div className={styles.about__title}>
            <div className={styles.about__arrow}>
              <Image className={styles.about__arrow} src={anglesRight} alt="icon" width="30" height="30" />
            </div>
            <span className={styles.about__span}>ABOUT</span>
          </div>
          <div className={styles.about__p}>{profile.about}</div>
        </div>
      </div>
      <div className={styles.right__row}>
        <div className={styles.skills__container}>
          <div className={styles.skill__first}>
            <div className={styles.skills__header}>
              <Image className={styles.icon} src={anglesRight} alt="icon" width="20" height="20" />
              <h3 className="font-bold text-lg">{isEnglish ? 'SKILLS' : '기술 스택'}</h3>
            </div>
          </div>
          <div className={styles.skills__content}>
            <ul className={`${styles.skills__p} flex flex-wrap gap-3`}>
              {skills.map((skill) => (
                <li key={skill} className="border-[2px] border-black rounded-[8px] px-3 py-1 text-xs font-bold tracking-wider">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.arrow__container}>
          <button className={styles.down__arrow} onClick={handleScrollDown} aria-label="Scroll to Works">
            <Image className={styles.down__arrow} src={anglesRight} alt="scroll down" width="35" height="35" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
