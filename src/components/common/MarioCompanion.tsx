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
  const [actionText, setActionText] = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0); // 0 to 500 per stage
  const [stage, setStage] = useState(1); // 1 to 6
  const [isActive, setIsActive] = useState(true);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [celebrationStage, setCelebrationStage] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef<{ x: number; y: number; vx: number; vy: number }>({
    x: 80,
    y: 300,
    vx: 0,
    vy: 0,
  });
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

  // Full 2D Physics Loop for Stages 1 to 6
  useEffect(() => {
    if (!isActive) return;

    let animId: number;

    const loop = () => {
      frameCountRef.current++;
      const cur = posRef.current;
      const screenW = typeof window !== 'undefined' ? window.innerWidth : 1000;
      const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;

      const minX = 30;
      const maxX = screenW - 80;
      const minY = 80;
      const maxY = screenH - 65;

      // Bottom-Right Avoidance Zone (AI Assistant & Mario Controls Area)
      const avoidMinX = screenW - 250;
      const avoidMinY = screenH - 190;

      if (stage === 1) {
        // Stage 1: Stationary idle placed safely on the bottom-left
        cur.vx = 0;
        cur.vy = 0;
        cur.x = 60;
        cur.y = maxY;
      } else if (stage === 2) {
        // Stage 2: Ground walking strictly outside the bottom-right panel zone
        const speed = 0.5;
        const groundMaxX = Math.max(minX + 100, Math.min(screenW - 260, 520));

        if (frameCountRef.current % 180 === 0) {
          cur.vx = speed * (Math.random() > 0.5 ? 1 : -1);
          setDirection(cur.vx >= 0 ? 1 : -1);
        }

        if (cur.x <= minX) {
          cur.x = minX;
          cur.vx = speed;
          setDirection(1);
        } else if (cur.x >= groundMaxX) {
          cur.x = groundMaxX;
          cur.vx = -speed;
          setDirection(-1);
        }

        cur.x += cur.vx || speed;
        cur.y = maxY;

        if (frameCountRef.current % 160 === 0 && !isJumping) {
          setIsJumping(true);
          setTimeout(() => setIsJumping(false), 280);
        }
      } else {
        // Stages 3 ~ 6: Full 2D Screen Roaming across X and Y axes!
        // Speeds: Stage 3 = 0.9, Stage 4 = 1.5, Stage 5 = 2.2, Stage 6 = 3.0
        const speedMultiplier =
          stage === 3 ? 0.9 : stage === 4 ? 1.5 : stage === 5 ? 2.2 : 3.0;

        const changeInterval = stage >= 5 ? 80 : 120;

        if (frameCountRef.current % changeInterval === 0) {
          cur.vx = speedMultiplier * (0.8 + Math.random() * 0.4) * (Math.random() > 0.5 ? 1 : -1);
          cur.vy = speedMultiplier * (0.6 + Math.random() * 0.4) * (Math.random() > 0.5 ? 1 : -1);
          setDirection(cur.vx >= 0 ? 1 : -1);
        }

        // Horizontal bounce across screen
        if (cur.x <= minX) {
          cur.x = minX;
          cur.vx = Math.abs(cur.vx) || speedMultiplier;
          setDirection(1);
        } else if (cur.x >= maxX) {
          cur.x = maxX;
          cur.vx = -Math.abs(cur.vx) || -speedMultiplier;
          setDirection(-1);
        }

        // Vertical bounce across screen
        if (cur.y <= minY) {
          cur.y = minY;
          cur.vy = Math.abs(cur.vy) || speedMultiplier;
        } else if (cur.y >= maxY) {
          cur.y = maxY;
          cur.vy = -Math.abs(cur.vy) || -speedMultiplier;
        }

        // Dynamic Collision Avoidance with Bottom-Right Controls
        if (cur.x >= avoidMinX && cur.y >= avoidMinY) {
          if (cur.vx > 0) cur.vx = -Math.abs(cur.vx) || -speedMultiplier;
          if (cur.vy > 0) cur.vy = -Math.abs(cur.vy) || -speedMultiplier;
          setDirection(-1);
        }

        cur.x += cur.vx || speedMultiplier;
        cur.y += cur.vy || speedMultiplier;

        // Frequent acrobatic jumps in higher stages
        const hopInterval = stage >= 5 ? 60 : 100;
        if (frameCountRef.current % hopInterval === 0 && !isJumping) {
          setIsJumping(true);
          setTimeout(() => setIsJumping(false), 220);
        }
      }

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isActive, isJumping, stage]);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsJumping(true);

    const nextScore = score + 100;

    if (nextScore >= 500) {
      setScore(500);
      setCelebrationStage(stage);
      setIsCelebrating(true);

      const cheers: Record<number, { en: string; kr: string }> = {
        1: {
          en: 'STAGE 1 CLEAR! WALK UNLOCKED! 🚶‍♂️',
          kr: '1단계 클리어! 걷기 해금! 🚶‍♂️',
        },
        2: {
          en: 'STAGE 2 CLEAR! 2D ROAM UNLOCKED! 🌐',
          kr: '2단계 클리어! 2D 전체화면 탐색 해금! 🌐',
        },
        3: {
          en: 'STAGE 3 CLEAR! FIRE DASH UNLOCKED! 🔥',
          kr: '3단계 클리어! 파이어 대시 해금! 🔥',
        },
        4: {
          en: 'STAGE 4 CLEAR! FLYING CAPE UNLOCKED! 🪂',
          kr: '4단계 클리어! 공중 비행 해금! 🪂',
        },
        5: {
          en: 'STAGE 5 CLEAR! ULTRA STAR UNLOCKED! ⭐',
          kr: '5단계 클리어! 초광속 스타 해금! ⭐',
        },
        6: {
          en: '👑 ALL 6 STAGES MASTERED! 👑🎉',
          kr: '👑 6단계 전 과정 올클리어! 👑🎉',
        },
      };

      const msg = cheers[stage] || cheers[1];
      showSpeech(isEnglish ? msg.en : msg.kr, 4000);
      spawnParticle(posRef.current.x + 15, posRef.current.y - 30, '🌟 500 PTS!');
    } else {
      setScore(nextScore);
      const cheers = isEnglish
        ? ['WAHOO! 🍄', 'LET’S GO! ⭐', '1-UP! 🍄', '+100 PTS! 🪙', 'YAHOO! ✨']
        : ['점프! 🍄', '코인 획득! 🪙', '1-UP! ⭐', '+100점! 🚀', '반가워요! ✨'];

      const randomCheer = cheers[Math.floor(Math.random() * cheers.length)];
      showSpeech(randomCheer);
      spawnParticle(posRef.current.x + 15, posRef.current.y - 30, '🪙 +100');
    }

    setTimeout(() => {
      setIsJumping(false);
    }, 320);
  };

  const handleCelebrationClose = () => {
    setIsCelebrating(false);
    setScore(0); // Reset score to 0 for next stage

    if (celebrationStage < 6) {
      setStage(celebrationStage + 1); // Advance to next stage (up to 6)
    } else {
      setStage(1); // Reset back to Stage 1 after finishing all 6
    }
  };

  return (
    <>
      {/* Mario Controls & Score/Stage Badge */}
      <MarioControls
        isActive={isActive}
        score={score}
        stage={stage}
        isEnglish={isEnglish}
        onActivate={() => setIsActive(true)}
        onDeactivate={() => setIsActive(false)}
      />

      {/* Stage Progression Fireworks & Celebration Modal */}
      <MarioCelebrationModal
        isOpen={isCelebrating}
        stage={celebrationStage}
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
                className="fixed pointer-events-none z-[8100] font-black text-cyan-500 dark:text-cyan-300 font-mono text-base drop-shadow-[2px_2px_0px_#000000]"
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
              transform: `translate3d(80px, 800px, 0)`,
            }}
            onClick={handleClick}
          >
            {/* Speech Bubble */}
            <AnimatePresence>
              {actionText && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: -48 }}
                  exit={{ opacity: 0, scale: 0.6, y: -20 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1f212a] border-2 border-black dark:border-white shadow-[3px_3px_0px_#000000] px-2.5 py-1 text-xs font-black whitespace-nowrap font-mono text-black dark:text-white z-10"
                >
                  {actionText}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-black dark:border-t-white" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pixel Sprite Graphic Wrapper with Stage-based Auras */}
            <motion.div
              animate={{
                scaleX: direction,
                y: isJumping ? -22 : [0, -3, 0],
                rotate: isJumping ? [0, -8 * direction, 0] : 0,
              }}
              transition={{
                y: isJumping
                  ? { duration: 0.24, ease: 'easeOut' }
                  : {
                      repeat: Infinity,
                      duration: stage >= 5 ? 0.3 : stage >= 3 ? 0.5 : 0.8,
                      ease: 'easeInOut',
                    },
              }}
              className={`
                w-[52px]
                h-[52px]
                flex
                items-center
                justify-center
                drop-shadow-[3px_3px_0px_rgba(0,0,0,0.7)]
                ${
                  stage >= 6
                    ? 'filter drop-shadow-[0_0_12px_#38bdf8] drop-shadow-[0_0_20px_#c084fc]'
                    : stage >= 4
                    ? 'filter drop-shadow-[0_0_8px_#f43f5e]'
                    : stage >= 3
                    ? 'filter drop-shadow-[0_0_6px_#38bdf8]'
                    : ''
                }
              `}
            >
              <PixelMario isJumping={isJumping} />
            </motion.div>
          </div>
        </>
      )}
    </>
  );
}
