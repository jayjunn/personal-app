'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface AdminUser {
  email: string | null;
  displayName: string | null;
  uid: string;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<AdminUser>;
  loginWithGoogle: () => Promise<AdminUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithEmail: async () => ({} as AdminUser),
  loginWithGoogle: async () => ({} as AdminUser),
  logout: async () => { },
});

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

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(() => getInitialUser());
  const [loading, setLoading] = useState<boolean>(() => !getInitialUser());

  // Firebase Auth listener
  useEffect(() => {
    let timer: NodeJS.Timeout;

    timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (currentUser) => {
          clearTimeout(timer);
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
            if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
              setUser(null);
            }
          }
          setLoading(false);
        },
        (error) => {
          console.warn('Firebase onAuthStateChanged error:', error);
          clearTimeout(timer);
          setLoading(false);
        }
      );

      return () => {
        clearTimeout(timer);
        unsubscribe();
      };
    } catch (err) {
      console.warn('Firebase auth initialization error:', err);
    }
  }, []);

  const loginWithEmail = async (email: string, pass: string): Promise<AdminUser> => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const adminData: AdminUser = {
      email: cred.user.email,
      displayName: cred.user.displayName,
      uid: cred.user.uid,
    };
    setUser(adminData);
    setLoading(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adminData));
    }
    return adminData;
  };

  const loginWithGoogle = async (): Promise<AdminUser> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    const adminData: AdminUser = {
      email: cred.user.email,
      displayName: cred.user.displayName,
      uid: cred.user.uid,
    };
    setUser(adminData);
    setLoading(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adminData));
    }
    return adminData;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
