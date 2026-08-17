'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import PageWrap from '@/components/common/PageWrap';
import { GoogleIcon } from '@/components/icons';

export default function AdminLoginPage() {
  const { user, loading, loginWithEmail, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
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
    setGoogleLoading(true);
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
      } else if (err.code === 'auth/popup-blocked') {
        setErrorMsg('브라우저에서 팝업창이 차단되었습니다. 팝업 차단을 해제한 후 다시 시도해주세요.');
      } else {
        setErrorMsg(err.message || 'Google 로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <PageWrap title="ADMIN LOGIN" moreLink="/" moreText="← BACK TO HOME">
      <div className="py-10 flex justify-center items-center w-full">
        <div className="w-full max-w-[480px] bg-white border-[3px] border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000000] flex flex-col gap-5">
          <div className="text-center flex flex-col items-center gap-2">
            <span className="px-3 py-1 bg-black text-[#e7e2d0] font-mono font-bold text-xs">
              ADMIN CONTROL ACCESS
            </span>
            <h1 className="text-2xl font-black uppercase tracking-tight m-0">관리자 로그인</h1>
            <p className="text-xs text-neutral-600 font-semibold m-0">
              포트폴리오 콘텐츠 및 이력서 수정을 위해 로그인해주세요.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-rose-100 border-2 border-black text-rose-900 text-xs font-bold">
              ⚠️ {errorMsg}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || submitting}
            className="w-full p-4 bg-white border-[2.5px] border-black text-black font-extrabold text-sm uppercase flex items-center justify-between shadow-[3px_3px_0px_#000000] hover:bg-neutral-100 transition-colors cursor-pointer disabled:opacity-50">
            <GoogleIcon className="w-5 h-5" />
            <span>{googleLoading ? '구글 계정 인증 중...' : 'Google 계정으로 빠른 로그인'}</span>
            <span>➔</span>
          </button>

          <div className="flex items-center gap-2.5 my-1">
            <div className="flex-1 border-t-2 border-black/20" />
            <span className="text-xs font-bold uppercase text-neutral-500">
              또는 이메일 로그인
            </span>
            <div className="flex-1 border-t-2 border-black/20" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-black uppercase">이메일 주소 (Email)</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full p-3 bg-[#fbf9f4] border-2 border-black text-sm font-semibold outline-none focus:bg-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-black uppercase">비밀번호 (Password)</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-[#fbf9f4] border-2 border-black text-sm font-semibold outline-none focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || googleLoading}
              className="w-full py-3.5 mt-2 bg-black text-[#e7e2d0] border-2 border-black font-black text-sm uppercase cursor-pointer hover:bg-neutral-800 transition-colors shadow-[3px_3px_0px_#000000] disabled:opacity-50">
              {submitting ? '로그인 처리 중...' : '이메일로 로그인 ➔'}
            </button>
          </form>
        </div>
      </div>
    </PageWrap>
  );
}
