'use client';

import React, { useState, useEffect, useRef } from 'react';
import Language from '../../public/image/language.svg';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { profileData } from '../data/portfolioData';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [selectOn, setSelectOn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, isEnglish } = useLanguage();
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navList = [
    { title: 'HOME', link: `/` },
    { title: 'WORKS', link: `/works` },
    { title: 'EXPERIENCE', link: `/experience` },
    { title: 'TECH BLOG', link: `https://velog.io/@jayjunn/posts`, isExternal: true },
    { title: 'CV', link: `/cv` },
    { title: 'CONTACT', link: `/contact` },
  ];

  return (
    <header className="w-full relative">
      {/* Top Brand Banner */}
      <section className="w-full flex justify-between items-center px-4 sm:px-8 pt-5 sm:pt-6 pb-3 sm:pb-4">
        <Link href="/" onClick={() => { setSelectOn(false); setIsMobileMenuOpen(false); }} className="cursor-pointer group">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-black m-0 group-hover:opacity-85 transition-opacity">
            {profile.name}
          </h1>
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-neutral-600 mt-0.5">
            FRONT-END DEVELOPER
          </h2>
        </Link>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open Navigation Menu"
          className="md:hidden flex items-center justify-center w-9 h-9 bg-[#e7e2d0] border-2 border-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:bg-black text-black hover:text-white transition-all cursor-pointer box-border">
          <svg
            className="w-5 h-5 stroke-current"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="3"
            strokeLinecap="square">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </section>

      {/* Desktop Navigation Bar */}
      <nav className="hidden md:block w-full mt-4 sm:mt-5 px-4 sm:px-8 pb-2">
        <ul className="w-full bg-[#e7e2d0] border-[3px] border-black px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 box-border">
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
                      className="px-3 py-1.5 font-black text-xs lg:text-sm uppercase tracking-wider text-black hover:bg-black hover:text-white transition-colors flex items-center gap-1.5">
                      <span>{item.title}</span>
                      <span className="text-[10px]">↗</span>
                    </a>
                  ) : (
                    <Link
                      href={item.link}
                      onClick={() => setSelectOn(false)}
                      className={`px-3 py-1.5 font-black text-xs lg:text-sm uppercase tracking-wider transition-all ${
                        isActive
                          ? 'bg-black text-white'
                          : 'text-black hover:bg-black hover:text-white'
                      }`}>
                      {item.title}
                    </Link>
                  )}
                </li>
                {index + 1 !== navList.length && (
                  <li className="text-black/30 font-light select-none">|</li>
                )}
              </React.Fragment>
            );
          })}

          {/* Language Switcher */}
          <li ref={langRef} className="relative flex items-center">
            <button
              onClick={handleLanguageButton}
              aria-label="Toggle Language"
              className="flex items-center gap-2 px-3 py-1.5 bg-[#e7e2d0] border-[1.5px] border-black cursor-pointer hover:bg-black hover:text-[#e7e2d0] transition-colors shadow-[1px_1px_0px_#000000] text-black">
              <Image
                src={Language}
                alt="language"
                width={18}
                height={18}
                className="w-4 h-4"
              />
              <span className="text-[11px] font-black font-mono">
                {language === 'ENGLISH' ? 'EN' : 'KR'}
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
                      language === 'ENGLISH'
                        ? 'bg-black text-white'
                        : 'text-black hover:bg-black hover:text-white'
                    }`}
                    onClick={() => handleLanguageSelect('ENGLISH')}>
                    <span>🇬🇧</span>
                    <span>English {language === 'ENGLISH' && '✓'}</span>
                  </li>
                  <li
                    className={`px-3 py-1.5 text-xs font-extrabold cursor-pointer flex items-center gap-2 transition-colors ${
                      language === 'KOREAN'
                        ? 'bg-black text-white'
                        : 'text-black hover:bg-black hover:text-white'
                    }`}
                    onClick={() => handleLanguageSelect('KOREAN')}>
                    <span>🇰🇷</span>
                    <span>한국어 {language === 'KOREAN' && '✓'}</span>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        </ul>
      </nav>

      {/* Mobile Full-Screen Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-[99999] bg-[#e7e2d0] flex flex-col justify-between p-6 sm:p-8 select-none touch-manipulation">
            {/* Top Bar inside Overlay */}
            <div className="w-full flex items-center justify-between border-b-2 border-black pb-4">
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black uppercase tracking-tight text-black">
                  {profile.name}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-600 font-mono">
                  NAVIGATION DIRECTORY
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#e7e2d0] border-2 border-black font-mono text-xs font-black uppercase shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:bg-black hover:text-white transition-all cursor-pointer text-black">
                <span>✕</span>
                <span>CLOSE</span>
              </button>
            </div>

            {/* Menu List */}
            <div className="flex flex-col gap-2 my-auto py-6 items-center justify-center text-center w-full max-w-sm mx-auto">
              {navList.map((item, index) => {
                const isActive = !item.isExternal && pathname === item.link;
                return (
                  <motion.div
                    key={`mobile-nav-${item.title}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 + 0.06, duration: 0.2 }}
                    className="w-full border-b border-black/20 py-3 flex items-center justify-center">
                    {item.isExternal ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-black uppercase tracking-tight text-black active:scale-95 transition-transform">
                        <span className="font-mono text-xs font-bold text-neutral-500">
                          0{index + 1}.
                        </span>
                        <span>{item.title}</span>
                        <span className="text-lg font-mono">↗</span>
                      </a>
                    ) : (
                      <Link
                        href={item.link}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-center gap-2 text-2xl sm:text-3xl font-black uppercase tracking-tight active:scale-95 transition-transform ${
                          isActive
                            ? 'text-black underline underline-offset-8 decoration-2'
                            : 'text-black'
                        }`}>
                        <span className="font-mono text-xs font-bold text-neutral-500">
                          0{index + 1}.
                        </span>
                        <span>{item.title}</span>
                        {isActive && (
                          <span className="text-[10px] font-mono bg-black text-[#e7e2d0] px-1.5 py-0.5 border border-black ml-1">
                            ACTIVE
                          </span>
                        )}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom: Language Switcher */}
            <div className="w-full flex flex-col items-center justify-center gap-3.5 border-t-2 border-black pt-4 text-center">
              <div className="flex items-center border-2 border-black bg-[#e7e2d0] shadow-[2px_2px_0px_#000000]">
                <button
                  type="button"
                  onClick={() => setLanguage('KOREAN')}
                  className={`px-3 py-1.5 text-[11px] font-mono font-black transition-colors ${
                    language === 'KOREAN'
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-[#d4ceb8]'
                  }`}>
                  🇰🇷 한국어
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ENGLISH')}
                  className={`px-3 py-1.5 text-[11px] font-mono font-black transition-colors ${
                    language === 'ENGLISH'
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-[#d4ceb8]'
                  }`}>
                  🇬🇧 English
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 text-[10px] font-mono font-bold text-neutral-600">
                <span>© YOUNGGEUN JUN</span>
                <span>•</span>
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="underline hover:text-black text-neutral-600">
                  ADMIN
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
