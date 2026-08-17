'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export default function TypewriterText({
  text,
  typeSpeed = 85,
  deleteSpeed = 40,
  pauseDuration = 2600,
  className = '',
}: TypewriterTextProps) {
  const [charCount, setCharCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isDeleting && charCount < text.length) {
      // 1. Typing forward character by character
      timer = setTimeout(() => {
        setCharCount((prev) => prev + 1);
      }, typeSpeed);
    } else if (!isDeleting && charCount === text.length) {
      // 2. Finished typing: Pause so the visitor can read
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && charCount > 0) {
      // 3. Deleting backward smoothly
      timer = setTimeout(() => {
        setCharCount((prev) => prev - 1);
      }, deleteSpeed);
    } else if (isDeleting && charCount === 0) {
      // 4. Fully deleted: Brief pause before restarting loop
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, 500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [charCount, isDeleting, text, typeSpeed, deleteSpeed, pauseDuration]);

  const displayedText = text.slice(0, charCount);

  return (
    <span className={className}>
      {displayedText}
      <span
        className="inline-block ml-1 font-mono font-normal text-black dark:text-[#ded8c4] animate-pulse"
      >
        |
      </span>
    </span>
  );
}
