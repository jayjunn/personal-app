'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserContext } from '@/context/userContext';

interface Particle {
  id: number;
  x: number;
  y: number;
  text: string;
}

export default function MarioCompanion() {
  const { isEnglish } = useUserContext();
  const [pos, setPos] = useState({ x: 120, y: 300 });
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isJumping, setIsJumping] = useState(false);
  const [isChasing, setIsChasing] = useState(false);
  const [actionText, setActionText] = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(true);

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
      // 마우스일 때만 호버 거리(320) 체크로 따라가기 유발
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
      // 터치 또는 클릭 시 그 위치로 무조건 달려오게 함
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

        // 마우스와 충분한 여유 거리(95px)를 두고 정지하여 다른 요소 클릭 방해 금지
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
    setScore((s) => s + 100);
    setIsJumping(true);

    const cheers = isEnglish
      ? ['WAHOO! 🍄', 'LET’S GO! ⭐', '1-UP! 🍄', '+100 PTS! 🪙', 'YAHOO! ✨']
      : ['점프! 🍄', '코인 획득! 🪙', '1-UP! ⭐', '+100점! 🚀', '만나서 반가워요! ✨'];

    const randomCheer = cheers[Math.floor(Math.random() * cheers.length)];
    showSpeech(randomCheer);
    spawnParticle(posRef.current.x + 15, posRef.current.y - 30, '🪙 +100');

    posRef.current.vy = -8;
    setTimeout(() => {
      setIsJumping(false);
      stateRef.current = isChasing ? 'CHASING' : 'ROAMING';
    }, 450);
  };

  const handleMouseEnter = () => {
    setIsChasing(true);
    stateRef.current = 'CHASING';
    if (!actionText) {
      showSpeech(isEnglish ? 'Catch me if you can! 🎮' : '따라가는 중! 🏃‍♂️', 2000);
    }
  };

  if (!isActive) {
    return (
      <button
        type="button"
        onClick={() => setIsActive(true)}
        className="fixed bottom-6 right-6 z-[9990] bg-black text-[#e7e2d0] border-2 border-black px-3.5 py-2 font-mono text-xs font-extrabold shadow-[3px_3px_0px_#000000] cursor-pointer hover:bg-neutral-800 transition-colors">
        🎮 소환하기 (Mario ON)
      </button>
    );
  }

  return (
    <>
      {/* Floating Score Badge / Controls (Highest z-index so always clickable) */}
      <div className="fixed bottom-4 right-4 z-[99999] flex items-center gap-2 bg-[#e7e2d0] border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#000000] font-mono text-xs font-extrabold pointer-events-auto select-none">
        <span>🪙 {score} PTS</span>
        <button
          type="button"
          onClick={() => setIsActive(false)}
          className="ml-1 px-1.5 py-0.5 bg-black text-[#e7e2d0] hover:bg-neutral-800 transition-colors text-[10px] font-mono font-bold uppercase cursor-pointer"
          title="캐릭터 숨기기">
          숨기기
        </button>
      </div>

      {/* Floating Particle Text Effects */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, y: p.y, x: p.x, scale: 0.8 }}
            animate={{ opacity: 0, y: p.y - 65, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="fixed pointer-events-none z-[9999] font-black text-amber-600 font-mono text-base drop-shadow-[2px_2px_0px_#000000]">
            {p.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Mario Pixel Character Container */}
      <div
        ref={containerRef}
        className="fixed left-0 top-0 z-[9995] cursor-pointer select-none pointer-events-auto touch-manipulation"
        style={{
          transform: `translate3d(120px, 300px, 0)`,
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}>
        {/* Speech Bubble */}
        <AnimatePresence>
          {actionText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: -48 }}
              exit={{ opacity: 0, scale: 0.6, y: -20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 bg-white border-2 border-black shadow-[3px_3px_0px_#000000] px-2.5 py-1 text-xs font-black whitespace-nowrap font-mono text-black z-10">
              {actionText}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-black" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pixel Sprite Graphic */}
        <motion.div
          animate={{
            scaleX: direction,
            y: isJumping ? -22 : [0, -3, 0],
            rotate: isJumping ? [0, -8 * direction, 0] : 0,
          }}
          transition={{
            y: isJumping
              ? { duration: 0.28, ease: 'easeOut' }
              : { repeat: Infinity, duration: isChasing ? 0.25 : 0.6, ease: 'easeInOut' },
          }}
          className="w-[52px] h-[52px] flex items-center justify-center drop-shadow-[3px_3px_0px_rgba(0,0,0,0.7)]">
          {/* Authentic 8-bit SVG Pixel Mario */}
          <svg
            viewBox="0 0 16 16"
            width="52"
            height="52"
            className="[image-rendering:pixelated] [shape-rendering:crispEdges]">
            {/* Red Cap */}
            <rect x="3" y="1" width="5" height="1" fill="#e11d48" />
            <rect x="2" y="2" width="9" height="1" fill="#e11d48" />

            {/* Brown Hair / Face */}
            <rect x="2" y="3" width="3" height="1" fill="#6d4c41" />
            <rect x="5" y="3" width="2" height="1" fill="#fcd34d" />
            <rect x="7" y="3" width="1" height="1" fill="#000000" />
            <rect x="8" y="3" width="1" height="1" fill="#fcd34d" />

            <rect x="1" y="4" width="1" height="1" fill="#6d4c41" />
            <rect x="2" y="4" width="1" height="1" fill="#fcd34d" />
            <rect x="3" y="4" width="1" height="1" fill="#6d4c41" />
            <rect x="4" y="4" width="3" height="1" fill="#fcd34d" />
            <rect x="7" y="4" width="1" height="1" fill="#000000" />
            <rect x="8" y="4" width="3" height="1" fill="#fcd34d" />

            <rect x="1" y="5" width="1" height="1" fill="#6d4c41" />
            <rect x="2" y="5" width="1" height="1" fill="#fcd34d" />
            <rect x="3" y="5" width="2" height="1" fill="#6d4c41" />
            <rect x="5" y="5" width="3" height="1" fill="#fcd34d" />
            <rect x="8" y="5" width="4" height="1" fill="#6d4c41" />

            {/* Face & Mustache */}
            <rect x="2" y="6" width="2" height="1" fill="#6d4c41" />
            <rect x="4" y="6" width="5" height="1" fill="#fcd34d" />
            <rect x="9" y="6" width="3" height="1" fill="#000000" />

            <rect x="3" y="7" width="7" height="1" fill="#fcd34d" />

            {/* Red Shirt */}
            <rect x="3" y="8" width="2" height="1" fill="#e11d48" />
            <rect x="5" y="8" width="1" height="1" fill="#2563eb" />
            <rect x="6" y="8" width="3" height="1" fill="#e11d48" />

            <rect x="2" y="9" width="3" height="1" fill="#e11d48" />
            <rect x="5" y="9" width="1" height="1" fill="#2563eb" />
            <rect x="6" y="9" width="2" height="1" fill="#e11d48" />
            <rect x="8" y="9" width="1" height="1" fill="#2563eb" />
            <rect x="9" y="9" width="2" height="1" fill="#e11d48" />

            {/* Overalls (Blue) */}
            <rect x="1" y="10" width="3" height="1" fill="#e11d48" />
            <rect x="4" y="10" width="4" height="1" fill="#2563eb" />
            <rect x="8" y="10" width="3" height="1" fill="#e11d48" />

            {/* Yellow Buttons & Hands */}
            <rect x="1" y="11" width="2" height="1" fill="#fcd34d" />
            <rect x="3" y="11" width="1" height="1" fill="#2563eb" />
            <rect x="4" y="11" width="1" height="1" fill="#fbbf24" />
            <rect x="5" y="11" width="2" height="1" fill="#2563eb" />
            <rect x="7" y="11" width="1" height="1" fill="#fbbf24" />
            <rect x="8" y="11" width="1" height="1" fill="#2563eb" />
            <rect x="9" y="11" width="2" height="1" fill="#fcd34d" />

            {/* Blue Pants */}
            <rect x="3" y="12" width="6" height="1" fill="#2563eb" />
            <rect x="2" y="13" width="3" height="1" fill="#2563eb" />
            <rect x="7" y="13" width="3" height="1" fill="#2563eb" />

            {/* Brown Shoes */}
            {isJumping ? (
              <>
                <rect x="1" y="14" width="3" height="1" fill="#6d4c41" />
                <rect x="8" y="14" width="3" height="1" fill="#6d4c41" />
                <rect x="1" y="15" width="4" height="1" fill="#6d4c41" />
                <rect x="8" y="15" width="4" height="1" fill="#6d4c41" />
              </>
            ) : (
              <>
                <rect x="1" y="14" width="3" height="1" fill="#6d4c41" />
                <rect x="8" y="14" width="3" height="1" fill="#6d4c41" />
                <rect x="1" y="15" width="4" height="1" fill="#6d4c41" />
                <rect x="8" y="15" width="4" height="1" fill="#6d4c41" />
              </>
            )}
          </svg>
        </motion.div>
      </div>
    </>
  );
}
