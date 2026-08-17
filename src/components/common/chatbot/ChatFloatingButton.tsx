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
    <div className="fixed bottom-20 right-6 z-[8000]">
      {/* Outer breathing glow */}
      <div
        className="
          absolute
          inset-[-12px]
          rounded-full
          bg-white/20
          blur-2xl
          animate-pulse
        "
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
          duration-500
          hover:scale-110
          active:scale-95
          group
        "
        aria-label="Open Chatbot"
      >
        {/* Outer glow */}
        <span
          className="
            absolute
            inset-[-10px]
            rounded-full
            bg-gradient-to-r
            from-cyan-300/0
            via-white/40
            to-purple-300/0
            blur-xl
            opacity-80
            animate-pulse
          "
        />

        {/* Rotating aura */}
        <span
          className="
            absolute
            inset-[-4px]
            rounded-full
            bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.9),rgba(150,200,255,0.8),transparent)]
            blur-[2px]
            animate-[spin_4s_linear_infinite]
          "
        />

        {/* Main AI orb */}
        <span
          className="
            relative
            w-14
            h-14
            rounded-full
            bg-black
            flex
            items-center
            justify-center
            overflow-hidden
            border
            border-white/40
            shadow-[0_0_15px_rgba(255,255,255,0.5),0_0_40px_rgba(120,180,255,0.25)]
          "
        >
          {/* Inner light */}
          <span
            className="
              absolute
              w-8
              h-8
              rounded-full
              bg-gradient-to-br
              from-white
              via-cyan-200
              to-purple-400
              blur-md
              opacity-80
              animate-pulse
            "
          />

          <AiSparkleIcon
            className="
              w-7
              h-7
              relative
              z-10
              text-white
              drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]
              transition-transform
              duration-500
              group-hover:rotate-12
            "
          />
        </span>

        {/* Status indicator */}
        <span
          className="
            absolute
            top-1
            right-1
            w-3.5
            h-3.5
            bg-emerald-400
            rounded-full
            border-2
            border-black
            shadow-[0_0_8px_#34d399]
          "
        />

        {/* Tooltip Badge */}
        <span
          className="
            absolute
            -top-7
            right-0
            bg-[#e7e2d0]
            text-black
            border
            border-black
            text-[9px]
            font-mono
            font-black
            px-2
            py-0.5
            shadow-[2px_2px_0px_#000000]
            whitespace-nowrap
            pointer-events-none
          "
        >
          AI ASSISTANT
        </span>
      </button>
    </div>
  );
}
