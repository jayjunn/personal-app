import React from "react";
import styles from "../styles/Profile.module.css";
import anglesRight from "../public/image/anglesRight.svg";
import Image from "next/image";

const Profile = () => {
  return (
    <>
      <main className={styles.container}>
        {/* second colum */}
        <section className={styles.left__row}>
          <p className={styles.about__headLine}>
            I BUILD SOMETHING THAT DISPLAYS ON DIGITAL SCREENS.
          </p>
          <div className={styles.about__container}>
            <div className={styles.about__title}>
              <Image
                className={styles.arrow}
                src={anglesRight}
                alt="icon"
                width="40px"
                height="40px"
              />
              <span className={styles.about__span}>ABOUT</span>
            </div>
            <p className={styles.about__p}>
              {` I'm a Creative Software Developer who enjoys interactive design, creative coding and full-stack web development. `}
            </p>
          </div>
        </section>
        <div className={styles.line}></div>
        {/* second colum */}
        <section className={styles.right__row}>
          <div className={styles.skill__first}>
            <div className={styles.skills__header}>
              <Image
                className={(styles.arrows, styles.icon)}
                src={anglesRight}
                alt="icon"
                width="40px"
                height="40px"
              />
              <span className={styles.skills__title}>SKILLS</span>
            </div>
          </div>
          <div className={styles.skills__content}>
            <p className={styles.skills__p}>
              HTML, CSS, JAVASCRIPT, <br />
              TYPESCRIPT, NEXT.JS, REACT, <br />
              NODE.JS, GIT, GRAPH QL, REACT NATIVE, MONGO DB, A/B TEST, FIGAMA,
            </p>
          </div>
          <div className={styles.arrow__container}>
            <div className={styles.down__arrow}>
              <Image
                className={styles.down__arrow}
                src={anglesRight}
                alt="home"
                width="40px"
                height="40px"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Profile;
