'use client';

import React, { useState } from 'react';
import styles from '../app/styles/Header.module.css';
import Language from '../../public/image/language.svg';
import { motion } from 'framer-motion';
import { useUserContext } from '../context/userContext';
import { profileData } from '../data/portfolioData';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  const [selectOn, setSelectOn] = useState(false);
  const { user, setUser, isEnglish } = useUserContext();

  const profile = isEnglish ? profileData.en : profileData.kr;

  const handleLanguageButton = () => {
    setSelectOn(!selectOn);
  };

  const handleLanguageSelect = (type: string) => {
    const newUser = { ...user, language: type };
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(newUser));
    }
    setUser(newUser);
    setSelectOn(false);
  };

  const navList = [
    { title: 'Home', link: `/` },
    { title: 'Works', link: `/works` },
    { title: 'Experience', link: `/experience` },
    { title: 'Tech Blog', link: `https://velog.io/@jayjunn/posts` },
    { title: 'CV', link: `/cv` },
    { title: 'Contact', link: `/contact` },
  ];

  return (
    <header>
      <section>
        <div className={styles.header}>
          <Link href={`/`} onClick={() => setSelectOn(false)}>
            <h1 className={styles.first__name}>{profile.name}</h1>
            <h1 className={styles.front}>FRONT-END DEVELOPER</h1>
          </Link>
        </div>
      </section>
      <nav>
        <ul className={styles.ul}>
          {navList.map((item, index) => (
            <React.Fragment key={`group-${item.title}`}>
              <li className={styles.nav__list} key={`nav-${item.title}`}>
                {item.title === 'Tech Blog' ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" onClick={() => setSelectOn(false)}>
                    {item.title}
                  </a>
                ) : (
                  <Link href={item.link} onClick={() => setSelectOn(false)}>
                    {item.title}
                  </Link>
                )}
              </li>
              {index + 1 !== navList.length && (
                <li key={`divider-${item.title}`} className={styles.nav__list}>
                  <span className={styles.divider}>|</span>
                </li>
              )}
            </React.Fragment>
          ))}
          <li className={styles.language} key={`button`}>
            <button className={styles.language__icon} onClick={handleLanguageButton} aria-label="Toggle Language">
              <Image
                src={Language}
                alt="language"
                width={28}
                height={28}
                style={{ width: '28px', height: '28px' }}
              />
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
      </nav>
    </header>
  );
};

export default Header;
