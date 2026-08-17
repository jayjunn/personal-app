// src/store/languageAtom.ts
// Jotai atoms for language and UI modal state
// Server-safe default with client-side hydration in LanguageInitializer

import { atom } from 'jotai';

export type LanguageType = 'ENGLISH' | 'KOREAN';

export const STORAGE_KEY = 'portfolio_language';

/** Primary language atom — defaults to ENGLISH for SSR hydration match */
export const languageAtom = atom<LanguageType>('ENGLISH');

/** Derived read-only atom: true when language is ENGLISH */
export const isEnglishAtom = atom((get) => get(languageAtom) === 'ENGLISH');

/** Controls the first-visit language selection modal */
export const isLanguageModalOpenAtom = atom<boolean>(false);
