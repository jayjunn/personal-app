'use client';

import React, { createContext, useContext, useState } from 'react';
import { COOKIE_NAME, LanguageType } from '@/constants/language';
import { translations, TranslationsType } from '@/constants/translations';

export { COOKIE_NAME, type LanguageType, type TranslationsType };

interface LanguageContextType {
  language: LanguageType;
  isEnglish: boolean;
  t: TranslationsType;
  setLanguage: (lang: LanguageType) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: LanguageType;
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState<LanguageType>(initialLanguage);

  const setLanguage = (lang: LanguageType) => {
    // 1. Instant client state update (0ms latency)
    setLanguageState(lang);

    // 2. Instant client cookie & localStorage write
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(COOKIE_NAME, lang);
        document.cookie = `${COOKIE_NAME}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
      } catch (e) {
        console.warn('Local storage error:', e);
      }

      // 3. Server-side Cookie synchronization
      fetch('/api/language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang }),
      }).catch((e) => console.warn('Server cookie sync error:', e));
    }
  };

  const toggleLanguage = () => {
    const nextLang: LanguageType = language === 'ENGLISH' ? 'KOREAN' : 'ENGLISH';
    setLanguage(nextLang);
  };

  const isEnglish = language === 'ENGLISH';
  const t = isEnglish ? translations.en : translations.kr;

  return (
    <LanguageContext.Provider
      value={{
        language,
        isEnglish,
        t,
        setLanguage,
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'KOREAN' as LanguageType,
      isEnglish: false,
      t: translations.kr,
      setLanguage: () => {},
      toggleLanguage: () => {},
    };
  }
  return context;
}
