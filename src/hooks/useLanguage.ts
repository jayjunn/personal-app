// src/hooks/useLanguage.ts
// Convenience hook for consuming and updating language atoms in components
'use client';

import { useAtom, useAtomValue } from 'jotai';
import {
  languageAtom,
  isEnglishAtom,
  isLanguageModalOpenAtom,
  LanguageType,
  STORAGE_KEY,
} from '@/store/languageAtom';

export type { LanguageType };

export const useLanguage = () => {
  const [language, setLanguageAtom] = useAtom(languageAtom);
  const isEnglish = useAtomValue(isEnglishAtom);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useAtom(isLanguageModalOpenAtom);

  const setLanguage = (lang: LanguageType) => {
    setLanguageAtom(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {
        console.warn('Failed to save language to localStorage:', e);
      }
    }
  };

  const toggleLanguage = () => {
    const nextLang: LanguageType = language === 'ENGLISH' ? 'KOREAN' : 'ENGLISH';
    setLanguage(nextLang);
  };

  const openLanguageModal = () => setIsLanguageModalOpen(true);
  const closeLanguageModal = () => setIsLanguageModalOpen(false);

  return {
    language,
    isEnglish,
    isLanguageModalOpen,
    setLanguage,
    toggleLanguage,
    openLanguageModal,
    closeLanguageModal,
    setIsLanguageModalOpen,
  };
};
