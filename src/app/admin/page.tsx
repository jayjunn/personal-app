'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import PageWrap from '@/components/common/PageWrap';
import ProfileEditor from '@/components/admin/ProfileEditor';
import ExperienceEditor from '@/components/admin/ExperienceEditor';
import WorksEditor from '@/components/admin/WorksEditor';
import CvEditor from '@/components/admin/CvEditor';
import { seedInitialData } from '@/service/portfolioService';

type TabType = 'profile' | 'experience' | 'works' | 'cv';

export default function AdminDashboardPage() {
  const { user, loginWithGoogle, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [seeding, setSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const handleGoogleLoginDirect = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        alert('환경변수 오류: Firebase API Key가 로드되지 않았습니다. .env.local 설정을 확인해주세요.');
        return;
      }

      setLoggingIn(true);
      setLoginError(null);
      await loginWithGoogle();
    } catch (err: any) {
      console.error(err);
      let errorMsg = err.message || 'Google 로그인 중 오류가 발생했습니다.';
      if (err.code === 'auth/popup-closed-by-user') {
        errorMsg = '로그인 팝업창이 닫혔습니다. 다시 시도해주세요.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMsg = 'Firebase 콘솔에서 Google 로그인이 활성화되어 있지 않습니다. Authentication > Sign-in method에서 Google을 켜주세요.';
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMsg = '현재 도메인이 Firebase 승인 도메인에 등록되어 있지 않습니다. (Firebase 콘솔 > Authentication > Settings > Authorized domains 에 도메인을 추가해주세요)';
      } else if (err.code === 'auth/popup-blocked') {
        errorMsg = '브라우저에서 팝업창이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해주세요.';
      }
      setLoginError(`[${err.code || 'Error'}] ${errorMsg}`);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleSeedData = async () => {
    if (
      !confirm(
        '기존 portfolioData.ts 파일의 기본 데이터(Profile, Experience, Works)를 Firestore에 초기 데이터로 주입하시겠습니까?'
      )
    ) {
      return;
    }

    setSeeding(true);
    setSeedNotice(null);
    try {
      await seedInitialData();
      setSeedNotice('초기 데이터가 Firestore에 성공적으로 동기화되었습니다! 새로고침하여 확인해보세요.');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      console.error(err);
      alert('데이터 주입 실패: ' + (err.message || '오류 발생'));
    } finally {
      setSeeding(false);
    }
  };

  // If unauthenticated, show login card
  if (!user) {
    return (
      <PageWrap title="ADMIN CONSOLE" moreLink="/" moreText="← BACK TO HOME">
        <div className="py-10 flex justify-center items-center w-full">
          <div className="w-full max-w-[480px] bg-white border-[3px] border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000000] flex flex-col gap-5">
            <div className="text-center flex flex-col items-center gap-2">
              <span className="px-3 py-1 bg-black text-[#e7e2d0] font-mono font-bold text-xs">
                ADMIN ACCESS
              </span>
              <h1 className="text-2xl font-black uppercase tracking-tight m-0">관리자 로그인</h1>
              <p className="text-xs text-neutral-600 font-semibold m-0">
                포트폴리오 콘텐츠 및 이력서 수정을 위해 로그인해주세요.
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 bg-rose-100 border-2 border-black text-rose-900 text-xs font-bold">
                ⚠️ {loginError}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLoginDirect}
              disabled={loggingIn}
              className="w-full p-4 bg-white border-[2.5px] border-black text-black font-extrabold text-sm uppercase flex items-center justify-between shadow-[3px_3px_0px_#000000] hover:bg-neutral-100 transition-colors cursor-pointer disabled:opacity-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loggingIn ? '구글 로그인 중...' : 'Google 계정으로 빠른 로그인'}</span>
              <span>➔</span>
            </button>

            <div className="text-center mt-2">
              <Link
                href="/admin/login"
                className="text-xs font-bold text-neutral-800 underline hover:text-black">
                이메일 / 비밀번호로 로그인하기 ➔
              </Link>
            </div>
          </div>
        </div>
      </PageWrap>
    );
  }

  // Authenticated Dashboard View
  return (
    <PageWrap title="ADMIN CONSOLE">
      <div className="mt-6 flex flex-col gap-6 w-full">
        {/* Top Header Card */}
        <div className="border-[3px] border-black bg-white p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-[4px_4px_0px_#000000]">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-black text-[#e7e2d0] font-mono font-black text-xs uppercase">
                ADMIN CONTROL PANEL
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-100 border border-black text-emerald-900 font-mono font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {user.email || user.displayName || 'ADMIN'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight m-0">
              포트폴리오 콘텐츠 관리 시스템
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 font-semibold m-0">
              수정한 내용은 저장 즉시 포트폴리오 웹사이트에 반영됩니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            <button
              type="button"
              disabled={seeding}
              onClick={handleSeedData}
              title="기본 데이터를 Firestore에 한 번에 등록합니다."
              className="px-3.5 py-2 bg-blue-600 text-white border-2 border-black font-extrabold text-xs uppercase cursor-pointer hover:bg-blue-700 transition-colors shadow-[2px_2px_0px_#000000] disabled:opacity-50">
              {seeding ? '주입 중...' : '⚡ 초기 데이터 동기화 (Seed)'}
            </button>
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 bg-white text-black border-2 border-black font-extrabold text-xs uppercase cursor-pointer hover:bg-neutral-100 transition-colors shadow-[2px_2px_0px_#000000] no-underline">
              🌐 웹사이트 보기 ↗
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 text-white border-2 border-black font-extrabold text-xs uppercase cursor-pointer hover:bg-rose-700 transition-colors shadow-[2px_2px_0px_#000000]"
              title="관리자 세션을 종료하고 로그아웃합니다.">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>로그아웃</span>
            </button>
          </div>
        </div>

        {seedNotice && (
          <div className="p-4 bg-emerald-100 border-2 border-black text-emerald-900 font-bold text-xs sm:text-sm flex items-center gap-2">
            <span>✅</span>
            <span>{seedNotice}</span>
          </div>
        )}

        {/* Tabs Navigation Bar */}
        <div className="flex flex-col gap-0 w-full">
          <div className="flex border-b-[3px] border-black flex-wrap bg-[#ded8c4]">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-4 sm:px-6 py-3 font-black text-xs sm:text-sm uppercase flex items-center gap-2 border-r-2 border-black cursor-pointer transition-colors ${
                activeTab === 'profile'
                  ? 'bg-black text-[#e7e2d0]'
                  : 'bg-transparent text-black hover:bg-black/10'
              }`}>
              <span>👤</span>
              <span>Profile (프로필)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('experience')}
              className={`px-4 sm:px-6 py-3 font-black text-xs sm:text-sm uppercase flex items-center gap-2 border-r-2 border-black cursor-pointer transition-colors ${
                activeTab === 'experience'
                  ? 'bg-black text-[#e7e2d0]'
                  : 'bg-transparent text-black hover:bg-black/10'
              }`}>
              <span>💼</span>
              <span>Experience (경력)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('works')}
              className={`px-4 sm:px-6 py-3 font-black text-xs sm:text-sm uppercase flex items-center gap-2 border-r-2 border-black cursor-pointer transition-colors ${
                activeTab === 'works'
                  ? 'bg-black text-[#e7e2d0]'
                  : 'bg-transparent text-black hover:bg-black/10'
              }`}>
              <span>🚀</span>
              <span>Works (프로젝트)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cv')}
              className={`px-4 sm:px-6 py-3 font-black text-xs sm:text-sm uppercase flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'cv'
                  ? 'bg-black text-[#e7e2d0]'
                  : 'bg-transparent text-black hover:bg-black/10'
              }`}>
              <span>📄</span>
              <span>CV / Resume 설정</span>
            </button>
          </div>

          {/* Tab Content Box */}
          <div className="border-[3px] border-t-0 border-black bg-[#e7e2d0] p-4 sm:p-6 shadow-[4px_4px_0px_#000000]">
            {activeTab === 'profile' && <ProfileEditor />}
            {activeTab === 'experience' && <ExperienceEditor />}
            {activeTab === 'works' && <WorksEditor />}
            {activeTab === 'cv' && <CvEditor />}
          </div>
        </div>
      </div>
    </PageWrap>
  );
}
