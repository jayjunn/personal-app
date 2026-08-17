'use client';

import React from 'react';

interface MarioControlsProps {
  isActive: boolean;
  score: number;
  stage: number;
  isEnglish: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}

export default function MarioControls({
  isActive,
  score,
  stage,
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
          dark:bg-[#16171e]
          text-[#e7e2d0]
          dark:text-[#f3f4f6]
          border-2
          border-black
          dark:border-[#2f3340]
          px-3.5
          py-2
          font-mono
          text-xs
          font-extrabold
          shadow-[3px_3px_0px_#000000]
          cursor-pointer
          hover:bg-neutral-800
          dark:hover:bg-[#252834]
          transition-colors
        "
      >
        🎮 {isEnglish ? 'Summon (Mario ON)' : '소환하기 (Mario ON)'}
      </button>
    );
  }

  const stageLabels: Record<number, string> = {
    1: isEnglish ? 'STAGE 1/6 (IDLE)' : '1/6단계 (대기)',
    2: isEnglish ? 'STAGE 2/6 (WALK)' : '2/6단계 (바닥)',
    3: isEnglish ? 'STAGE 3/6 (2D ROAM)' : '3/6단계 (전체화면)',
    4: isEnglish ? 'STAGE 4/6 (FIRE DASH)' : '4/6단계 (파이어)',
    5: isEnglish ? 'STAGE 5/6 (CAPE GLIDE)' : '5/6단계 (공중비행)',
    6: isEnglish ? 'STAGE 6/6 (ULTRA STAR)' : '6/6단계 (초광속)',
  };

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
        dark:bg-[#16171e]
        border-2
        border-black
        dark:border-[#2f3340]
        px-2.5
        py-1
        shadow-[2px_2px_0px_#000000]
        font-mono
        text-xs
        font-extrabold
        text-black
        dark:text-[#f3f4f6]
        pointer-events-auto
        select-none
      "
    >
      <span className="text-[10px] bg-black dark:bg-white text-white dark:text-black px-1.5 py-0.5 font-bold">
        {stageLabels[stage] || `STAGE ${stage}/6`}
      </span>
      <span>🪙 {score}/500 PTS</span>
      <button
        type="button"
        onClick={onDeactivate}
        className="
          ml-1
          px-1.5
          py-0.5
          bg-black
          dark:bg-[#252834]
          text-[#e7e2d0]
          dark:text-[#f3f4f6]
          hover:bg-neutral-800
          dark:hover:bg-[#323644]
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
