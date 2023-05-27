import React from 'react';
import styles from '../styles/Profile.module.css';
import anglesRight from '../public/image/anglesRight.svg';
import Image from 'next/image';

const Profile = () => {
  const handleScrollDown = () => {
    document.getElementById('work-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <section className={styles.container}>
        {/* second colum */}
        <div className={styles.left__row}>
          <p className={styles.about__headLine}>I BUILD SOMETHING THAT DISPLAYS ON DIGITAL SCREENS.</p>
          <div className={styles.about__container}>
            <div className={styles.about__title}>
              <div className={styles.about__arrow}>
                <Image className={(styles.about__arrow, styles.test)} src={anglesRight} alt="icon" width="40px" height="40px" />
              </div>
              <span className={styles.about__span}>ABOUT</span>
            </div>
            <p className={styles.about__p}>
              {` I'm a Creative Software Developer who enjoys interactive design, creative coding and full-stack web development. `}
            </p>
          </div>
        </div>
        <div className={styles.line}></div>
        {/* second colum */}
        <div className={styles.right__row}>
          <div className={styles.skills__container}>
            <div className={styles.skill__first}>
              <div className={styles.skills__header}>
                <Image className={(styles.arrows, styles.icon)} src={anglesRight} alt="icon" width="40px" height="40px" />
                <h3 className={styles.skills__title}> SKILLS</h3>
              </div>
            </div>
            <div className={styles.skills__content}>
              <p className={styles.skills__p}>
                REACT, TYPESCRIPT, JAVASCRIPT, NEXT.JS, REACT QUERY, SCSS, NODE.JS, VUE.JS, GIT, GRAPH QL, REACT NATIVE, MONGO DB, A/B TEST, FIGAMA,
                HTML, CSS,
              </p>
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
