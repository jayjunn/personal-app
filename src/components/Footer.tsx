'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/authContext';

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer
      style={{
        width: '100%',
        marginTop: '30px',
        borderTop: '3px solid black',
        padding: '24px 30px 40px 30px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        fontSize: '12px',
        fontFamily: 'monospace',
        boxSizing: 'border-box',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 800, letterSpacing: '0.5px' }}>© {new Date().getFullYear()} YOUNGGEUN JUN.</span>
        <span style={{ color: '#888' }}>•</span>
        <span style={{ color: '#555' }}>ALL RIGHTS RESERVED.</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link
          href="/admin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            backgroundColor: '#ffffff',
            border: '2px solid #000000',
            fontWeight: 800,
            fontSize: '11px',
            textTransform: 'uppercase',
            textDecoration: 'none',
            color: '#000000',
            transition: 'all 0.2s ease',
          }}
          title="관리자 페이지로 이동">
          {user ? (
            <>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  display: 'inline-block',
                }}></span>
              <span>ADMIN PANEL ({user.email?.split('@')[0] || 'ADMIN'})</span>
              <span>➔</span>
            </>
          ) : (
            <>
              <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
