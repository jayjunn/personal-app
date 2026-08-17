'use client';

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

export type LanguageType = 'ENGLISH' | 'KOREAN';

export type LanguageContextState = {
  language: LanguageType;
};

type UserContextType = {
  user: LanguageContextState;
  setUser: (user: LanguageContextState) => void;
  setLanguage: (lang: LanguageType) => void;
  toggleLanguage: () => void;
  isEnglish: boolean;
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
  openLanguageModal: () => void;
};

const STORAGE_KEY = 'portfolio_language';

const UserContext = createContext<UserContextType>({
  user: { language: 'ENGLISH' },
  setUser: () => {},
  setLanguage: () => {},
  toggleLanguage: () => {},
  isEnglish: true,
  isLanguageModalOpen: false,
  setIsLanguageModalOpen: () => {},
  openLanguageModal: () => {},
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageType>('ENGLISH');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check localStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'ENGLISH' || saved === 'KOREAN') {
        setLanguageState(saved);
      } else {
        // First time visitor -> Open language selection popup!
        setIsLanguageModalOpen(true);
        // Default based on browser locale
        const browserLang = navigator.language?.toLowerCase() || '';
        if (browserLang.startsWith('ko')) {
          setLanguageState('KOREAN');
        } else {
          setLanguageState('ENGLISH');
        }
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const toggleLanguage = () => {
    const nextLang: LanguageType = language === 'ENGLISH' ? 'KOREAN' : 'ENGLISH';
    setLanguage(nextLang);
  };

  const openLanguageModal = () => {
    setIsLanguageModalOpen(true);
  };

  const setUser = (newUser: LanguageContextState) => {
    if (newUser.language === 'ENGLISH' || newUser.language === 'KOREAN') {
      setLanguage(newUser.language);
    }
  };

  const user = useMemo(() => ({ language }), [language]);
  const isEnglish = language === 'ENGLISH';

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      setLanguage,
      toggleLanguage,
      isEnglish,
      isLanguageModalOpen,
      setIsLanguageModalOpen,
      openLanguageModal,
    }),
    [user, isEnglish, isLanguageModalOpen]
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);
