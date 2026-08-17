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
  loginWithEmail: (email: string, pass: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithEmail: async () => ({} as User),
  loginWithGoogle: async () => ({} as User),
  logout: async () => {},
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => auth.currentUser);
  const [loading, setLoading] = useState<boolean>(() => !auth.currentUser);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Safety timeout: stop loading after 2.5s if Firebase auth is slow
    timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

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
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    setUser(cred.user);
    setLoading(false);
    return cred.user;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    setUser(cred.user);
    setLoading(false);
    return cred.user;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
