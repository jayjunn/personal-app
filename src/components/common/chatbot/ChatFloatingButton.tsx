'use client';

import React from 'react';
import { AiSparkleIcon } from '@/components/icons';

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
      {/* 1. Deep Radiant Supernova Aura (Cyan / Electric Violet / Pure Ice) */}
      <div
        className="
          absolute
          -inset-4
          rounded-full
          bg-gradient-to-r
          from-cyan-500
          via-blue-600
          to-fuchsia-600
          blur-2xl
          opacity-70
          dark:opacity-90
          animate-pulse
          pointer-events-none
        "
      />

      {/* 2. Expanding Cosmic Ripple Wave */}
      <div
        className="
          absolute
          -inset-3
          rounded-full
          border-2
          border-cyan-400/60
          dark:border-cyan-300/80
          animate-ping
          pointer-events-none
        "
        style={{ animationDuration: '3s' }}
      />

      <button
        onClick={onToggle}
        className="
          relative
          w-16
          h-16
          rounded-full
          flex
          items-center
          justify-center
          transition-all
          duration-300
          hover:scale-115
          active:scale-95
          group
          cursor-pointer
        "
        aria-label="Open AI Assistant"
      >
        {/* 3. Fast Rotating Chromatic Conic Ring (Cyan / Blue / Violet / Magenta) */}
        <span
          className="
            absolute
            -inset-1.5
            rounded-full
            bg-[conic-gradient(from_0deg,#06b6d4,#3b82f6,#8b5cf6,#d946ef,#06b6d4)]
            blur-[3px]
            animate-[spin_3s_linear_infinite]
            opacity-90
            group-hover:opacity-100
            group-hover:blur-[5px]
            transition-all
          "
        />

        {/* 4. Sharp High-Contrast Ring Border */}
        <span
          className="
            absolute
            -inset-0.5
            rounded-full
            bg-gradient-to-tr
            from-cyan-400
            via-blue-400
            to-fuchsia-400
            animate-[spin_6s_linear_infinite_reverse]
          "
        />

        {/* 5. Main AI Core Orb */}
        <span
          className="
            relative
            w-14
            h-14
            rounded-full
            bg-[#0d0e12]
            flex
            items-center
            justify-center
            overflow-hidden
            border-2
            border-white/80
            shadow-[0_0_20px_rgba(6,182,212,0.8),0_0_40px_rgba(139,92,246,0.6),inset_0_0_15px_rgba(255,255,255,0.3)]
            group-hover:shadow-[0_0_30px_rgba(6,182,212,1),0_0_60px_rgba(139,92,246,0.9),inset_0_0_20px_rgba(255,255,255,0.6)]
            transition-all
            duration-300
          "
        >
          {/* Inner pulsating cosmic core */}
          <span
            className="
              absolute
              w-10
              h-10
              rounded-full
              bg-gradient-to-br
              from-cyan-300
              via-blue-400
              to-fuchsia-500
              blur-md
              opacity-85
              group-hover:opacity-100
              animate-pulse
            "
          />

          {/* AI Sparkle Icon with Bold Dramatic Glow */}
          <AiSparkleIcon
            className="
              w-7
              h-7
              relative
              z-10
              text-white
              drop-shadow-[0_0_10px_#ffffff]
              drop-shadow-[0_0_18px_#38bdf8]
              drop-shadow-[0_0_28px_#818cf8]
              transition-transform
              duration-300
              group-hover:scale-120
              group-hover:rotate-12
            "
          />
        </span>

        {/* 6. Online Status Glow Dot */}
        <span
          className="
            absolute
            top-0
            right-0
            w-4
            h-4
            bg-emerald-400
            rounded-full
            border-2
            border-black
            shadow-[0_0_10px_#34d399,0_0_20px_#10b981]
            animate-pulse
          "
        />

        {/* 7. Tooltip Badge */}
        <span
          className="
            absolute
            -top-7
            right-0
            bg-[#e7e2d0]
            dark:bg-[#16171e]
            text-black
            dark:text-cyan-300
            border-2
            border-black
            dark:border-cyan-400/40
            text-[9px]
            font-mono
            font-black
            px-2
            py-0.5
            shadow-[2px_2px_0px_#000000]
            whitespace-nowrap
            pointer-events-none
            transition-transform
            group-hover:-translate-y-1
          "
        >
          ✨ AI ASSISTANT
        </span>
      </button>
    </div>
  );
}
