'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/hooks/useLanguage';

interface MarioCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MarioCelebrationModal({
  isOpen,
  onClose,
}: MarioCelebrationModalProps) {
  const { isEnglish } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;

    // 1. Initial Multi-Angle Confetti Burst
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

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#e11d48', '#2563eb', '#fbbf24', '#ffffff'],
    });

    fire(0.2, {
      spread: 60,
      colors: ['#e11d48', '#2563eb', '#fbbf24', '#000000'],
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#fbbf24', '#ffffff', '#e11d48'],
    });

    // 2. Fireworks Cannon for strictly 2 seconds
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
        colors: ['#e11d48', '#2563eb', '#fcd34d', '#ffffff'],
      });

      // Right cannon
      confetti({
        particleCount,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        zIndex: 999999,
        colors: ['#e11d48', '#2563eb', '#fcd34d', '#ffffff'],
      });
    }, 200);

    return () => {
      clearInterval(interval);
      confetti.reset();
    };
  }, [isOpen]);

  const handleClose = () => {
    confetti.reset();
    onClose();
  };

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
              border-4
              border-black
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
            {/* Badge */}
            <div className="bg-black text-[#e7e2d0] border-2 border-black px-4 py-1 font-mono font-black text-xs uppercase tracking-widest animate-pulse">
              {isEnglish ? '★ STAGE CLEAR ★' : '★ 스테이지 클리어 ★'}
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black m-0 leading-tight">
              {isEnglish ? 'CONGRATULATIONS!' : '축하합니다!'}
            </h2>

            {/* Score Callout */}
            <div className="bg-amber-300 border-[3px] border-black px-5 py-2 font-mono font-black text-lg sm:text-xl shadow-[3px_3px_0px_#000000] text-black">
              {isEnglish ? '🪙 500 PTS REACHED! 🌟' : '🪙 500점 달성! 🌟'}
            </div>

            <p className="text-xs sm:text-sm font-extrabold text-neutral-800 font-mono leading-relaxed m-0">
              {isEnglish ? (
                <>
                  YOU UNLOCKED THE SECRET BONUS!
                  <br />
                  THANK YOU FOR EXPLORING YOUNGGEUN’S PORTFOLIO!
                </>
              ) : (
                <>
                  시크릿 보너스를 달성하셨습니다!
                  <br />
                  영근의 포트폴리오를 둘러봐 주셔서 감사합니다!
                </>
              )}
            </p>

            {/* Continue / Reset button */}
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
                text-[#e7e2d0]
                border-2
                border-black
                font-mono
                font-black
                text-sm
                uppercase
                tracking-wider
                shadow-[4px_4px_0px_#000000]
                hover:bg-neutral-800
                active:translate-x-0.5
                active:translate-y-0.5
                active:shadow-none
                transition-all
                cursor-pointer
              "
            >
              {isEnglish ? 'PLAY AGAIN ➔' : '다시 플레이하기 ➔'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
