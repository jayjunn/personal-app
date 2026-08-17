'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { profileData } from '../data/portfolioData';
import DesktopNav from './header/DesktopNav';
import MobileNavOverlay from './header/MobileNavOverlay';
import { MenuIcon } from './icons';

export default function Header() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { language, setLanguage, isEnglish } = useLanguage();
  const profile = isEnglish ? profileData.en : profileData.kr;

  const handleLanguageToggle = () => {
    setIsLangOpen((prev) => !prev);
  };

  const handleLanguageSelect = (type: 'ENGLISH' | 'KOREAN') => {
    setLanguage(type);
    setIsLangOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className="
          fixed
          top-0
          left-0
          right-0
          z-[9990]
          w-full
          bg-[#e7e2d0]/95
          dark:bg-[#0d0e12]/95
          backdrop-blur-md
          border-b-[3px]
          border-black
          dark:border-[#272a34]
          transition-colors
          duration-200
        "
      >
        <section
          className="
            w-full
            flex
            justify-between
            items-center
            px-4
            sm:px-8
            pt-4
            sm:pt-5
            pb-2.5
            sm:pb-3
          "
        >
          <Link
            href="/"
            onClick={() => {
              setIsLangOpen(false);
              setIsMobileMenuOpen(false);
            }}
            className="cursor-pointer group flex flex-col md:flex-row md:items-baseline md:gap-3"
          >
            <h1
              className="
                text-2xl
                sm:text-3xl
                md:text-4xl
                font-black
                uppercase
                tracking-tight
                text-black
                dark:text-[#f3f4f6]
                m-0
                group-hover:opacity-85
                transition-opacity
              "
            >
              {profile.name}
            </h1>

            <h2
              className="
                text-xs
                sm:text-sm
                font-extrabold
                uppercase
                tracking-wider
                text-neutral-600
                dark:text-neutral-400
                mt-0.5
              "
            >
              FRONT-END DEVELOPER
            </h2>
          </Link>

          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
              aria-label="Open Command Palette"
              className="
                flex
                items-center
                justify-center
                px-2.5
                py-2
                bg-[#e7e2d0]
                dark:bg-[#16171e]
                border-2
                border-black
                dark:border-[#272a34]
                text-black
                dark:text-[#f3f4f6]
                shadow-[3px_3px_0px_#000000]
                active:translate-x-0.5
                active:translate-y-0.5
                active:shadow-none
                cursor-pointer
                font-mono
                text-xs
                font-black
              "
              title="Command Palette (⌘K)"
            >
              <span>⌘K</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(true);
                setIsLangOpen(false);
              }}
              aria-label="Open Navigation Menu"
              className="
                flex
                items-center
                justify-center
                gap-2
                px-3.5
                py-2
                bg-[#e7e2d0]
                dark:bg-[#16171e]
                border-2
                border-black
                dark:border-[#272a34]
                text-black
                dark:text-[#f3f4f6]
                shadow-[3px_3px_0px_#000000]
                active:translate-x-0.5
                active:translate-y-0.5
                active:shadow-none
                cursor-pointer
              "
            >
              <MenuIcon className="w-4 h-4 stroke-current" />
              <span className="text-xs font-mono font-black tracking-wider">
                MENU
              </span>
            </button>
          </div>
        </section>

        <DesktopNav
          language={language}
          isLangOpen={isLangOpen}
          onToggleLang={handleLanguageToggle}
          onSelectLang={handleLanguageSelect}
          onCloseLang={() => setIsLangOpen(false)}
        />
      </header>

      <MobileNavOverlay
        isOpen={isMobileMenuOpen}
        profileName={profile.name}
        language={language}
        onClose={() => setIsMobileMenuOpen(false)}
        onSetLanguage={setLanguage}
      />
    </>
  );
}