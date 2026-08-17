'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/hooks/useLanguage';

interface MarioCelebrationModalProps {
  isOpen: boolean;
  stage: number; // 1 to 6
  onClose: () => void;
}

export default function MarioCelebrationModal({
  isOpen,
  stage,
  onClose,
}: MarioCelebrationModalProps) {
  const { isEnglish } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;

    // Multi-Angle Confetti Burst
    const count = 160;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 999999,
    };

    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    };

    const themeColors =
      stage >= 5
        ? ['#ec4899', '#8b5cf6', '#38bdf8', '#10b981', '#ffffff']
        : ['#e11d48', '#2563eb', '#38bdf8', '#8b5cf6', '#ffffff'];

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: themeColors,
    });

    fire(0.2, {
      spread: 60,
      colors: themeColors,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: themeColors,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: themeColors,
    });

    // Fireworks Cannon for strictly 2 seconds
    const duration = 2000;
    const animationEnd = Date.now() + duration;

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        confetti.reset();
        return;
      }

      const particleCount = 28 * (timeLeft / duration);

      // Left cannon
      confetti({
        particleCount,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        zIndex: 999999,
        colors: themeColors,
      });

      // Right cannon
      confetti({
        particleCount,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        zIndex: 999999,
        colors: themeColors,
      });
    }, 200);

    return () => {
      clearInterval(interval);
      confetti.reset();
    };
  }, [isOpen, stage]);

  const handleClose = () => {
    confetti.reset();
    onClose();
  };

  const stageTitles: Record<number, {
    badgeEn: string;
    badgeKr: string;
    titleEn: string;
    titleKr: string;
    descEn: string;
    descKr: string;
    btnEn: string;
    btnKr: string;
  }> = {
    1: {
      badgeEn: '★ STAGE 1 CLEAR (500 PTS) ★',
      badgeKr: '★ 1단계 클리어 (500점 달성) ★',
      titleEn: 'WALK UNLOCKED! 🚶‍♂️',
      titleKr: '걷기 모드 해금! 🚶‍♂️',
      descEn: '🪙 500 PTS REACHED! Stage 2 starts at 0/500 PTS with ground walking!',
      descKr: '🪙 500점 달성 완료! 2단계(0/500점)부터 마리오가 바닥을 걷기 시작합니다!',
      btnEn: 'START STAGE 2 (GROUND WALK) ➔',
      btnKr: '2단계 시작하기 (바닥 걷기) ➔',
    },
    2: {
      badgeEn: '★★ STAGE 2 CLEAR (500 PTS) ★★',
      badgeKr: '★★ 2단계 클리어 (500점 달성) ★★',
      titleEn: 'FULL-SCREEN ROAM UNLOCKED! 🌐',
      titleKr: '2D 전체 화면 탐색 해금! 🌐',
      descEn: '🪙 500 PTS REACHED! In Stage 3, Mario can now roam freely across the entire 2D screen!',
      descKr: '🪙 500점 달성 완료! 3단계부터 마리오가 바닥을 벗어나 화면 전체를 자유롭게 누빕니다!',
      btnEn: 'START STAGE 3 (2D ROAM) ➔',
      btnKr: '3단계 시작하기 (전체 화면 탐색) ➔',
    },
    3: {
      badgeEn: '★★★ STAGE 3 CLEAR (500 PTS) ★★★',
      badgeKr: '★★★ 3단계 클리어 (500점 달성) ★★★',
      titleEn: 'FIRE DASH UNLOCKED! 🔥',
      titleKr: '파이어 대시 해금! 🔥',
      descEn: '🪙 500 PTS REACHED! In Stage 4, Mario dashes rapidly with high agility!',
      descKr: '🪙 500점 달성 완료! 4단계에서는 마리오가 빠른 속도로 대각선 대시를 시작합니다!',
      btnEn: 'START STAGE 4 (FIRE DASH) ➔',
      btnKr: '4단계 시작하기 (파이어 대시) ➔',
    },
    4: {
      badgeEn: '★★★★ STAGE 4 CLEAR (500 PTS) ★★★★',
      badgeKr: '★★★★ 4단계 클리어 (500점 달성) ★★★★',
      titleEn: 'FLYING CAPE UNLOCKED! 🪂',
      titleKr: '비행 망토 모드 해금! 🪂',
      descEn: '🪙 500 PTS REACHED! In Stage 5, Mario swoops and glides through the air!',
      descKr: '🪙 500점 달성 완료! 5단계에서는 마리오가 공중을 자유자재로 비행합니다!',
      btnEn: 'START STAGE 5 (AERIAL GLIDE) ➔',
      btnKr: '5단계 시작하기 (공중 비행) ➔',
    },
    5: {
      badgeEn: '★★★★★ STAGE 5 CLEAR (500 PTS) ★★★★★',
      badgeKr: '★★★★★ 5단계 클리어 (500점 달성) ★★★★★',
      titleEn: 'ULTRA STAR UNLOCKED! ⭐',
      titleKr: '울트라 스타 모드 해금! ⭐',
      descEn: '🪙 500 PTS REACHED! Welcome to the Final Stage 6 with extreme lightning speed!',
      descKr: '🪙 500점 달성 완료! 최종 6단계에서는 초광속 스피드와 스타 오라가 발동합니다!',
      btnEn: 'START FINAL STAGE 6 (ULTRA STAR) ➔',
      btnKr: '최종 6단계 시작하기 (초광속 스타) ➔',
    },
    6: {
      badgeEn: '👑 ALL 6 STAGES MASTERED 👑',
      badgeKr: '👑 6단계 전 과정 올클리어 👑',
      titleEn: 'ULTIMATE MASTER CLEAR! 👑🎉',
      titleKr: '궁극의 마스터 올클리어! 👑🎉',
      descEn: '🪙 500 PTS REACHED! You completely conquered all 6 stages of Younggeun’s portfolio!',
      descKr: '🪙 500점 최종 달성! 영근의 포트폴리오 6단계를 모두 완벽하게 정복하셨습니다!',
      btnEn: 'PLAY AGAIN (STAGE 1) ➔',
      btnKr: '처음부터 다시 플레이 ➔',
    },
  };

  const currentInfo = stageTitles[stage] || stageTitles[1];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
            fixed
            inset-0
            z-[999999]
            bg-black/60
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
            cursor-pointer
          "
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.5, y: 50, rotate: -3 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 18, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            className="
              relative
              w-full
              max-w-md
              bg-[#e7e2d0]
              dark:bg-[#16171e]
              border-4
              border-black
              dark:border-[#272a34]
              p-6
              sm:p-8
              text-center
              shadow-[10px_10px_0px_#000000]
              flex
              flex-col
              items-center
              gap-4
              select-none
            "
          >
            {/* Stage Badge */}
            <div className="bg-black dark:bg-[#1f212a] text-[#e7e2d0] dark:text-cyan-300 border-2 border-black dark:border-cyan-400/40 px-4 py-1 font-mono font-black text-xs uppercase tracking-widest animate-pulse">
              {isEnglish ? currentInfo.badgeEn : currentInfo.badgeKr}
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-[#f3f4f6] m-0 leading-tight">
              {isEnglish ? currentInfo.titleEn : currentInfo.titleKr}
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm font-extrabold text-neutral-800 dark:text-[#d1d5db] font-mono leading-relaxed m-0">
              {isEnglish ? currentInfo.descEn : currentInfo.descKr}
            </p>

            {/* Next Stage / Replay Button */}
            <button
              type="button"
              onClick={handleClose}
              className="
                mt-2
                w-full
                sm:w-auto
                px-8
                py-3
                bg-black
                dark:bg-white
                text-[#e7e2d0]
                dark:text-black
                border-2
                border-black
                dark:border-white
                font-mono
                font-black
                text-sm
                uppercase
                tracking-wider
                shadow-[4px_4px_0px_#000000]
                hover:bg-neutral-800
                dark:hover:bg-neutral-200
                active:translate-x-0.5
                active:translate-y-0.5
                active:shadow-none
                transition-all
                cursor-pointer
              "
            >
              {isEnglish ? currentInfo.btnEn : currentInfo.btnKr}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
