'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/authContext';

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="w-full mt-16 border-t-2 border-black pt-6 pb-12 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
      <div className="flex flex-col md:flex-row items-center gap-2 text-center md:text-left text-neutral-800">
        <span className="font-bold tracking-wider">© {new Date().getFullYear()} YOUNGGEUN JUN.</span>
        <span className="hidden md:inline text-neutral-500">•</span>
        <span className="text-neutral-600">ALL RIGHTS RESERVED.</span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="group inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-black font-bold uppercase text-[11px] shadow-[2px_2px_0px_#000000] hover:bg-black hover:text-[#e7e2d0] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          title="관리자 페이지로 이동">
          {user ? (
            <>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>ADMIN PANEL ({user.email?.split('@')[0] || 'ADMIN'})</span>
              <span className="group-hover:translate-x-0.5 transition-transform">➔</span>
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
              <span className="group-hover:translate-x-0.5 transition-transform">➔</span>
            </>
          )}
        </Link>
      </div>
    </footer>
  );
}
