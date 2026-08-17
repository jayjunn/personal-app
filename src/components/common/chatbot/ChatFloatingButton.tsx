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
    <div className="fixed bottom-20 right-6 z-[8000] select-none">
      {/* 1. Deep Midnight Violet Ambient Aura (구체 바깥으로 은은하게 퍼지는 심해 오라) */}
      <motion.div
        animate={{
          scale: [1, 1.22, 1],
          opacity: [0.55, 0.85, 0.55],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="
          absolute
          -inset-3.5
          rounded-full
          bg-[radial-gradient(circle,rgba(129,140,248,0.55)_0%,rgba(192,132,252,0.35)_40%,rgba(6,182,212,0.25)_70%,transparent_85%)]
          blur-xl
          pointer-events-none
        "
      />

      <button
        onClick={onToggle}
        className="
          relative
          w-14
          h-14
          rounded-full
          flex
          items-center
          justify-center
          transition-transform
          duration-300
          hover:scale-112
          active:scale-95
          group
          cursor-pointer
        "
        aria-label="Open AI Assistant"
      >
        {/* 2. Pure 3D Crystal Glass Sphere (레퍼런스와 일치하는 순수 글래스 구체) */}
        <div
          className="
            relative
            w-full
            h-full
            rounded-full
            bg-[#080914]/95
            overflow-hidden
            border
            border-white/40
            shadow-[0_6px_28px_rgba(0,0,0,0.85),inset_0_1.5px_4px_rgba(255,255,255,0.75),inset_0_-2px_8px_rgba(0,0,0,0.7)]
            flex
            items-center
            justify-center
          "
        >
          {/* Top Glass Specular Reflection Arc Highlight */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-9 h-4 bg-gradient-to-b from-white/50 to-transparent rounded-full blur-[1px] pointer-events-none z-20" />

          {/* Bottom Rim Light Reflection */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-4 bg-cyan-400/30 rounded-full blur-[3px] pointer-events-none z-20" />

          {/* 3. Fluid Aurora Ribbon 1: Magenta / Rose Wave */}
          <motion.div
            animate={{
              scale: [1, 1.25, 0.9, 1],
              rotate: [0, 180, 360],
              x: [-4, 5, -2, -4],
              y: [-5, 3, -6, -5],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="
              absolute
              w-12
              h-11
              rounded-[40%_60%_70%_30%/40%_50%_60%_50%]
              bg-gradient-to-tr
              from-[#ec4899]
              via-[#f43f5e]
              to-[#c084fc]
              opacity-85
              blur-[6px]
              mix-blend-screen
              pointer-events-none
            "
          />

          {/* 4. Fluid Aurora Ribbon 2: Electric Cyan / Sky Blue Wave */}
          <motion.div
            animate={{
              scale: [1.1, 0.85, 1.2, 1.1],
              rotate: [360, 180, 0],
              x: [5, -4, 4, 5],
              y: [4, -5, 2, 4],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.4,
            }}
            className="
              absolute
              w-12
              h-11
              rounded-[60%_40%_30%_70%/60%_30%_70%_40%]
              bg-gradient-to-br
              from-[#06b6d4]
              via-[#38bdf8]
              to-[#818cf8]
              opacity-90
              blur-[6px]
              mix-blend-screen
              pointer-events-none
            "
          />

          {/* 5. Fluid Aurora Core: Pure Luminous Light Heart */}
          <motion.div
            animate={{
              scale: [0.9, 1.35, 0.85, 0.9],
              rotate: [0, -120, -240, -360],
              opacity: [0.75, 1, 0.65, 0.75],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="
              absolute
              w-9
              h-9
              rounded-full
              bg-gradient-to-r
              from-white
              via-[#e0e7ff]
              to-[#c4b5fd]
              blur-[5px]
              mix-blend-overlay
              pointer-events-none
            "
          />
        </div>

        {/* 6. Tooltip Badge */}
        <span
          className="
            absolute
            -top-6
            right-0
            bg-[#e7e2d0]
            dark:bg-[#1f212a]
            text-black
            dark:text-[#f3f4f6]
            border
            border-black
            dark:border-[#2f3340]
            text-[9px]
            font-mono
            font-bold
            px-2
            py-0.5
            shadow-[1px_1px_0px_#000000]
            whitespace-nowrap
            pointer-events-none
            opacity-0
            group-hover:opacity-100
            transition-opacity
            duration-200
            z-30
          "
        >
          AI ASSISTANT
        </span>
      </button>
    </div>
  );
}
