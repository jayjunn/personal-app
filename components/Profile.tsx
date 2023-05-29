import React from 'react';
import styles from '../styles/Profile.module.css';
import anglesRight from '../public/image/anglesRight.svg';
import Image from 'next/image';
import { useUserContext } from '../context/userContext';
import { profileData as data } from '../data';

const Profile = () => {
  const handleScrollDown = () => {
    document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const { isEnglish } = useUserContext();
  const profile = isEnglish ? data.en : data.kr;

  return (
    <>
      <section className={styles.container}>
        {/* second colum */}
        <div className={styles.left__row}>
          <p className={styles.about__headLine}>{profile.headLine}</p>
          <div className={styles.about__container}>
            <div className={styles.about__title}>
              <div className={styles.about__arrow}>
                <Image className={(styles.about__arrow, styles.test)} src={anglesRight} alt="icon" width="40px" height="40px" />
              </div>
              <span className={styles.about__span}>ABOUT</span>
            </div>
            <p className={styles.about__p}>{profile.about}</p>
          </div>
        </div>
        <div className={styles.line}></div>
        <div className={styles.right__row}>
          <div className={styles.skills__container}>
            <div className={styles.skill__first}>
              <div className={styles.skills__header}>
                <Image className={(styles.arrows, styles.icon)} src={anglesRight} alt="icon" width="40px" height="40px" />
                <h3 className={styles.skills__title}>{isEnglish ? 'SKILLS' : '기술 스택'}</h3>
              </div>
            </div>
            <div className={styles.skills__content}>
              <p className={styles.skills__p}>{data.en.skills}</p>
            </div>
          </div>
          <div className={styles.arrow__container}>
            <button className={styles.down__arrow} onClick={handleScrollDown}>
              <Image className={styles.down__arrow} src={anglesRight} alt="home" width="40px" height="40px" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
