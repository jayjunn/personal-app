'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import github from '../../public/image/github.svg';
import linkedin from '../../public/image/linkedin.svg';
import envelope from '../../public/image/envelope.svg';
import { useUserContext } from '../context/userContext';

export default function ContactList() {
  const { isEnglish } = useUserContext();
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  const emailAddress = 'jayjunn@outlook.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Seoul',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Intro Bar with Direct Email Copy */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-stone-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider">
            {isEnglish ? 'DIRECT INQUIRIES & NETWORKING' : '직접 연락 및 협업 문의'}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-950 mt-1">
            {isEnglish ? "Let's build something great together." : '새로운 프로젝트와 기회를 함께 만들어갑니다.'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1.5 font-normal max-w-xl">
            {isEnglish
              ? 'Feel free to reach out for engineering roles, technical advisory, or project collaborations.'
              : '프론트엔드 포지션 제안, 기술 자문, 프로젝트 협업 등 언제든 편하게 연락해 주세요.'}
          </p>
        </div>

        {/* 1-Click Copy Email Button */}
        <button
          onClick={copyEmail}
          className="brutal-btn text-xs py-2.5 px-5 flex items-center justify-center gap-2 self-start md:self-auto shrink-0">
          <span>{copied ? '✔ Copied to clipboard!' : `📋 Copy: ${emailAddress}`}</span>
        </button>
      </div>

      {/* Grid of Social Channels & Timezone Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* GitHub Card */}
        <a
          href="https://github.com/jayjunn"
          target="_blank"
          rel="noreferrer"
          className="p-5 rounded-xl bg-white border border-stone-300 hover:border-stone-800 transition-all flex flex-col justify-between group shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-md bg-stone-900 flex items-center justify-center">
              <Image src={github} alt="GitHub" width={20} height={20} className="invert" />
            </div>
            <span className="font-mono text-xs text-stone-400 group-hover:text-stone-900 transition-colors">↗</span>
          </div>
          <div className="mt-4">
            <h4 className="font-bold text-sm text-stone-950">GitHub</h4>
            <p className="text-xs text-stone-500 font-mono mt-0.5">@jayjunn</p>
          </div>
        </a>

        {/* LinkedIn Card */}
        <a
          href="https://www.linkedin.com/in/younggeun"
          target="_blank"
          rel="noreferrer"
          className="p-5 rounded-xl bg-white border border-stone-300 hover:border-stone-800 transition-all flex flex-col justify-between group shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-md bg-stone-900 flex items-center justify-center">
              <Image src={linkedin} alt="LinkedIn" width={20} height={20} className="invert" />
            </div>
            <span className="font-mono text-xs text-stone-400 group-hover:text-stone-900 transition-colors">↗</span>
          </div>
          <div className="mt-4">
            <h4 className="font-bold text-sm text-stone-950">LinkedIn</h4>
            <p className="text-xs text-stone-500 font-mono mt-0.5">/in/younggeun</p>
          </div>
        </a>

        {/* Local Time Card */}
        <div className="p-5 rounded-xl bg-white border border-stone-300 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-md bg-stone-100 border border-stone-200 flex items-center justify-center">
              <span className="text-stone-800 font-mono font-bold text-xs">GMT+9</span>
            </div>
            <span className="status-pulse" />
          </div>
          <div className="mt-4">
            <h4 className="font-bold text-sm text-stone-950">Seoul / Tokyo</h4>
            <p className="text-xs font-mono font-medium text-stone-600 mt-0.5">
              {currentTime || '12:00:00 PM'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
