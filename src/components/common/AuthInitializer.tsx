'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useSetAtom } from 'jotai';
import { adminUserAtom, authLoadingAtom, AdminUser } from '@/store/authAtom';

const STORAGE_KEY = 'portfolio_admin_user';

const getInitialUser = (): AdminUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) return JSON.parse(cached);
  } catch (e) {
    console.warn('Failed to read cached user session:', e);
  }
  return null;
};

export default function AuthInitializer() {
  const setUser = useSetAtom(adminUserAtom);
  const setLoading = useSetAtom(authLoadingAtom);

  useEffect(() => {
    // Hydrate from localStorage immediately to avoid flash
    const cached = getInitialUser();
    if (cached) setUser(cached);

    if (!auth?.app) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (currentUser) => {
          if (currentUser) {
            const adminData: AdminUser = {
              email: currentUser.email,
              displayName: currentUser.displayName,
              uid: currentUser.uid,
            };
            setUser(adminData);
            if (typeof window !== 'undefined') {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(adminData));
            }
          } else {
            setUser(null);
            if (typeof window !== 'undefined') {
              localStorage.removeItem(STORAGE_KEY);
            }
          }
          setLoading(false);
        },
        (error) => {
          console.warn('Firebase onAuthStateChanged error:', error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase auth listener error:', err);
      setLoading(false);
    }
  }, [setUser, setLoading]);

  return null;
}
