'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TechStackFilterProps {
  stacks: string[];
  selectedStack: string;
  onSelectStack: (stack: string) => void;
  counts?: Record<string, number>;
}

export default function TechStackFilter({
  stacks,
  selectedStack,
  onSelectStack,
  counts,
}: TechStackFilterProps) {
  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto py-2 scrollbar-none select-none">
      {stacks.map((stack) => {
        const isSelected = selectedStack.toUpperCase() === stack.toUpperCase();
        const count = counts ? counts[stack] : undefined;

        return (
          <button
            key={`filter-stack-${stack}`}
            type="button"
            onClick={() => onSelectStack(stack)}
            className={`
              relative
              px-3.5
              py-1.5
              text-xs
              font-mono
              font-black
              uppercase
              tracking-wide
              whitespace-nowrap
              border-2
              border-black
              dark:border-[#2f3340]
              transition-all
              duration-150
              cursor-pointer
              ${
                isSelected
                  ? 'bg-black text-[#e7e2d0] dark:bg-white dark:text-black dark:border-white shadow-[3px_3px_0px_#000000] -translate-x-0.5 -translate-y-0.5'
                  : 'bg-[#e7e2d0] text-black dark:bg-[#16171e] dark:text-[#d1d5db] hover:bg-[#dcd6c0] dark:hover:bg-[#252834] dark:hover:text-white shadow-[2px_2px_0px_#000000]'
              }
            `}
          >
            {isSelected && (
              <motion.span
                layoutId="activeFilterIndicator"
                className="absolute inset-0 border-2 border-black dark:border-white pointer-events-none"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span>{stack}</span>
              {typeof count === 'number' && (
                <span
                  className={`
                    text-[10px]
                    px-1.5
                    py-0.2
                    rounded-full
                    font-mono
                    ${
                      isSelected
                        ? 'bg-[#e7e2d0] text-black dark:bg-black dark:text-white'
                        : 'bg-black/10 dark:bg-white/10 text-black dark:text-[#d1d5db]'
                    }
                  `}
                >
                  {count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
