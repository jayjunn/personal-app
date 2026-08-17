'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import github from '../../public/image/github.svg';
import linkedin from '../../public/image/linkedin.svg';
import envelope from '../../public/image/envelope.svg';
import { useUserContext } from '../context/userContext';

export default function Footer() {
  const { isEnglish } = useUserContext();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Seoul',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setTime(now.toLocaleTimeString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-stone-800 bg-[#ede8dc]/80 mt-auto">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-stone-300 pb-10">
          {/* Col 1: Identity & Time */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="status-pulse" />
              <span className="font-bold text-sm text-stone-900">SEOUL & TOKYO (KST/JST)</span>
            </div>
            <div className="font-mono text-xl sm:text-2xl font-bold text-stone-900">
              {time || '12:00:00 PM'}
            </div>
            <p className="text-xs text-stone-600 font-normal leading-relaxed">
              {isEnglish
                ? 'Building accessible, high-performance web applications with engineering precision.'
                : '뛰어난 사용자 경험과 안정적인 엔지니어링을 바탕으로 가치를 창출합니다.'}
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider block mb-3">
              {isEnglish ? 'Navigation' : '바로가기'}
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-medium text-stone-800">
              <Link href="/" className="hover:text-stone-950 hover:underline">Home</Link>
              <Link href="/works" className="hover:text-stone-950 hover:underline">Works</Link>
              <Link href="/experience" className="hover:text-stone-950 hover:underline">Experience</Link>
              <Link href="/cv" className="hover:text-stone-950 hover:underline">CV / Resume</Link>
              <Link href="/lab" className="hover:text-stone-950 hover:underline">Creative Lab</Link>
              <Link href="/contact" className="hover:text-stone-950 hover:underline">Contact</Link>
            </div>
          </div>

          {/* Col 3: Socials & Back to Top */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider block mb-3">
                {isEnglish ? 'Social Connect' : '소셜 및 채널'}
              </span>
              <div className="flex gap-2.5">
                <a
                  href="https://github.com/jayjunn"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-md bg-stone-900 flex items-center justify-center hover:bg-stone-800 transition-colors"
                  title="GitHub">
                  <Image src={github} alt="GitHub" width={18} height={18} className="invert" />
                </a>
                <a
                  href="https://www.linkedin.com/in/younggeun"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-md bg-stone-900 flex items-center justify-center hover:bg-stone-800 transition-colors"
                  title="LinkedIn">
                  <Image src={linkedin} alt="LinkedIn" width={18} height={18} className="invert" />
                </a>
                <a
                  href="mailto:jayjunn@outlook.com"
                  className="w-9 h-9 rounded-md bg-stone-900 flex items-center justify-center hover:bg-stone-800 transition-colors"
                  title="Email">
                  <Image src={envelope} alt="Email" width={18} height={18} className="invert" />
                </a>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="text-xs font-semibold text-stone-700 hover:text-stone-950 hover:underline flex items-center gap-1">
              <span>↑ {isEnglish ? 'Back to Top' : '맨 위로 이동'}</span>
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-stone-500">
          <div>© {new Date().getFullYear()} YOUNGGEUN JUN. ALL RIGHTS RESERVED.</div>
          <div>React • Next.js • TypeScript</div>
        </div>
      </div>
    </footer>
  );
}
