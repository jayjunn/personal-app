'use client';

import React from 'react';
import { useUserContext } from '@/context/userContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguageModal() {
  const { isLanguageModalOpen, setIsLanguageModalOpen, setLanguage, user } = useUserContext();

  if (!isLanguageModalOpen) return null;

  const handleSelect = (lang: 'ENGLISH' | 'KOREAN') => {
    setLanguage(lang);
    setIsLanguageModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div
        onClick={() => setIsLanguageModalOpen(false)}
        className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-5 backdrop-blur-[3px] cursor-pointer">
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-[#e7e2d0] border-4 border-black p-6 sm:p-8 w-full max-w-[520px] shadow-[8px_8px_0px_#000000] sm:shadow-[10px_10px_0px_#000000] flex flex-col gap-6 relative cursor-default">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b-[3px] border-black pb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-black inline-block" />
              <span className="w-3 h-3 rounded-full border-2 border-black bg-white inline-block" />
              <span className="text-[11px] font-mono font-extrabold uppercase ml-1.5">
                LANGUAGE SELECTION / 언어 설정
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(false)}
              className="cursor-pointer text-xl font-black leading-none hover:rotate-90 transition-transform"
              title="닫기">
              ✕
            </button>
          </div>

          {/* Title & Description */}
          <div className="text-center flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-black uppercase m-0 tracking-tight">
              SELECT LANGUAGE / 언어 선택
            </h2>
            <p className="text-xs sm:text-sm text-neutral-700 m-0 font-semibold">
              포트폴리오를 둘러보실 기본 언어를 선택해주세요.
            </p>
          </div>

          {/* Language Selection Buttons */}
          <div className="flex flex-col gap-3.5">
            {/* English Option */}
            <button
              type="button"
              onClick={() => handleSelect('ENGLISH')}
              className={`w-full p-4 sm:p-5 border-[3px] border-black flex items-center justify-between transition-all duration-150 shadow-[4px_4px_0px_#000000] cursor-pointer ${
                user.language === 'ENGLISH'
                  ? 'bg-black text-[#e7e2d0]'
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}>
              <div className="flex items-center gap-3.5 text-left">
                <span className="text-2xl sm:text-3xl">🇬🇧</span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-black uppercase">
                    ENGLISH
                  </span>
                  <span className="text-xs opacity-80 font-semibold">
                    Browse portfolio & resume in English
                  </span>
                </div>
              </div>
              <span className="text-lg font-black">➔</span>
            </button>

            {/* Korean Option */}
            <button
              type="button"
              onClick={() => handleSelect('KOREAN')}
              className={`w-full p-4 sm:p-5 border-[3px] border-black flex items-center justify-between transition-all duration-150 shadow-[4px_4px_0px_#000000] cursor-pointer ${
                user.language === 'KOREAN'
                  ? 'bg-black text-[#e7e2d0]'
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}>
              <div className="flex items-center gap-3.5 text-left">
                <span className="text-2xl sm:text-3xl">🇰🇷</span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-black uppercase">
                    한국어 (KOREAN)
                  </span>
                  <span className="text-xs opacity-80 font-semibold">
                    프로젝트 설명 및 이력서를 한국어로 보기
                  </span>
                </div>
              </div>
              <span className="text-lg font-black">➔</span>
            </button>
          </div>

          {/* Footer Note */}
          <div className="border-t-2 border-black/20 pt-3.5 text-center">
            <p className="text-[11px] text-neutral-600 font-mono m-0">
              * 선택한 언어는 상단 네비게이션의 🌐 지구본 아이콘으로 언제든지 변경할 수 있습니다.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
