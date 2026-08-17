'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageWrap from '@/components/common/PageWrap';
import styles from '@/app/styles/Admin.module.css';

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
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <span className={styles.adminBadge}>ADMIN CONTROL ACCESS</span>
            <h1 className={styles.headerTitle}>관리자 로그인</h1>
            <p className={styles.headerSubtitle}>
              포트폴리오 콘텐츠 및 이력서 수정을 위해 로그인해주세요.
            </p>
          </div>

          {errorMsg && (
            <div style={{ padding: '14px', backgroundColor: '#fee2e2', border: '2px solid #000', color: '#991b1b', fontSize: '13px', fontWeight: 700 }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || submitting}
            className={styles.googleBtn}>
            <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
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
            <span>{googleLoading ? '구글 계정 인증 중...' : 'Google 계정으로 빠른 로그인'}</span>
            <span>➔</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1, borderTop: '2px solid rgba(0,0,0,0.3)' }}></div>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#555' }}>
              또는 이메일 로그인
            </span>
            <div style={{ flex: 1, borderTop: '2px solid rgba(0,0,0,0.3)' }}></div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className={styles.formGroup} style={{ margin: 0 }}>
              <label className={styles.label}>이메일 주소 (Email)</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup} style={{ margin: 0 }}>
              <label className={styles.label}>비밀번호 (Password)</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={styles.input}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || googleLoading}
              className={styles.btnPrimary}
              style={{ width: '100%', padding: '14px', marginTop: '6px' }}>
              {submitting ? '로그인 처리 중...' : '이메일로 로그인 ➔'}
            </button>
          </form>
        </div>
      </div>
    </PageWrap>
  );
}
