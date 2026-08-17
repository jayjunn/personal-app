'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="w-full mt-8 border-t-[3px] border-black px-4 sm:px-8 py-6 sm:py-8 pb-10 flex flex-wrap items-center justify-between gap-3.5 text-xs font-mono box-border">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-extrabold tracking-tight">© {new Date().getFullYear()} YOUNGGEUN JUN.</span>
        <span className="text-neutral-400">•</span>
        <span className="text-neutral-600 font-semibold">ALL RIGHTS RESERVED.</span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border-2 border-black font-extrabold text-[11px] uppercase text-black hover:bg-black hover:text-[#e7e2d0] transition-colors shadow-[2px_2px_0px_#000000]"
          title="관리자 페이지로 이동">
          {user ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>ADMIN PANEL ({user.email?.split('@')[0] || 'ADMIN'})</span>
              <span>➔</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>ADMIN LOGIN</span>
              <span>➔</span>
            </>
          )}
        </Link>
      </div>
    </footer>
  );
}
