'use client';

import React, { useEffect, useRef, useState } from 'react';
import PageWrap from './common/PageWrap';
import { useUserContext } from '../context/userContext';

export default function CreativeLab() {
  const { isEnglish } = useUserContext();
  const [activeTab, setActiveTab] = useState<'particles' | 'tilt' | 'synth'>('particles');

  // Particle Canvas State & Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [particleCount, setParticleCount] = useState(60);
  const [connectionDistance, setConnectionDistance] = useState(110);

  // 3D Tilt Card State
  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  // Web Audio Synth State
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [activeNote, setActiveNote] = useState<string | null>(null);

  // 1. Particle Canvas Simulation Effect
  useEffect(() => {
    if (activeTab !== 'particles') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 420;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: -1000, y: -1000, radius: 140 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        this.size = Math.random() * 2 + 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = dx / dist;
          const dirY = dy / dist;
          this.x -= dirX * force * 3;
          this.y -= dirY * force * 3;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = '#18181b';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: Particle[] = Array.from({ length: particleCount }, () => new Particle());

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.35;
            ctx.strokeStyle = `rgba(24, 24, 27, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      if (mouse.x > 0 && mouse.y > 0) {
        for (let i = 0; i < particles.length; i++) {
          const dx = mouse.x - particles[i].x;
          const dy = mouse.y - particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            ctx.strokeStyle = `rgba(212, 163, 115, ${1 - dist / mouse.radius})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(particles[i].x, particles[i].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTab, particleCount, connectionDistance]);

  // 2. 3D Tilt Card Handler
  const handleMouseMoveTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
    });
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeaveTilt = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    });
  };

  // 3. Web Audio Tone Generator
  const playNote = (freq: number, noteName: string) => {
    if (typeof window === 'undefined') return;

    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);

      setActiveNote(noteName);
      setTimeout(() => setActiveNote(null), 300);
    } catch {
      // Audio context restricted
    }
  };

  const synthNotes = [
    { note: 'C4', freq: 261.63 },
    { note: 'D4', freq: 293.66 },
    { note: 'E4', freq: 329.63 },
    { note: 'F4', freq: 349.23 },
    { note: 'G4', freq: 392.00 },
    { note: 'A4', freq: 440.00 },
    { note: 'B4', freq: 493.88 },
    { note: 'C5', freq: 523.25 },
    { note: 'D5', freq: 587.33 },
    { note: 'E5', freq: 659.25 },
  ];

  return (
    <PageWrap
      title="Creative Lab & Experiments"
      subtitle={isEnglish ? 'Interactive Canvas & Audio Web API Demos' : '인터랙티브 캔버스 & 웹 오디오 API 실험 공간'}>
      <div className="py-8 md:py-16 px-6 sm:px-8 max-w-5xl mx-auto space-y-8">
        {/* Intro Banner */}
        <div className="p-6 sm:p-8 rounded-xl bg-white border border-stone-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider">
              EXPERIMENTAL SANDBOX
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-950 mt-1">
              {isEnglish ? 'Interactive Creative Coding' : '크리에이티브 코딩 & 인터랙션'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1.5 font-normal max-w-xl">
              {isEnglish
                ? 'Demonstrating HTML5 Canvas physics, 3D CSS perspective transforms, and Web Audio API synthesis.'
                : 'HTML5 Canvas 물리 엔진, 3D CSS 원근감 변환, Web Audio API 오실레이터 합성 데모입니다.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-stone-100 border border-stone-200">
            <button
              onClick={() => setActiveTab('particles')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'particles' ? 'bg-stone-900 text-white' : 'text-stone-700 hover:text-stone-950'
              }`}>
              01. Particle Mesh
            </button>
            <button
              onClick={() => setActiveTab('tilt')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'tilt' ? 'bg-stone-900 text-white' : 'text-stone-700 hover:text-stone-950'
              }`}>
              02. 3D Spatial Card
            </button>
            <button
              onClick={() => setActiveTab('synth')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'synth' ? 'bg-stone-900 text-white' : 'text-stone-700 hover:text-stone-950'
              }`}>
              03. Audio Synth
            </button>
          </div>
        </div>

        {/* Experiment 1: Particle Mesh */}
        {activeTab === 'particles' && (
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-stone-300 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                <h4 className="text-base font-bold text-stone-950">
                  {isEnglish ? 'Canvas Particle Force Field' : '캔버스 파티클 포스 필드'}
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  {isEnglish
                    ? 'Move your cursor across the canvas to interact with particles and create dynamic force connections'
                    : '캔버스 위에 마우스를 올려 파티클과 연결선을 움직여보세요'}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-stone-600">
                <label className="flex items-center gap-2">
                  <span>Count:</span>
                  <input
                    type="range"
                    min="30"
                    max="120"
                    value={particleCount}
                    onChange={(e) => setParticleCount(Number(e.target.value))}
                    className="accent-stone-900"
                  />
                  <span>{particleCount}</span>
                </label>
              </div>
            </div>

            <div className="relative rounded-lg border border-stone-200 bg-stone-50 overflow-hidden cursor-crosshair">
              <canvas ref={canvasRef} className="w-full h-[420px] block" />
              <div className="absolute bottom-3 right-3 font-mono text-[10px] bg-stone-900 text-white px-2 py-0.5 rounded select-none">
                HTML5 Canvas API
              </div>
            </div>
          </div>
        )}

        {/* Experiment 2: 3D Spatial Card */}
        {activeTab === 'tilt' && (
          <div className="p-8 sm:p-12 rounded-xl bg-white border border-stone-300 shadow-sm flex flex-col items-center justify-center space-y-8">
            <div className="text-center max-w-md">
              <h4 className="text-base font-bold text-stone-950">
                {isEnglish ? '3D Spatial Coordinate & Glare Sandbox' : '3D 공간 좌표 및 광원 시뮬레이터'}
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                {isEnglish
                  ? 'Hover and move across the card to see smooth perspective tilt and specular reflection'
                  : '카드 위에서 마우스를 움직여 부드러운 3D 원근감과 빛 반사 효과를 확인하세요'}
              </p>
            </div>

            <div
              onMouseMove={handleMouseMoveTilt}
              onMouseLeave={handleMouseLeaveTilt}
              style={{ ...tiltStyle, transition: 'transform 0.1s ease-out' }}
              className="relative w-full max-w-md aspect-[4/3] rounded-xl bg-stone-900 text-stone-100 p-8 shadow-xl cursor-pointer overflow-hidden flex flex-col justify-between select-none">
              <div
                className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
                style={{
                  background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`,
                }}
              />

              <div className="flex justify-between items-start z-10">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-stone-800 text-stone-200">
                  YOUNGGEUN JUN
                </span>
                <span className="text-lg text-[#d4a373]">✦</span>
              </div>

              <div className="z-10 space-y-1">
                <h3 className="text-xl font-bold tracking-tight text-white">
                  CREATIVE FRONT-END DEVELOPER
                </h3>
                <p className="text-xs font-mono text-stone-400">
                  React • Next.js • Canvas API • Framer Motion
                </p>
              </div>

              <div className="flex justify-between items-end z-10 border-t border-stone-800 pt-3 text-xs font-mono text-stone-400">
                <span>X: {glarePosition.x.toFixed(0)}% • Y: {glarePosition.y.toFixed(0)}%</span>
                <span className="text-stone-300 font-semibold">LIVE 3D</span>
              </div>
            </div>
          </div>
        )}

        {/* Experiment 3: Audio Synth */}
        {activeTab === 'synth' && (
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-stone-300 shadow-sm space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h4 className="text-base font-bold text-stone-950">
                {isEnglish ? 'Web Audio Harmonic Synthesizer' : '웹 오디오 하모닉 신디사이저'}
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                {isEnglish
                  ? 'Click the harmonic pads below to trigger real-time acoustic tones using Web Audio API oscillators'
                  : '아래 패드를 클릭하여 Web Audio API 기반의 실시간 톤을 연주해보세요'}
              </p>
            </div>

            <div className="rounded-lg bg-stone-900 p-6 flex flex-col items-center justify-center min-h-[120px] text-white">
              <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">ACTIVE FREQUENCY</span>
              <div className="text-3xl sm:text-4xl font-mono font-bold mt-1 text-[#d4a373]">
                {activeNote || 'IDLE'}
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                {Array.from({ length: 12 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 transition-all duration-100 rounded-full ${
                      activeNote ? 'bg-[#d4a373] h-6 animate-pulse' : 'bg-stone-800 h-1.5'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {synthNotes.map((note) => (
                <button
                  key={note.note}
                  onClick={() => playNote(note.freq, note.note)}
                  className={`p-3.5 rounded-lg border font-mono font-bold text-center flex flex-col justify-between items-center h-24 transition-all ${
                    activeNote === note.note
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                  }`}>
                  <span className="text-base">{note.note}</span>
                  <span className="text-[10px] text-stone-400 font-normal">{note.freq.toFixed(1)} Hz</span>
                  <span className="text-[11px] text-stone-600">♪ PLAY</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageWrap>
  );
}
