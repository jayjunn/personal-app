// src/store/languageAtom.ts
// Jotai atoms for language and UI modal state
// Uses localStorage persistence via atomWithStorage

import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export type LanguageType = 'ENGLISH' | 'KOREAN';

const STORAGE_KEY = 'portfolio_language';

// Detect initial language from browser locale if no stored preference
const detectInitialLanguage = (): LanguageType => {
  if (typeof window === 'undefined') return 'ENGLISH';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'ENGLISH' || saved === 'KOREAN') return saved;
    const browserLang = navigator.language?.toLowerCase() || '';
    return browserLang.startsWith('ko') ? 'KOREAN' : 'ENGLISH';
  } catch {
    return 'ENGLISH';
  }
};

/** Primary language atom — persisted to localStorage */
export const languageAtom = atomWithStorage<LanguageType>(
  STORAGE_KEY,
  detectInitialLanguage(),
  createJSONStorage(() => {
    if (typeof window === 'undefined') {
      // SSR safe no-op storage
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      };
    }
    return localStorage;
  }),
  { getOnInit: true }
);

/** Derived read-only atom: true when language is ENGLISH */
export const isEnglishAtom = atom((get) => get(languageAtom) === 'ENGLISH');

/** Controls the first-visit language selection modal */
export const isLanguageModalOpenAtom = atom(false);
