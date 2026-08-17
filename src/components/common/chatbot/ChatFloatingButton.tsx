'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ChatFloatingButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function ChatFloatingButton({
  isOpen,
  onToggle,
}: ChatFloatingButtonProps) {
  return (
    <div className="fixed bottom-[3.75rem] sm:bottom-[4.5rem] right-4 sm:right-6 z-[9995] select-none">
      <motion.button
        type="button"
        onClick={onToggle}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        className={`
          flex
          items-center
          gap-2.5
          px-4
          py-2.5
          border-[2.5px]
          border-black
          dark:border-[#272a34]
          transition-all
          duration-150
          cursor-pointer
          shadow-[4px_4px_0px_#000000]
          dark:shadow-[4px_4px_0px_#000000]
          hover:shadow-[6px_6px_0px_#000000]
          hover:-translate-x-0.5
          hover:-translate-y-0.5
          active:translate-x-1
          active:translate-y-1
          active:shadow-[1px_1px_0px_#000000]
          ${
            isOpen
              ? 'bg-black text-[#e7e2d0] dark:bg-[#f3f4f6] dark:text-black dark:border-white'
              : 'bg-[#e7e2d0] text-black dark:bg-[#16171e] dark:text-[#f3f4f6]'
          }
        `}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
      >
        {/* 3D Fluid Aurora Orb Icon (초고화질 멀티레이어 오로라 구체) */}
        <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 border border-white/80 shadow-[0_0_12px_rgba(168,85,247,0.9),0_0_4px_rgba(6,182,212,0.8)] bg-[#080914] flex items-center justify-center">
          {/* Layer 1: Magenta / Rose Aurora Ribbon */}
          <motion.div
            animate={{
              scale: [1, 1.35, 0.9, 1],
              rotate: [0, 180, 360],
              x: [-2, 3, -1, -2],
              y: [-2, 2, -3, -2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="
              absolute
              w-4
              h-4
              rounded-[40%_60%_70%_30%/40%_50%_60%_50%]
              bg-gradient-to-tr
              from-[#ec4899]
              via-[#f43f5e]
              to-[#c084fc]
              opacity-95
              blur-[1px]
              mix-blend-screen
              pointer-events-none
            "
          />

          {/* Layer 2: Electric Cyan / Sky Blue Aurora Ribbon */}
          <motion.div
            animate={{
              scale: [1.15, 0.85, 1.25, 1.15],
              rotate: [360, 180, 0],
              x: [2, -2, 2, 2],
              y: [2, -2, 1, 2],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.2,
            }}
            className="
              absolute
              w-4
              h-4
              rounded-[60%_40%_30%_70%/60%_30%_70%_40%]
              bg-gradient-to-br
              from-[#06b6d4]
              via-[#38bdf8]
              to-[#818cf8]
              opacity-95
              blur-[1px]
              mix-blend-screen
              pointer-events-none
            "
          />

          {/* Layer 3: Luminous Core Heart */}
          <motion.div
            animate={{
              scale: [0.8, 1.4, 0.8],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="
              absolute
              w-2.5
              h-2.5
              rounded-full
              bg-gradient-to-r
              from-white
              to-[#e0e7ff]
              blur-[0.8px]
              mix-blend-overlay
              pointer-events-none
            "
          />

          {/* Top Glass Specular Arc Reflection */}
          <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-3 h-1 bg-gradient-to-b from-white/90 to-transparent rounded-full blur-[0.3px] z-20 pointer-events-none" />

          {/* Bottom Rim Light Reflection */}
          <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-1 bg-cyan-400/60 rounded-full blur-[0.5px] z-20 pointer-events-none" />
        </div>

        {/* Typographic Label */}
        <span className="font-mono text-xs font-black uppercase tracking-wider">
          {isOpen ? 'CLOSE AI' : 'AI ASSISTANT'}
        </span>
      </motion.button>
    </div>
  );
}
