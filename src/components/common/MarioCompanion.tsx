'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import PixelMario from './mario/PixelMario';
import MarioControls from './mario/MarioControls';
import MarioCelebrationModal from './mario/MarioCelebrationModal';

interface Particle {
  id: number;
  x: number;
  y: number;
  text: string;
}

export default function MarioCompanion() {
  const { isEnglish } = useLanguage();
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isJumping, setIsJumping] = useState(false);
  const [isChasing, setIsChasing] = useState(false);
  const [actionText, setActionText] = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isCelebrating, setIsCelebrating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<{ x: number; y: number }>({ x: 120, y: 300 });
  const posRef = useRef<{ x: number; y: number; vx: number; vy: number }>({
    x: 120,
    y: 300,
    vx: 1.5,
    vy: 0,
  });
  const stateRef = useRef<'ROAMING' | 'CHASING' | 'CLICKED'>('ROAMING');
  const frameCountRef = useRef(0);
  const textTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showSpeech = (text: string, duration = 2500) => {
    if (textTimeoutRef.current) clearTimeout(textTimeoutRef.current);
    setActionText(text);
    textTimeoutRef.current = setTimeout(() => {
      setActionText(null);
    }, duration);
  };

  const spawnParticle = (x: number, y: number, text: string) => {
    const newP: Particle = { id: Date.now() + Math.random(), x, y, text };
    setParticles((prev) => [...prev.slice(-6), newP]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newP.id));
    }, 1200);
  };

  // Track Mouse & Mobile Touch Movement for Chasing
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') {
        const dx = e.clientX - posRef.current.x;
        const dy = e.clientY - posRef.current.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 320) {
          stateRef.current = 'CHASING';
          targetRef.current = { x: e.clientX, y: e.clientY };
          setIsChasing(true);
        } else if (stateRef.current === 'CHASING' && dist > 450) {
          stateRef.current = 'ROAMING';
          setIsChasing(false);
        }
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      stateRef.current = 'CHASING';
      targetRef.current = { x: e.clientX, y: e.clientY };
      setIsChasing(true);
    };

    const handlePointerUp = () => {
      setTimeout(() => {
        if (stateRef.current === 'CHASING') {
          stateRef.current = 'ROAMING';
          setIsChasing(false);
        }
      }, 3000);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('pointercancel', handlePointerUp, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  // Main 60FPS Physics & Animation Loop
  useEffect(() => {
    if (!isActive) return;

    let animId: number;

    const loop = () => {
      frameCountRef.current++;
      const cur = posRef.current;
      const maxX = typeof window !== 'undefined' ? window.innerWidth - 65 : 1000;
      const maxY = typeof window !== 'undefined' ? window.innerHeight - 70 : 800;

      if (stateRef.current === 'CHASING') {
        const dx = targetRef.current.x - cur.x;
        const dy = targetRef.current.y - cur.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 95) {
          const speed = Math.min((dist - 80) * 0.08, 6.5);
          cur.vx = (dx / dist) * speed;
          cur.vy = (dy / dist) * speed;
          setDirection(dx >= 0 ? 1 : -1);

          if (frameCountRef.current % 14 === 0) {
            setIsJumping(true);
            setTimeout(() => setIsJumping(false), 240);
          }
        } else {
          cur.vx = 0;
          cur.vy = 0;
        }
      } else {
        if (frameCountRef.current % 180 === 0) {
          cur.vx = (Math.random() * 3 + 1.2) * (Math.random() > 0.5 ? 1 : -1);
          cur.vy = Math.random() * 2 - 1;
          setDirection(cur.vx >= 0 ? 1 : -1);
        }

        if (frameCountRef.current % 60 === 0) {
          setIsJumping(true);
          setTimeout(() => setIsJumping(false), 320);
        }

        if (cur.x <= 20) {
          cur.x = 20;
          cur.vx = Math.abs(cur.vx) || 2;
          setDirection(1);
        } else if (cur.x >= maxX) {
          cur.x = maxX;
          cur.vx = -Math.abs(cur.vx) || -2;
          setDirection(-1);
        }

        if (cur.y <= 60) {
          cur.y = 60;
          cur.vy = Math.abs(cur.vy) || 1.5;
        } else if (cur.y >= maxY) {
          cur.y = maxY;
          cur.vy = -Math.abs(cur.vy) || -1.5;
        }
      }

      cur.x += cur.vx;
      cur.y += cur.vy;

      cur.x = Math.max(10, Math.min(maxX, cur.x));
      cur.y = Math.max(50, Math.min(maxY, cur.y));

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isActive]);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    stateRef.current = 'CLICKED';
    setIsJumping(true);

    const nextScore = score + 100;

    if (nextScore >= 500) {
      setScore(500);
      setIsCelebrating(true);
      showSpeech(
        isEnglish
          ? 'CONGRATULATIONS! 🌟 STAGE CLEAR!'
          : '축하합니다! 🌟 스테이지 클리어!',
        4000
      );
      spawnParticle(
        posRef.current.x + 15,
        posRef.current.y - 30,
        isEnglish ? '🌟 500 PTS!' : '🌟 500점 달성!'
      );
    } else {
      setScore(nextScore);
      const cheers = isEnglish
        ? ['WAHOO! 🍄', 'LET’S GO! ⭐', '1-UP! 🍄', '+100 PTS! 🪙', 'YAHOO! ✨']
        : ['점프! 🍄', '코인 획득! 🪙', '1-UP! ⭐', '+100점! 🚀', '만나서 반가워요! ✨'];

      const randomCheer = cheers[Math.floor(Math.random() * cheers.length)];
      showSpeech(randomCheer);
      spawnParticle(posRef.current.x + 15, posRef.current.y - 30, '🪙 +100');
    }

    posRef.current.vy = -8;
    setTimeout(() => {
      setIsJumping(false);
      stateRef.current = isChasing ? 'CHASING' : 'ROAMING';
    }, 450);
  };

  const handleCelebrationClose = () => {
    setIsCelebrating(false);
    setScore(0);
  };

  const handleMouseEnter = () => {
    setIsChasing(true);
    stateRef.current = 'CHASING';
    if (!actionText) {
      showSpeech(isEnglish ? 'Catch me if you can! 🎮' : '따라가는 중! 🏃‍♂️', 2000);
    }
  };

  return (
    <>
      {/* Mario Controls & Score Badge */}
      <MarioControls
        isActive={isActive}
        score={score}
        isEnglish={isEnglish}
        onActivate={() => setIsActive(true)}
        onDeactivate={() => setIsActive(false)}
      />

      {/* 500 Points Fireworks & Celebration Modal */}
      <MarioCelebrationModal
        isOpen={isCelebrating}
        onClose={handleCelebrationClose}
      />

      {isActive && (
        <>
          {/* Floating Particle Text Effects */}
          <AnimatePresence>
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, y: p.y, x: p.x, scale: 0.8 }}
                animate={{ opacity: 0, y: p.y - 65, scale: 1.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="fixed pointer-events-none z-[8100] font-black text-amber-600 font-mono text-base drop-shadow-[2px_2px_0px_#000000]"
              >
                {p.text}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Mario Pixel Character Container */}
          <div
            ref={containerRef}
            className="fixed left-0 top-0 z-[8050] cursor-pointer select-none pointer-events-auto touch-manipulation"
            style={{
              transform: `translate3d(120px, 300px, 0)`,
            }}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
          >
            {/* Speech Bubble */}
            <AnimatePresence>
              {actionText && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: -48 }}
                  exit={{ opacity: 0, scale: 0.6, y: -20 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 bg-white border-2 border-black shadow-[3px_3px_0px_#000000] px-2.5 py-1 text-xs font-black whitespace-nowrap font-mono text-black z-10"
                >
                  {actionText}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-black" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pixel Sprite Graphic Wrapper */}
            <motion.div
              animate={{
                scaleX: direction,
                y: isJumping ? -22 : [0, -3, 0],
                rotate: isJumping ? [0, -8 * direction, 0] : 0,
              }}
              transition={{
                y: isJumping
                  ? { duration: 0.28, ease: 'easeOut' }
                  : {
                      repeat: Infinity,
                      duration: isChasing ? 0.25 : 0.6,
                      ease: 'easeInOut',
                    },
              }}
              className="w-[52px] h-[52px] flex items-center justify-center drop-shadow-[3px_3px_0px_rgba(0,0,0,0.7)]"
            >
              <PixelMario isJumping={isJumping} />
            </motion.div>
          </div>
        </>
      )}
    </>
  );
}
