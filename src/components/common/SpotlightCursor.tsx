'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';

export default function SpotlightCursor() {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 450, mass: 0.2 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable custom cursor for non-touch devices
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') !== null ||
          target.closest('a') !== null ||
          target.getAttribute('role') === 'button' ||
          target.classList.contains('cursor-pointer');
        setIsPointer(Boolean(isClickable));
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      {/* 1. Dark Mode Ambient Spotlight Glow (Subtle Warm Ivory glow) */}
      {isDark && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[1] transition-opacity duration-300"
          style={{
            background: `radial-gradient(550px circle at ${smoothX.get()}px ${smoothY.get()}px, rgba(231, 226, 208, 0.035), transparent 70%)`,
          }}
        />
      )}

      {/* 2. Magnetic Crosshair / Dot Follower */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[999990] hidden md:block"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            scale: isPointer ? 1.8 : 1,
            rotate: isPointer ? 45 : 0,
          }}
          transition={{ duration: 0.15 }}
          className={`
            w-4
            h-4
            border-2
            ${
              isDark
                ? 'border-[#ded8c4]/80 bg-[#ded8c4]/15 shadow-[0_0_8px_rgba(222,216,196,0.25)]'
                : 'border-black/70 bg-black/15'
            }
            transition-colors
          `}
        />
      </motion.div>
    </>
  );
}
