import React, { useState } from 'react';
import styles from '../styles/Header.module.css';
import Image from 'next/image';
import linkedin from '../public/image/linkedin.svg';
import github from '../public/image/github.svg';
import envelope from '../public/image/envelope.svg';
import Language from '../public/image/language.svg';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUserContext } from '../context/userContext';
import { profileData } from '../data';

const Header = () => {
  const [selectOn, setSelectOn] = useState(false);
  const { user, setUser, isEnglish } = useUserContext();
  const handleLanguageButton = () => {
    setSelectOn(!selectOn);
  };
  const handleLanguageSelect = (type: string) => {
    const newUser = { ...user, language: type };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setSelectOn(false);
  };

  const profile = isEnglish ? profileData.en : profileData.kr;

  return (
    <header>
      <section>
        <div className={styles.header}>
          <h1 className={styles.first__name}>{profile.name}</h1>
          <h1 className={styles.front}>FRONT-END DEVELOPER</h1>
        </div>
      </section>
      <section className={styles.second__header}>
        <div className={styles.contact}>
          <span className={styles.find__me}>FIND ME</span>
        </div>
        <div className={styles.find__arrows}>
          <span> {`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`}</span>
        </div>
        <ul className={styles.socials}>
          <li className={styles.social}>
            <Link href="https://github.com/jayjunn">
              <Image
                className={styles.social}
                src={github} //
                alt="home"
                width="40"
                height="40"
              />
            </Link>
          </li>
          <li className={styles.social}>
            <Link href="https://www.linkedin.com/in/younggeun">
              <Image className={styles.social} src={linkedin} alt="home" width="40" height="40" />
            </Link>
          </li>
          <li className={styles.email}>
            <Link href="mailto:jayjunn@outlook.com">
              <Image className={styles.social} src={envelope} alt="home" width="40" height="40" />
            </Link>
          </li>
          <li className={styles.language}>
            <button className={styles.language__icon} onClick={handleLanguageButton}>
              <Image src={Language} alt="language" width="40" height="40" />
            </button>
            {selectOn && (
              <motion.ul
                className={styles.select}
                initial={{
                  scale: 0,
                  x: '-50%',
                }}
                animate={{ rotate: 360, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 160,
                  damping: 20,
                }}>
                <li className={styles.option} onClick={() => handleLanguageSelect('ENGLISH')}>
                  English
                </li>
                <li className={styles.option} onClick={() => handleLanguageSelect('KOREAN')}>
                  한국어
                </li>
              </motion.ul>
            )}
          </li>
        </ul>
      </section>
    </header>
  );
};
export default Header;
