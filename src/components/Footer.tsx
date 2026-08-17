'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LockIcon } from './icons';

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="w-full mt-8 border-t-[3px] border-black dark:border-[#272a34] px-4 sm:px-8 py-6 sm:py-8 pb-10 flex flex-wrap items-center justify-between gap-3.5 text-xs font-mono box-border transition-colors duration-200">
      <div className="flex items-center gap-2 flex-wrap text-black dark:text-[#d1d5db]">
        <span className="font-extrabold tracking-tight">© {new Date().getFullYear()} YOUNGGEUN JUN.</span>
        <span className="text-neutral-400">•</span>
        <span className="text-neutral-600 dark:text-neutral-500 font-semibold">ALL RIGHTS RESERVED.</span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="
            inline-flex
            items-center
            gap-2
            px-3.5
            py-1.5
            bg-[#e7e2d0]
            dark:bg-[#16171e]
            border-2
            border-black
            dark:border-[#2f3340]
            font-extrabold
            text-[11px]
            uppercase
            text-black
            dark:text-[#f3f4f6]
            hover:bg-black
            hover:text-[#e7e2d0]
            dark:hover:bg-[#252834]
            dark:hover:text-cyan-300
            transition-colors
            shadow-[2px_2px_0px_#000000]
          "
          title="관리자 페이지로 이동"
        >
          {user ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>ADMIN PANEL ({user.email?.split('@')[0] || 'ADMIN'})</span>
              <span>➔</span>
            </>
          ) : (
            <>
              <LockIcon className="w-3.5 h-3.5" />
              <span>ADMIN LOGIN</span>
              <span>➔</span>
            </>
          )}
        </Link>
      </div>
    </footer>
  );
}
