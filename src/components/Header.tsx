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
          backdrop-blur-md
          border-b-[3px]
          border-black
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
            pt-5
            sm:pt-6
            pb-3
            sm:pb-4
          "
        >
          <Link
            href="/"
            onClick={() => {
              setIsLangOpen(false);
              setIsMobileMenuOpen(false);
            }}
            className="cursor-pointer group"
          >
            <h1
              suppressHydrationWarning
              className="
                text-2xl
                sm:text-3xl
                md:text-4xl
                font-black
                uppercase
                tracking-tight
                text-black
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
                mt-0.5
              "
            >
              FRONT-END DEVELOPER
            </h2>
          </Link>

          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(true);
              setIsLangOpen(false);
            }}
            aria-label="Open Navigation Menu"
            className="
              md:hidden
              flex
              items-center
              justify-center
              w-9
              h-9
              bg-[#e7e2d0]
              border-2
              border-black
              shadow-[2px_2px_0px_#000000]
              active:translate-x-0.5
              active:translate-y-0.5
              active:shadow-none
              hover:bg-black
              text-black
              hover:text-white
              transition-all
              cursor-pointer
              box-border
            "
          >
            <MenuIcon className="w-5 h-5 stroke-current" />
          </button>
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