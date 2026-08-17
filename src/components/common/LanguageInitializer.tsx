'use client';

// LanguageInitializer: runs client-side on mount to hydrate saved language preference
// and optionally show the first-visit language modal.

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import {
  languageAtom,
  isLanguageModalOpenAtom,
  LanguageType,
  STORAGE_KEY,
} from '@/store/languageAtom';

export default function LanguageInitializer() {
  const setLanguage = useSetAtom(languageAtom);
  const setIsLanguageModalOpen = useSetAtom(isLanguageModalOpenAtom);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as LanguageType | null;
      if (saved === 'ENGLISH' || saved === 'KOREAN') {
        setLanguage(saved);
      } else {
        const browserLang = navigator.language?.toLowerCase() || '';
        const detected: LanguageType = browserLang.startsWith('ko') ? 'KOREAN' : 'ENGLISH';
        setLanguage(detected);
        setIsLanguageModalOpen(true);
      }
    } catch (e) {
      console.warn('LocalStorage error in LanguageInitializer:', e);
    }
  }, [setLanguage, setIsLanguageModalOpen]);

  return null;
}
