'use client';

import React, { useState, useEffect, useRef } from 'react';
import Language from '../../public/image/language.svg';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserContext } from '../context/userContext';
import { profileData } from '../data/portfolioData';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [selectOn, setSelectOn] = useState(false);
  const { user, setLanguage, isEnglish } = useUserContext();
  const pathname = usePathname();
  const langRef = useRef<HTMLLIElement>(null);

  const profile = isEnglish ? profileData.en : profileData.kr;

  const handleLanguageButton = () => {
    setSelectOn((prev) => !prev);
  };

  const handleLanguageSelect = (type: 'ENGLISH' | 'KOREAN') => {
    setLanguage(type);
    setSelectOn(false);
  };

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setSelectOn(false);
      }
    };
    if (selectOn) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectOn]);

  const navList = [
    { title: 'HOME', link: `/` },
    { title: 'WORKS', link: `/works` },
    { title: 'EXPERIENCE', link: `/experience` },
    { title: 'TECH BLOG', link: `https://velog.io/@jayjunn/posts`, isExternal: true },
    { title: 'CV', link: `/cv` },
    { title: 'CONTACT', link: `/contact` },
  ];

  return (
    <header className="w-full">
      {/* Top Brand Banner */}
      <section className="w-full flex justify-between items-center px-4 sm:px-8 pt-5 pb-1">
        <Link href="/" onClick={() => setSelectOn(false)} className="cursor-pointer group">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-black m-0 group-hover:opacity-85 transition-opacity">
            {profile.name}
          </h1>
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-neutral-600 mt-0.5">
            FRONT-END DEVELOPER
          </h2>
        </Link>
      </section>

      {/* Navigation Bar with Inverted Active State */}
      <nav className="w-full mt-3 px-4 sm:px-8">
        <ul className="w-full bg-[#e7e2d0] border-[3px] border-black px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-center sm:justify-between gap-2 sm:gap-4 box-border">
          {navList.map((item, index) => {
            const isActive = !item.isExternal && pathname === item.link;
            return (
              <React.Fragment key={`nav-group-${item.title}-${index}`}>
                <li className="flex items-center">
                  {item.isExternal ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setSelectOn(false)}
                      className="px-2.5 sm:px-3 py-1 font-black text-xs sm:text-sm uppercase tracking-wider text-black hover:bg-black hover:text-[#e7e2d0] transition-colors flex items-center gap-1">
                      <span>{item.title}</span>
                      <span className="text-[10px]">↗</span>
                    </a>
                  ) : (
                    <Link
                      href={item.link}
                      onClick={() => setSelectOn(false)}
                      className={`px-2.5 sm:px-3 py-1 font-black text-xs sm:text-sm uppercase tracking-wider transition-all ${
                        isActive
                          ? 'bg-black text-[#e7e2d0] shadow-[2px_2px_0px_#000000]'
                          : 'text-black hover:bg-black hover:text-[#e7e2d0]'
                      }`}>
                      {item.title}
                    </Link>
                  )}
                </li>
                {index + 1 !== navList.length && (
                  <li className="hidden md:inline text-black/40 font-light select-none">
                    |
                  </li>
                )}
              </React.Fragment>
            );
          })}

          {/* Language Switcher */}
          <li ref={langRef} className="relative flex items-center">
            <button
              onClick={handleLanguageButton}
              aria-label="Toggle Language"
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white border-[1.5px] border-black cursor-pointer hover:bg-black hover:text-[#e7e2d0] transition-colors shadow-[1px_1px_0px_#000000] text-black">
              <Image
                src={Language}
                alt="language"
                width={18}
                height={18}
                className="w-4 h-4 sm:w-4.5 sm:h-4.5"
              />
              <span className="text-[11px] font-black font-mono">
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
                  className="absolute top-[calc(100%+8px)] right-0 bg-[#e7e2d0] border-[3px] border-black shadow-[4px_4px_0px_#000000] p-2.5 min-w-[145px] z-[100] flex flex-col gap-1.5 list-none m-0">
                  <li
                    className={`px-3 py-1.5 text-xs font-extrabold cursor-pointer flex items-center gap-2 transition-colors ${
                      user.language === 'ENGLISH'
                        ? 'bg-black text-[#e7e2d0]'
                        : 'text-black hover:bg-black hover:text-[#e7e2d0]'
                    }`}
                    onClick={() => handleLanguageSelect('ENGLISH')}>
                    <span>🇬🇧</span>
                    <span>English {user.language === 'ENGLISH' && '✓'}</span>
                  </li>
                  <li
                    className={`px-3 py-1.5 text-xs font-extrabold cursor-pointer flex items-center gap-2 transition-colors ${
                      user.language === 'KOREAN'
                        ? 'bg-black text-[#e7e2d0]'
                        : 'text-black hover:bg-black hover:text-[#e7e2d0]'
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
