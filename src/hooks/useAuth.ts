// src/hooks/useAuth.ts
// Hook for consuming auth state atoms and Firebase auth actions
'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import {
  adminUserAtom,
  authLoadingAtom,
  AdminUser,
} from '@/store/authAtom';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const STORAGE_KEY = 'portfolio_admin_user';

const persistUser = (user: AdminUser | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Failed to persist user session:', e);
  }
};

export const useAuth = () => {
  const user = useAtomValue(adminUserAtom);
  const loading = useAtomValue(authLoadingAtom);
  const setUser = useSetAtom(adminUserAtom);

  const loginWithEmail = async (email: string, pass: string): Promise<AdminUser> => {
    if (!auth?.app) {
      throw new Error('Firebase Auth가 올바르게 초기화되지 않았습니다.');
    }
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const adminData: AdminUser = {
      email: cred.user.email,
      displayName: cred.user.displayName,
      uid: cred.user.uid,
    };
    setUser(adminData);
    persistUser(adminData);
    return adminData;
  };

  const loginWithGoogle = async (): Promise<AdminUser> => {
    if (!auth?.app) {
      throw new Error('Firebase Auth가 올바르게 초기화되지 않았습니다. 환경변수를 확인해주세요.');
    }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    const adminData: AdminUser = {
      email: cred.user.email,
      displayName: cred.user.displayName,
      uid: cred.user.uid,
    };
    setUser(adminData);
    persistUser(adminData);
    return adminData;
  };

  const logout = async () => {
    try {
      if (auth?.app) {
        await signOut(auth);
      }
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    setUser(null);
    persistUser(null);
  };

  return { user, loading, loginWithEmail, loginWithGoogle, logout };
};
