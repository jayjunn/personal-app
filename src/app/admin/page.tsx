'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/authContext';
import Link from 'next/link';
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
  const [passcode, setPasscode] = useState('');
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
        errorMsg = '현재 도메인이 Firebase 승인 도메인에 등록되어 있지 않습니다.';
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

  // If unauthenticated, show fast login card immediately
  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="brutal-card p-6 md:p-8 bg-[#f2eee0] max-w-md w-full text-center">
          <div className="border-b-2 border-black pb-3 mb-5">
            <span className="text-xs font-mono font-bold bg-black text-[#e7e2d0] px-2 py-0.5">
              ADMIN ACCESS
            </span>
            <h2 className="text-2xl font-bold uppercase mt-2">관리자 로그인</h2>
            <p className="text-xs text-gray-700 mt-1">포트폴리오 콘텐츠 수정을 위해 관리자로 로그인해주세요.</p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 bg-red-100 border-2 border-red-500 text-red-900 text-xs font-bold text-left break-all">
              ⚠️ 로그인 실패: {loginError}
              <div className="mt-2 text-[10px] text-gray-600 font-normal">
                에러 메시지를 복사해서 개발자(Antigravity)에게 알려주시면 바로 해결해 드립니다.
              </div>
            </div>
          )}

          {/* Google Login Button */}
          <button
            type="button"
            disabled={loggingIn}
            onClick={handleGoogleLoginDirect}
            className="w-full p-4 bg-white border-2 border-black font-bold text-sm uppercase flex items-center justify-center gap-3 hover:bg-black hover:text-[#e7e2d0] transition-colors shadow-[4px_4px_0px_#0c0c0c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#0c0c0c] mb-6 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg width="24" height="24" viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0">
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
            <span>{loggingIn ? '로그인 처리 중...' : 'Google 계정으로 로그인'}</span>
          </button>

          <Link
            href="/admin/login"
            className="block text-xs font-bold underline hover:text-gray-600 mt-2">
            이메일 / 비밀번호로 로그인하기 ➔
          </Link>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Admin Header Bar */}
      <div className="brutal-card bg-[#f2eee0] p-4 md:p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-black text-[#e7e2d0] px-2 py-0.5">
              ADMIN CONTROL PANEL
            </span>
            <span className="text-xs font-medium text-gray-700">
              로그인: <strong className="text-black">{user.email || user.displayName || '관리자'}</strong>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold uppercase mt-1">포트폴리오 콘텐츠 관리 시스템</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            disabled={seeding}
            onClick={handleSeedData}
            title="기본 데이터를 Firestore에 한 번에 등록합니다."
            className="px-3 py-2 border-2 border-black text-xs font-bold bg-blue-100 hover:bg-blue-200 flex items-center gap-1">
            {seeding ? '주입 중...' : '⚡ 초기 데이터 동기화 (Seed)'}
          </button>
          <Link
            href="/"
            target="_blank"
            className="px-3 py-2 border-2 border-black text-xs font-bold bg-white hover:bg-gray-100 flex items-center gap-1">
            🌐 웹사이트 보기 ↗
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-2 border-2 border-black text-xs font-bold bg-red-200 hover:bg-red-300">
            로그아웃
          </button>
        </div>
      </div>

      {seedNotice && (
        <div className="mb-6 p-4 border-2 border-black bg-green-100 text-green-900 font-bold text-sm">
          {seedNotice}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b-2 border-black mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-3 font-bold text-sm uppercase transition-all border-t-2 border-x-2 border-black -mb-[2px] ${
            activeTab === 'profile'
              ? 'bg-[#f2eee0] text-black border-b-2 border-b-[#f2eee0]'
              : 'bg-white/60 text-gray-700 hover:bg-white'
          }`}>
          👤 Profile (프로필)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('experience')}
          className={`px-5 py-3 font-bold text-sm uppercase transition-all border-t-2 border-x-2 border-black -mb-[2px] ${
            activeTab === 'experience'
              ? 'bg-[#f2eee0] text-black border-b-2 border-b-[#f2eee0]'
              : 'bg-white/60 text-gray-700 hover:bg-white'
          }`}>
          💼 Experience (경력)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('works')}
          className={`px-5 py-3 font-bold text-sm uppercase transition-all border-t-2 border-x-2 border-black -mb-[2px] ${
            activeTab === 'works'
              ? 'bg-[#f2eee0] text-black border-b-2 border-b-[#f2eee0]'
              : 'bg-white/60 text-gray-700 hover:bg-white'
          }`}>
          🚀 Works (프로젝트)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cv')}
          className={`px-5 py-3 font-bold text-sm uppercase transition-all border-t-2 border-x-2 border-black -mb-[2px] ${
            activeTab === 'cv'
              ? 'bg-[#f2eee0] text-black border-b-2 border-b-[#f2eee0]'
              : 'bg-white/60 text-gray-700 hover:bg-white'
          }`}>
          📄 CV / Resume 설정
        </button>
      </div>

      {/* Tab Contents */}
      <div>
        {activeTab === 'profile' && <ProfileEditor />}
        {activeTab === 'experience' && <ExperienceEditor />}
        {activeTab === 'works' && <WorksEditor />}
        {activeTab === 'cv' && <CvEditor />}
      </div>
    </div>
  );
}
