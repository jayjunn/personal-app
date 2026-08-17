'use client';

import React from 'react';

interface MarioControlsProps {
  isActive: boolean;
  score: number;
  isEnglish: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}

export default function MarioControls({
  isActive,
  score,
  isEnglish,
  onActivate,
  onDeactivate,
}: MarioControlsProps) {
  if (!isActive) {
    return (
      <button
        type="button"
        onClick={onActivate}
        className="
          fixed
          bottom-6
          right-6
          z-[8000]
          bg-black
          text-[#e7e2d0]
          border-2
          border-black
          px-3.5
          py-2
          font-mono
          text-xs
          font-extrabold
          shadow-[3px_3px_0px_#000000]
          cursor-pointer
          hover:bg-neutral-800
          transition-colors
        "
      >
        🎮 {isEnglish ? 'Summon (Mario ON)' : '소환하기 (Mario ON)'}
      </button>
    );
  }

  return (
    <div
      className="
        fixed
        bottom-4
        right-4
        z-[8500]
        flex
        items-center
        gap-2
        bg-[#e7e2d0]
        border-2
        border-black
        px-2.5
        py-1
        shadow-[2px_2px_0px_#000000]
        font-mono
        text-xs
        font-extrabold
        pointer-events-auto
        select-none
      "
    >
      <span>🪙 {score} PTS</span>
      <button
        type="button"
        onClick={onDeactivate}
        className="
          ml-1
          px-1.5
          py-0.5
          bg-black
          text-[#e7e2d0]
          hover:bg-neutral-800
          transition-colors
          text-[10px]
          font-mono
          font-bold
          uppercase
          cursor-pointer
        "
        title={isEnglish ? 'Hide Character' : '캐릭터 숨기기'}
      >
        {isEnglish ? 'HIDE' : '숨기기'}
      </button>
    </div>
  );
}
