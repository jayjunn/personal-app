'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LIST } from './navData';
import LanguageDropdown from './LanguageDropdown';

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

  return (
    <nav className="hidden md:block w-full mt-4 sm:mt-5 px-4 sm:px-8 pb-2">
      <ul
        className="
          w-full
          bg-[#e7e2d0]
          border-[3px]
          border-black
          px-4
          sm:px-6
          py-3.5
          flex
          items-center
          justify-between
          gap-3
          box-border
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
                      hover:bg-black
                      hover:text-white
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
                          ? 'bg-black text-white'
                          : 'text-black hover:bg-black hover:text-white'
                      }
                    `}
                  >
                    {item.title}
                  </Link>
                )}
              </li>

              {index + 1 !== NAV_LIST.length && (
                <li className="text-black/30 font-light select-none">|</li>
              )}
            </React.Fragment>
          );
        })}

        {/* Language Dropdown */}
        <LanguageDropdown
          language={language}
          isOpen={isLangOpen}
          onToggle={onToggleLang}
          onSelect={onSelectLang}
          onClose={onCloseLang}
        />
      </ul>
    </nav>
  );
}
