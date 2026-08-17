'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LIST } from './navData';
import LanguageDropdown from './LanguageDropdown';
import { useTheme } from '@/providers/ThemeProvider';
import { SunIcon, MoonIcon } from '@/components/icons';

interface DesktopNavProps {
  language: 'ENGLISH' | 'KOREAN';
  isLangOpen: boolean;
  onToggleLang: () => void;
  onSelectLang: (lang: 'ENGLISH' | 'KOREAN') => void;
  onCloseLang: () => void;
}

export default function DesktopNav({
  language,
  isLangOpen,
  onToggleLang,
  onSelectLang,
  onCloseLang,
}: DesktopNavProps) {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="hidden md:block w-full mt-4 sm:mt-5 px-4 sm:px-8 pb-2">
      <ul
        className="
          w-full
          bg-[#e7e2d0]
          dark:bg-[#16171e]
          border-[3px]
          border-black
          dark:border-[#272a34]
          px-4
          sm:px-6
          py-3.5
          flex
          items-center
          justify-between
          gap-3
          box-border
          transition-colors
          duration-200
          shadow-[4px_4px_0px_#000000]
        "
      >
        {NAV_LIST.map((item, index) => {
          const isActive = !item.isExternal && pathname === item.link;

          return (
            <React.Fragment key={`nav-${item.title}-${index}`}>
              <li className="flex items-center">
                {item.isExternal ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onCloseLang}
                    className="
                      px-3
                      py-1.5
                      font-black
                      text-xs
                      lg:text-sm
                      uppercase
                      tracking-wider
                      text-black
                      dark:text-[#f3f4f6]
                      hover:bg-black
                      hover:text-white
                      dark:hover:bg-[#252834]
                      dark:hover:text-white
                      transition-colors
                      flex
                      items-center
                      gap-1.5
                    "
                  >
                    <span>{item.title}</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                ) : (
                  <Link
                    href={item.link}
                    onClick={onCloseLang}
                    className={`
                      px-3
                      py-1.5
                      font-black
                      text-xs
                      lg:text-sm
                      uppercase
                      tracking-wider
                      transition-all
                      ${
                        isActive
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : 'text-black dark:text-[#f3f4f6] hover:bg-black hover:text-white dark:hover:bg-[#252834] dark:hover:text-white'
                      }
                    `}
                  >
                    {item.title}
                  </Link>
                )}
              </li>

              {index + 1 !== NAV_LIST.length && (
                <li className="text-black/30 dark:text-white/20 font-light select-none">|</li>
              )}
            </React.Fragment>
          );
        })}

        {/* Right Controls: Command Palette, Theme Toggle & Language Dropdown */}
        <li className="flex items-center gap-2">
          {/* Command Palette Trigger Button */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
            aria-label="Open Command Palette"
            className="
              flex
              items-center
              gap-1
              px-2.5
              py-1.5
              bg-[#e7e2d0]
              dark:bg-[#1f212a]
              border-[1.5px]
              border-black
              dark:border-[#2f3340]
              cursor-pointer
              hover:bg-black
              hover:text-[#e7e2d0]
              dark:hover:bg-[#2e3240]
              dark:hover:text-white
              transition-colors
              shadow-[1px_1px_0px_#000000]
              text-black
              dark:text-[#f3f4f6]
              font-mono
              text-[11px]
              font-black
            "
            title="Command Palette (⌘K)"
          >
            <span>⌘K</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Dark/Light Theme"
            className="
              flex
              items-center
              justify-center
              w-8
              h-8
              bg-[#e7e2d0]
              dark:bg-[#1f212a]
              border-[1.5px]
              border-black
              dark:border-[#2f3340]
              cursor-pointer
              hover:bg-black
              hover:text-[#e7e2d0]
              dark:hover:bg-[#2e3240]
              dark:hover:text-white
              transition-colors
              shadow-[1px_1px_0px_#000000]
              text-black
              dark:text-[#f3f4f6]
            "
            title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {isDark ? (
              <SunIcon className="w-4 h-4 text-white" />
            ) : (
              <MoonIcon className="w-4 h-4 text-black" />
            )}
          </button>

          {/* Language Dropdown */}
          <LanguageDropdown
            language={language}
            isOpen={isLangOpen}
            onToggle={onToggleLang}
            onSelect={onSelectLang}
            onClose={onCloseLang}
          />
        </li>
      </ul>
    </nav>
  );
}
