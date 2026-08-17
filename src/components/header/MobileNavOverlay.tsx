'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LIST } from './navData';
import { useTheme } from '@/providers/ThemeProvider';
import { SunIcon, MoonIcon } from '@/components/icons';
import { useLanguage } from '@/hooks/useLanguage';

interface MobileNavOverlayProps {
  isOpen: boolean;
  profileName: string;
  language: 'ENGLISH' | 'KOREAN';
  onClose: () => void;
  onSetLanguage: (lang: 'ENGLISH' | 'KOREAN') => void;
}

export default function MobileNavOverlay({
  isOpen,
  profileName,
  language,
  onClose,
  onSetLanguage,
}: MobileNavOverlayProps) {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="
            fixed
            inset-0
            z-[999999]
            w-screen
            h-[100dvh]
            bg-[#e7e2d0]
            dark:bg-[#0d0e12]
            flex
            flex-col
            justify-between
            p-5
            sm:p-8
            box-border
            overflow-y-auto
            overscroll-none
          "
        >
          {/* Top Bar inside Overlay */}
          <div
            className="
              flex
              items-center
              justify-between
              pb-4
              border-b-[3px]
              border-black
              dark:border-[#272a34]
              bg-[#e7e2d0]
              dark:bg-[#0d0e12]
              shrink-0
            "
          >
            <div className="flex flex-col">
              <span
                className="text-lg sm:text-xl font-black uppercase tracking-tight text-black dark:text-[#f3f4f6]"
              >
                {profileName}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-mono">
                {t.nav.navDirectory}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                p-2.5
                bg-[#e7e2d0]
                dark:bg-[#16171e]
                border-2
                border-black
                dark:border-[#272a34]
                text-black
                dark:text-[#f3f4f6]
                font-black
                text-base
                leading-none
                shadow-[2px_2px_0px_#000000]
                dark:shadow-[2px_2px_0px_#000000]
                active:translate-x-0.5
                active:translate-y-0.5
                active:shadow-none
                cursor-pointer
                hover:bg-neutral-200
                dark:hover:bg-[#252834]
                transition-colors
              "
              aria-label="Close Menu"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="my-auto py-6 flex flex-col justify-center">
            <ul className="flex flex-col gap-3 list-none p-0 m-0 w-full">
              {NAV_LIST.map((item, index) => {
                const isActive = !item.isExternal && pathname === item.link;

                return (
                  <li key={`mobile-nav-${item.title}-${index}`}>
                    {item.isExternal ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        className="
                          flex
                          items-center
                          justify-between
                          px-4
                          py-3.5
                          border-2
                          border-black
                          dark:border-[#272a34]
                          bg-[#f4f0e3]
                          dark:bg-[#16171e]
                          text-black
                          dark:text-[#f3f4f6]
                          font-black
                          text-base
                          uppercase
                          tracking-wider
                          shadow-[3px_3px_0px_#000000]
                          dark:shadow-[3px_3px_0px_#000000]
                          active:translate-x-0.5
                          active:translate-y-0.5
                          active:shadow-none
                          hover:bg-black
                          hover:text-white
                          dark:hover:bg-[#252834]
                          dark:hover:text-white
                          transition-colors
                        "
                      >
                        <span>{item.title}</span>
                        <span className="text-xs">↗</span>
                      </a>
                    ) : (
                      <Link
                        href={item.link}
                        onClick={onClose}
                        className={`
                          flex
                          items-center
                          justify-between
                          px-4
                          py-3.5
                          border-2
                          border-black
                          dark:border-[#272a34]
                          font-black
                          text-base
                          uppercase
                          tracking-wider
                          shadow-[3px_3px_0px_#000000]
                          dark:shadow-[3px_3px_0px_#000000]
                          active:translate-x-0.5
                          active:translate-y-0.5
                          active:shadow-none
                          transition-all
                          ${
                            isActive
                              ? 'bg-black text-[#e7e2d0] dark:bg-[#ded8c4] dark:text-black dark:border-[#ded8c4]'
                              : 'bg-[#f4f0e3] dark:bg-[#16171e] text-black dark:text-[#f3f4f6] hover:bg-black hover:text-white dark:hover:bg-[#252834] dark:hover:text-white'
                          }
                        `}
                      >
                        <span>{item.title}</span>
                        <span>➔</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Quick Command Palette Button */}
            <div className="mt-4 pt-3 border-t border-black/20 dark:border-white/10">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('open-command-palette'));
                  }, 200);
                }}
                className="
                  w-full
                  flex
                  items-center
                  justify-between
                  px-4
                  py-3
                  border-2
                  border-black
                  dark:border-[#272a34]
                  bg-[#e7e2d0]
                  dark:bg-[#1f212a]
                  text-black
                  dark:text-[#f3f4f6]
                  font-black
                  text-sm
                  uppercase
                  tracking-wider
                  shadow-[3px_3px_0px_#000000]
                  dark:shadow-[3px_3px_0px_#000000]
                  active:translate-x-0.5
                  active:translate-y-0.5
                  active:shadow-none
                  cursor-pointer
                  hover:bg-black
                  hover:text-white
                  dark:hover:bg-[#252834]
                  dark:hover:text-white
                  transition-colors
                "
              >
                <div className="flex items-center gap-2 font-mono">
                  <span>⚡</span>
                  <span>COMMAND PALETTE</span>
                </div>
                <span className="font-mono text-xs border border-current px-1.5 py-0.5 font-bold">
                  ⌘K
                </span>
              </button>
            </div>
          </nav>

          {/* Bottom Bar inside Overlay: Theme & Language */}
          <div
            className="
              flex
              items-center
              justify-between
              flex-wrap
              gap-3
              pt-4
              border-t-[3px]
              border-black
              dark:border-[#272a34]
              bg-[#e7e2d0]
              dark:bg-[#0d0e12]
              shrink-0
            "
          >
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="
                flex
                items-center
                gap-2
                px-3.5
                py-2
                border-2
                border-black
                dark:border-[#272a34]
                bg-[#f4f0e3]
                dark:bg-[#16171e]
                text-black
                dark:text-[#f3f4f6]
                shadow-[2px_2px_0px_#000000]
                dark:shadow-[2px_2px_0px_#000000]
                text-xs
                font-mono
                font-black
                cursor-pointer
                hover:bg-neutral-200
                dark:hover:bg-[#252834]
                transition-colors
              "
            >
              {isDark ? (
                <>
                  <SunIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>LIGHT MODE</span>
                </>
              ) : (
                <>
                  <MoonIcon className="w-3.5 h-3.5 text-neutral-800" />
                  <span>DARK MODE</span>
                </>
              )}
            </button>

            {/* Language Switch */}
            <div
              className="
                flex
                items-center
                border-2
                border-black
                dark:border-[#272a34]
                bg-[#f4f0e3]
                dark:bg-[#16171e]
                shadow-[2px_2px_0px_#000000]
                dark:shadow-[2px_2px_0px_#000000]
              "
            >
              <button
                type="button"
                onClick={() => onSetLanguage('KOREAN')}
                className={`
                  px-3
                  py-1.5
                  text-xs
                  font-mono
                  font-black
                  cursor-pointer
                  transition-colors
                  ${
                    language === 'KOREAN'
                      ? 'bg-black text-[#e7e2d0] dark:bg-[#ded8c4] dark:text-black'
                      : 'text-black dark:text-[#a1a1aa] hover:bg-black/10 dark:hover:bg-[#252834] dark:hover:text-white'
                  }
                `}
              >
                🇰🇷 KR
              </button>

              <button
                type="button"
                onClick={() => onSetLanguage('ENGLISH')}
                className={`
                  px-3
                  py-1.5
                  text-xs
                  font-mono
                  font-black
                  cursor-pointer
                  border-l-2
                  border-black
                  dark:border-[#272a34]
                  transition-colors
                  ${
                    language === 'ENGLISH'
                      ? 'bg-black text-[#e7e2d0] dark:bg-[#ded8c4] dark:text-black'
                      : 'text-black dark:text-[#a1a1aa] hover:bg-black/10 dark:hover:bg-[#252834] dark:hover:text-white'
                  }
                `}
              >
                🇬🇧 EN
              </button>
            </div>

            <div className="w-full text-center text-[10px] font-mono font-bold text-neutral-600 dark:text-neutral-500 pt-1">
              <span>© YOUNGGEUN JUN • ALL RIGHTS RESERVED</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
