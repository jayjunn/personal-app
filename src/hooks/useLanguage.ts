// src/hooks/useLanguage.ts
// Convenience hook for consuming language atoms in components
'use client';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  languageAtom,
  isEnglishAtom,
  isLanguageModalOpenAtom,
  LanguageType,
} from '@/store/languageAtom';

export type { LanguageType };

export const useLanguage = () => {
  const [language, setLanguageAtom] = useAtom(languageAtom);
  const isEnglish = useAtomValue(isEnglishAtom);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useAtom(isLanguageModalOpenAtom);

  const setLanguage = (lang: LanguageType) => {
    setLanguageAtom(lang);
  };

  const toggleLanguage = () => {
    setLanguageAtom((prev) => (prev === 'ENGLISH' ? 'KOREAN' : 'ENGLISH'));
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
