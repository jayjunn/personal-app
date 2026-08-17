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

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithEmail: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Safety fallback: Never stay stuck in loading state forever
    timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (currentUser) => {
          clearTimeout(timer);
          setUser(currentUser);
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

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
