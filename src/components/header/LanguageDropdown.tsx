'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobeIcon } from '@/components/icons';

interface LanguageDropdownProps {
  language: 'ENGLISH' | 'KOREAN';
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (lang: 'ENGLISH' | 'KOREAN') => void;
  onClose: () => void;
}

export default function LanguageDropdown({
  language,
  isOpen,
  onToggle,
  onSelect,
  onClose,
}: LanguageDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={containerRef} className="relative flex items-center">
      <button
        type="button"
        onClick={onToggle}
        aria-label="Toggle Language"
        className="
          flex
          items-center
          justify-center
          gap-1.5
          h-8
          px-3
          bg-[#e7e2d0]
          dark:bg-[#1f212a]
          border-2
          border-black
          dark:border-[#2f3340]
          cursor-pointer
          hover:bg-black
          hover:text-[#e7e2d0]
          dark:hover:bg-[#2e3240]
          dark:hover:text-white
          transition-all
          shadow-[2px_2px_0px_#000000]
          active:translate-x-0.5
          active:translate-y-0.5
          active:shadow-none
          text-black
          dark:text-[#f3f4f6]
        "
      >
        <GlobeIcon className="w-4 h-4 stroke-current" />
        <span className="text-xs font-black font-mono">
          {language === 'ENGLISH' ? 'EN' : 'KR'}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            transition={{ duration: 0.15 }}
            className="
              absolute
              top-[calc(100%+8px)]
              right-0
              bg-[#e7e2d0]
              dark:bg-[#1a1c24]
              border-[3px]
              border-black
              dark:border-[#2f3340]
              shadow-[4px_4px_0px_#000000]
              p-2.5
              min-w-[145px]
              z-[100]
              flex
              flex-col
              gap-1.5
              list-none
              m-0
            "
          >
            <li
              onClick={() => onSelect('ENGLISH')}
              className={`
                px-3
                py-1.5
                text-xs
                font-extrabold
                cursor-pointer
                flex
                items-center
                gap-2
                ${
                  language === 'ENGLISH'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-black dark:text-[#f3f4f6] hover:bg-black hover:text-white dark:hover:bg-[#252834] dark:hover:text-white'
                }
              `}
            >
              <span>🇬🇧</span>
              <span>English {language === 'ENGLISH' && '✓'}</span>
            </li>

            <li
              onClick={() => onSelect('KOREAN')}
              className={`
                px-3
                py-1.5
                text-xs
                font-extrabold
                cursor-pointer
                flex
                items-center
                gap-2
                ${
                  language === 'KOREAN'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-black dark:text-[#f3f4f6] hover:bg-black hover:text-white dark:hover:bg-[#252834] dark:hover:text-white'
                }
              `}
            >
              <span>🇰🇷</span>
              <span>한국어 {language === 'KOREAN' && '✓'}</span>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
