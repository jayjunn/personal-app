'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LIST } from './navData';

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
            text-black
            flex
            flex-col
            overflow-hidden
            overscroll-none
            border-b-[3px]
            border-black
          "
        >
          {/* Top Bar */}
          <div
            className="
              w-full
              flex
              items-center
              justify-between
              px-6
              sm:px-8
              pt-6
              pb-4
              border-b-[3px]
              border-black
              bg-[#e7e2d0]
              shrink-0
            "
          >
            <div className="flex flex-col">
              <span
                className="text-lg sm:text-xl font-black uppercase tracking-tight"
              >
                {profileName}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-600 font-mono">
                NAVIGATION DIRECTORY
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Navigation Menu"
              className="
                flex
                items-center
                justify-center
                gap-1.5
                px-3
                py-1.5
                bg-[#e7e2d0]
                border-2
                border-black
                font-mono
                text-xs
                font-black
                uppercase
                shadow-[2px_2px_0px_#000000]
                active:translate-x-0.5
                active:translate-y-0.5
                active:shadow-none
                hover:bg-black
                hover:text-white
                transition-all
              "
            >
              <span>✕</span>
              <span>CLOSE</span>
            </button>
          </div>

          {/* Nav List */}
          <div
            className="
              flex-1
              min-h-0
              flex
              flex-col
              items-center
              justify-center
              w-full
              px-6
              sm:px-8
              overflow-hidden
            "
          >
            <div className="w-full max-w-sm">
              {NAV_LIST.map((item, index) => {
                const isActive = !item.isExternal && pathname === item.link;

                return (
                  <motion.div
                    key={`mobile-${item.title}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.04 + 0.06,
                      duration: 0.2,
                    }}
                    className="
                      w-full
                      border-b
                      border-black/20
                      py-3
                      flex
                      items-center
                      justify-center
                    "
                  >
                    {item.isExternal ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        className="
                          flex
                          items-center
                          justify-center
                          gap-2
                          text-2xl
                          sm:text-3xl
                          font-black
                          uppercase
                          tracking-tight
                          text-black
                          active:scale-95
                          transition-transform
                        "
                      >
                        <span className="font-mono text-xs font-bold text-neutral-500">
                          0{index + 1}.
                        </span>
                        <span>{item.title}</span>
                        <span className="text-lg font-mono">↗</span>
                      </a>
                    ) : (
                      <Link
                        href={item.link}
                        onClick={onClose}
                        className={`
                          flex
                          items-center
                          justify-center
                          gap-2
                          text-2xl
                          sm:text-3xl
                          font-black
                          uppercase
                          tracking-tight
                          text-black
                          active:scale-95
                          transition-transform
                          ${
                            isActive
                              ? 'underline underline-offset-8 decoration-2'
                              : ''
                          }
                        `}
                      >
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
          </div>

          {/* Bottom Bar */}
          <div
            className="
              w-full
              flex
              flex-col
              items-center
              justify-center
              gap-3
              border-t-[3px]
              border-black
              pt-4
              pb-6
              px-6
              bg-[#e7e2d0]
              shrink-0
            "
          >
            <div
              className="
                flex
                items-center
                border-2
                border-black
                bg-[#e7e2d0]
                shadow-[2px_2px_0px_#000000]
              "
            >
              <button
                type="button"
                onClick={() => onSetLanguage('KOREAN')}
                className={`
                  px-3
                  py-1.5
                  text-[11px]
                  font-mono
                  font-black
                  ${
                    language === 'KOREAN'
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-[#d4ceb8]'
                  }
                `}
              >
                🇰🇷 한국어
              </button>

              <button
                type="button"
                onClick={() => onSetLanguage('ENGLISH')}
                className={`
                  px-3
                  py-1.5
                  text-[11px]
                  font-mono
                  font-black
                  ${
                    language === 'ENGLISH'
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-[#d4ceb8]'
                  }
                `}
              >
                🇬🇧 English
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 text-[10px] font-mono font-bold text-neutral-600">
              <span>© YOUNGGEUN JUN</span>
              <span>•</span>
              <Link
                href="/admin"
                onClick={onClose}
                className="underline hover:text-black"
              >
                ADMIN
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
