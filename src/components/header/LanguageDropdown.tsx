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
  const containerRef = useRef<HTMLLIElement>(null);

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
    <li ref={containerRef} className="relative flex items-center">
      <button
        type="button"
        onClick={onToggle}
        aria-label="Toggle Language"
        className="
          flex
          items-center
          gap-2
          px-3
          py-1.5
          bg-[#e7e2d0]
          border-[1.5px]
          border-black
          cursor-pointer
          hover:bg-black
          hover:text-[#e7e2d0]
          transition-colors
          shadow-[1px_1px_0px_#000000]
          text-black
        "
      >
        <GlobeIcon className="w-4 h-4 stroke-current" />
        <span className="text-[11px] font-black font-mono">
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
              border-[3px]
              border-black
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
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-black hover:text-white'
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
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-black hover:text-white'
                }
              `}
            >
              <span>🇰🇷</span>
              <span>한국어 {language === 'KOREAN' && '✓'}</span>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}
