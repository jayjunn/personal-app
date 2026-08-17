'use client';

// LanguageInitializer: runs client-side on mount to show the first-visit language modal.
// Replaces the useEffect logic that was in UserContextProvider.

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { isLanguageModalOpenAtom } from '@/store/languageAtom';

const STORAGE_KEY = 'portfolio_language';

export default function LanguageInitializer() {
  const setIsLanguageModalOpen = useSetAtom(isLanguageModalOpenAtom);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setIsLanguageModalOpen(true);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [setIsLanguageModalOpen]);

  return null; // renders nothing, just side effects
}
