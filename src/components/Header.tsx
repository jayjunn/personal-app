'use client';

import React, { useState } from 'react';
import styles from '../app/styles/Header.module.css';
import Language from '../../public/image/language.svg';
import { motion } from 'framer-motion';
import { useUserContext } from '../context/userContext';
import { profileData } from '../../data';
import Image from 'next/image';
import Link from 'next/link';
import { faL } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [selectOn, setSelectOn] = useState(false);
  const { user, setUser, isEnglish } = useUserContext();

  const profile = isEnglish ? profileData.en : profileData.kr;

  const handleLanguageButton = () => {
    setSelectOn(!selectOn);
  };

  const handleLanguageSelect = (type: string) => {
    const newUser = { ...user, language: type };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setSelectOn(false);
  };

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
          <Link href={`/experience`} onClick={() => setSelectOn(false)}>
            Experience
          </Link>
          <Link href={`/works`} onClick={() => setSelectOn(false)}>
            Works
          </Link>
          <Link href={`/contact`} onClick={() => setSelectOn(false)}>
            Contact
          </Link>
          <li className={styles.language}>
            <button className={styles.language__icon} onClick={handleLanguageButton}>
              <Image src={Language} className="w-[24px] md:w-[40px] lg:w-[50px]" alt="language" width="30" height="30" />
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
