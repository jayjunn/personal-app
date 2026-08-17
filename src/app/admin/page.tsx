'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileEditor from '@/components/admin/ProfileEditor';
import ExperienceEditor from '@/components/admin/ExperienceEditor';
import WorksEditor from '@/components/admin/WorksEditor';
import CvEditor from '@/components/admin/CvEditor';
import { seedInitialData } from '@/service/portfolioService';

type TabType = 'profile' | 'experience' | 'works' | 'cv';

export default function AdminDashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [seeding, setSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const handleSeedData = async () => {
    if (
      !confirm(
        '기존 data.js 파일의 기본 데이터(Profile, Experience, Works)를 Firestore에 초기 데이터로 주입하시겠습니까?'
      )
    ) {
      return;
    }

    setSeeding(true);
    setSeedNotice(null);
    try {
      await seedInitialData();
      setSeedNotice('기존 data.js의 초기 데이터가 Firestore에 성공적으로 동기화되었습니다! 새로고침하여 확인해보세요.');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      console.error(err);
      alert('데이터 주입 실패: ' + (err.message || '오류 발생'));
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="brutal-card p-6 bg-[#f2eee0] max-w-sm text-center">
          <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="font-bold text-sm">관리자 세션 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="brutal-card p-6 bg-[#f2eee0] max-w-sm text-center">
          <p className="font-bold text-sm mb-3">관리자 로그인이 필요합니다.</p>
          <Link
            href="/admin/login"
            className="brutal-btn w-full py-2 text-xs">
            로그인 페이지로 이동 →
          </Link>
        </div>
      </div>
    );
  }

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
            title="data.js에 하드코딩된 기본 데이터를 Firestore에 한 번에 등록합니다."
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
