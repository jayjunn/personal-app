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
    <div className="fixed bottom-6 right-4 sm:right-6 z-[9995] select-none">
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
        {/* Fluid Aurora Orb Icon (정교하고 신비로운 오로라 구체 아이콘) */}
        <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0 border border-white/70 shadow-[0_0_10px_rgba(168,85,247,0.7)] bg-[#090a16] flex items-center justify-center">
          {/* Swirling Aurora Waves */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.25, 0.95, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="
              absolute
              -inset-1
              rounded-full
              bg-[conic-gradient(from_0deg,#ec4899_0%,#a855f7_35%,#06b6d4_70%,#ec4899_100%)]
              blur-[2px]
            "
          />

          {/* Glass Specular Reflection Highlight */}
          <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-2.5 h-1 bg-white/70 rounded-full blur-[0.3px] z-10 pointer-events-none" />
        </div>

        {/* Typographic Label */}
        <span className="font-mono text-xs font-black uppercase tracking-wider">
          {isOpen ? 'CLOSE AI' : 'AI ASSISTANT'}
        </span>
      </motion.button>
    </div>
  );
}
