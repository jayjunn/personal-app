'use client';

import React, { useState } from 'react';
import Language from '../../public/image/language.svg';
import { motion, AnimatePresence } from 'framer-motion';
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
    <header className="w-full">
      {/* Top Brand Banner */}
      <section className="w-full flex justify-between items-center px-4 sm:px-8 pt-5 pb-0">
        <Link href={`/`} onClick={() => setSelectOn(false)} className="cursor-pointer group">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-black m-0">
            {profile.name}
          </h1>
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-600 mt-0.5">
            FRONT-END DEVELOPER
          </h2>
        </Link>
      </section>

      {/* Navigation Bar */}
      <nav className="w-full mt-3 px-3 sm:px-8">
        <ul className="w-full bg-[#e7e2d0] border-[3px] border-black px-3 sm:px-8 py-2.5 flex flex-wrap items-center justify-center sm:justify-between gap-2.5 sm:gap-4 box-border">
          {navList.map((item, index) => (
            <React.Fragment key={`nav-group-${item.title}-${index}`}>
              <li className="flex items-center text-xs sm:text-sm font-extrabold uppercase tracking-tight">
                {item.title === 'Tech Blog' ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSelectOn(false)}
                    className="px-1.5 py-0.5 transition-colors hover:bg-black hover:text-[#e7e2d0]">
                    {item.title}
                  </a>
                ) : (
                  <Link
                    href={item.link}
                    onClick={() => setSelectOn(false)}
                    className="px-1.5 py-0.5 transition-colors hover:bg-black hover:text-[#e7e2d0]">
                    {item.title}
                  </Link>
                )}
              </li>
              {index + 1 !== navList.length && (
                <li className="hidden md:inline text-neutral-400 font-light select-none">
                  |
                </li>
              )}
            </React.Fragment>
          ))}

          {/* Language Switcher */}
          <li className="relative flex items-center">
            <button
              onClick={handleLanguageButton}
              aria-label="Toggle Language"
              className="flex items-center gap-1.5 px-2 py-1 bg-white border-[1.5px] border-black cursor-pointer hover:bg-black hover:text-[#e7e2d0] transition-colors shadow-[1px_1px_0px_#000000]">
              <Image
                src={Language}
                alt="language"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span className="text-[11px] font-extrabold font-mono">
                {user.language === 'ENGLISH' ? 'EN' : 'KR'}
              </span>
            </button>

            <AnimatePresence>
              {selectOn && (
                <motion.ul
                  initial={{ opacity: 0, scale: 0.9, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-[calc(100%+8px)] right-0 bg-[#e7e2d0] border-[3px] border-black shadow-[4px_4px_0px_#000000] p-2.5 min-w-[140px] z-[100] flex flex-col gap-1.5">
                  <li
                    className={`px-2.5 py-1.5 text-xs font-extrabold cursor-pointer flex items-center gap-2 transition-colors ${
                      user.language === 'ENGLISH'
                        ? 'bg-black text-[#e7e2d0]'
                        : 'hover:bg-black hover:text-[#e7e2d0]'
                    }`}
                    onClick={() => handleLanguageSelect('ENGLISH')}>
                    <span>🇬🇧</span>
                    <span>English {user.language === 'ENGLISH' && '✓'}</span>
                  </li>
                  <li
                    className={`px-2.5 py-1.5 text-xs font-extrabold cursor-pointer flex items-center gap-2 transition-colors ${
                      user.language === 'KOREAN'
                        ? 'bg-black text-[#e7e2d0]'
                        : 'hover:bg-black hover:text-[#e7e2d0]'
                    }`}
                    onClick={() => handleLanguageSelect('KOREAN')}>
                    <span>🇰🇷</span>
                    <span>한국어 {user.language === 'KOREAN' && '✓'}</span>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
