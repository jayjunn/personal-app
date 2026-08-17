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
  const { user, setLanguage, isEnglish } = useUserContext();

  const profile = isEnglish ? profileData.en : profileData.kr;

  const handleLanguageButton = () => {
    setSelectOn(!selectOn);
  };

  const handleLanguageSelect = (type: 'ENGLISH' | 'KOREAN') => {
    setLanguage(type);
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
            <React.Fragment key={`nav-group-${item.title}-${index}`}>
              <li className={styles.nav__list}>
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
                <li className={styles.nav__list}>
                  <span className={styles.divider}>|</span>
                </li>
              )}
            </React.Fragment>
          ))}
          <li className={styles.language}>
            <button
              className={styles.language__icon}
              onClick={handleLanguageButton}
              aria-label="Toggle Language"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Image
                src={Language}
                alt="language"
                width={24}
                height={24}
                style={{ width: '24px', height: '24px' }}
              />
              <span style={{ fontSize: '11px', fontWeight: 800, fontFamily: 'monospace' }}>
                {user.language === 'ENGLISH' ? 'EN' : 'KR'}
              </span>
            </button>
            {selectOn && (
              <motion.ul
                className={styles.select}
                initial={{
                  scale: 0,
                  x: '-50%',
                }}
                animate={{ scale: 1, x: '-50%' }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                }}>
                <li
                  className={styles.option}
                  style={{ fontWeight: user.language === 'ENGLISH' ? 900 : 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => handleLanguageSelect('ENGLISH')}>
                  <span>🇬🇧</span>
                  <span>English {user.language === 'ENGLISH' && '✓'}</span>
                </li>
                <li
                  className={styles.option}
                  style={{ fontWeight: user.language === 'KOREAN' ? 900 : 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => handleLanguageSelect('KOREAN')}>
                  <span>🇰🇷</span>
                  <span>한국어 {user.language === 'KOREAN' && '✓'}</span>
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
