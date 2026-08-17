'use client';

import React from 'react';
import styles from '../app/styles/Profile.module.css';
import anglesRight from '../../public/image/anglesRight.svg';
import Image from 'next/image';
import { useUserContext } from '../context/userContext';
import { profileData } from '../data/portfolioData';
import { motion } from 'framer-motion';

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
      <motion.div
        className={styles.left__row}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}>
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
      </motion.div>

      <motion.div
        className={styles.right__row}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}>
        <div className={styles.skills__container}>
          <div className={styles.skill__first}>
            <div className={styles.skills__header}>
              <Image className={styles.icon} src={anglesRight} alt="icon" width="20" height="20" />
              <h3 className="font-bold text-lg">{isEnglish ? 'SKILLS' : '기술 스택'}</h3>
            </div>
          </div>
          <div className={styles.skills__content}>
            <div className={styles.skills__p}>
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  className={styles.skill__tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}>
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.arrow__container}>
          <button className={styles.down__arrow} onClick={handleScrollDown} aria-label="Scroll to Works">
            <Image className={styles.down__arrow} src={anglesRight} alt="scroll down" width="35" height="35" />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Profile;
