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
  const [direction, setDirection] = useState<1 | -1>(1); // 1: right, -1: left
  const [isJumping, setIsJumping] = useState(false);
  const [isChasing, setIsChasing] = useState(false);
  const [actionText, setActionText] = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(true);

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

  // Track Mouse Movement for Chasing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate distance to mouse
      const dx = e.clientX - posRef.current.x;
      const dy = e.clientY - posRef.current.y;
      const dist = Math.hypot(dx, dy);

      // If mouse is within 280px or moves quickly, switch to chasing mode
      if (dist < 320) {
        stateRef.current = 'CHASING';
        targetRef.current = { x: e.clientX, y: e.clientY };
        setIsChasing(true);
      } else {
        if (stateRef.current === 'CHASING' && dist > 450) {
          stateRef.current = 'ROAMING';
          setIsChasing(false);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Main 60FPS Physics & Animation Loop
  useEffect(() => {
    if (!isActive) return;

    let animId: number;

    const loop = () => {
      frameCountRef.current++;
      const cur = posRef.current;
      const maxX = typeof window !== 'undefined' ? window.innerWidth - 60 : 1000;
      const maxY = typeof window !== 'undefined' ? window.innerHeight - 70 : 800;

      if (stateRef.current === 'CHASING') {
        // Run towards mouse target
        const dx = targetRef.current.x - cur.x;
        const dy = targetRef.current.y - cur.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 45) {
          const speed = Math.min(dist * 0.06, 7.5);
          cur.vx = (dx / dist) * speed;
          cur.vy = (dy / dist) * speed;
          setDirection(dx >= 0 ? 1 : -1);

          // Bouncing hop while running
          if (frameCountRef.current % 14 === 0) {
            setIsJumping(true);
            setTimeout(() => setIsJumping(false), 240);
          }
        } else {
          // Reached mouse!
          cur.vx = 0;
          cur.vy = 0;
        }
      } else {
        // ROAMING MODE: Bounce and wander around the screen
        if (frameCountRef.current % 180 === 0) {
          // Randomly change wander speed/direction
          cur.vx = (Math.random() * 3 + 1.2) * (Math.random() > 0.5 ? 1 : -1);
          cur.vy = (Math.random() * 2 - 1);
          setDirection(cur.vx >= 0 ? 1 : -1);
        }

        // Periodic jumping bounce
        if (frameCountRef.current % 60 === 0) {
          setIsJumping(true);
          setTimeout(() => setIsJumping(false), 320);
        }

        // Screen boundary collision bounce
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

      // Keep inside bounds
      cur.x = Math.max(10, Math.min(maxX, cur.x));
      cur.y = Math.max(50, Math.min(maxY, cur.y));

      setPos({ x: cur.x, y: cur.y });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isActive]);

  // Click interaction: Mario High Jump & Coin Pop!
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    stateRef.current = 'CLICKED';
    setScore((s) => s + 100);
    setIsJumping(true);

    const cheers = isEnglish
      ? ['WAHOO! 🍄', 'LET’S GO! ⭐', '1-UP! 🍄', '+100 PTS! 🪙', 'YAHOO! ✨']
      : ['점프! 🍄', '코인 획득! 🪙', '1-UP! ⭐', '+100점! 🚀', '만나서 반가워요! ✨'];

    const randomCheer = cheers[Math.floor(Math.random() * cheers.length)];
    showSpeech(randomCheer);
    spawnParticle(pos.x + 15, pos.y - 30, '🪙 +100');

    // High jump physics boost
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
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9990,
          backgroundColor: '#000000',
          color: '#e7e2d0',
          border: '2px solid #000000',
          padding: '8px 14px',
          fontFamily: 'monospace',
          fontSize: '12px',
          fontWeight: 800,
          boxShadow: '3px 3px 0px #000000',
          cursor: 'pointer',
        }}>
        🎮 소환하기 (Mario ON)
      </button>
    );
  }

  return (
    <>
      {/* Floating Score Badge / Controls */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9990,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#e7e2d0',
          border: '2px solid #000000',
          padding: '6px 12px',
          boxShadow: '3px 3px 0px #000000',
          fontFamily: 'monospace',
          fontSize: '12px',
          fontWeight: 800,
        }}>
        <span>🪙 {score} PTS</span>
        <button
          type="button"
          onClick={() => setIsActive(false)}
          style={{
            marginLeft: '6px',
            background: 'none',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            fontSize: '11px',
            textDecoration: 'underline',
          }}
          title="캐릭터 숨기기">
          [숨기기]
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
            style={{
              position: 'fixed',
              pointerEvents: 'none',
              zIndex: 9999,
              fontWeight: 900,
              fontSize: '16px',
              fontFamily: 'monospace',
              color: '#d97706',
              textShadow: '2px 2px 0px #000000',
            }}>
            {p.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Mario Pixel Character Container */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          zIndex: 9995,
          cursor: 'pointer',
          userSelect: 'none',
          pointerEvents: 'auto',
          transition: 'transform 0.05s linear',
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
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#ffffff',
                border: '2px solid #000000',
                boxShadow: '3px 3px 0px #000000',
                padding: '5px 10px',
                fontSize: '12px',
                fontWeight: 900,
                whiteSpace: 'nowrap',
                fontFamily: 'monospace',
                color: '#000000',
                zIndex: 10,
              }}>
              {actionText}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: '6px solid #000000',
                }}
              />
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
          style={{
            width: '52px',
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(3px 3px 0px rgba(0, 0, 0, 0.7))',
          }}>
          {/* Authentic 8-bit SVG Pixel Mario */}
          <svg
            viewBox="0 0 16 16"
            width="52"
            height="52"
            style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}>
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
              // Jump Pose Shoes
              <>
                <rect x="1" y="14" width="3" height="1" fill="#6d4c41" />
                <rect x="8" y="14" width="3" height="1" fill="#6d4c41" />
                <rect x="1" y="15" width="4" height="1" fill="#6d4c41" />
                <rect x="8" y="15" width="4" height="1" fill="#6d4c41" />
              </>
            ) : (
              // Walk / Stand Pose Shoes
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
