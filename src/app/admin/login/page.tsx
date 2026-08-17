'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const { user, loading, loginWithEmail, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      await loginWithEmail(email, password);
      router.push('/admin');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setErrorMsg('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMsg('로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setErrorMsg(err.message || '로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setSubmitting(true);
    try {
      const loggedUser = await loginWithGoogle();
      if (loggedUser) {
        router.push('/admin');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('로그인 팝업창이 닫혔습니다. 다시 시도해주세요.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setErrorMsg('Firebase 콘솔에서 Google 로그인이 활성화되어 있지 않습니다. Authentication > Sign-in method에서 Google을 활성화해주세요.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setErrorMsg('현재 도메인이 Firebase 승인 도메인에 등록되어 있지 않습니다. (Firebase 콘솔 > Authentication > Settings > Authorized domains 확인 필요)');
      } else {
        setErrorMsg(err.message || 'Google 로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="brutal-card w-full max-w-md bg-[#f2eee0] p-6 md:p-8">
        <div className="border-b-2 border-black pb-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold bg-black text-[#e7e2d0] px-2 py-0.5">
              ADMIN CONSOLE
            </span>
            <Link href="/" className="text-xs font-bold underline hover:text-gray-600">
              ← 메인으로 돌아가기
            </Link>
          </div>
          <h1 className="text-2xl font-bold uppercase mt-3">관리자 로그인</h1>
          <p className="text-xs text-gray-700 mt-1">포트폴리오 및 CV 콘텐츠 수정을 위해 로그인해주세요.</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 border-2 border-black text-red-900 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">이메일 (Email)</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full p-3 bg-white border-2 border-black text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">비밀번호 (Password)</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-white border-2 border-black text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full brutal-btn py-3 text-sm mt-2">
            {submitting ? '로그인 중...' : '로그인 (Login)'}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-black/30"></div>
          <span className="px-3 text-xs font-bold text-gray-600 uppercase">또는</span>
          <div className="flex-1 border-t border-black/30"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={submitting}
          className="w-full p-3 bg-white border-2 border-black font-bold text-xs uppercase flex items-center justify-center gap-2 hover:bg-black hover:text-[#e7e2d0] transition-colors shadow-[2px_2px_0px_#0c0c0c]">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google 계정으로 로그인
        </button>
      </div>
    </div>
  );
}
