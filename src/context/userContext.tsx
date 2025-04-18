'use client';

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

type LanguageContextState = { language: string };

type UserContextType = {
  user: LanguageContextState;
  setUser: (user: LanguageContextState) => void;
  isEnglish: boolean;
};

const UserContext = createContext<UserContextType>({
  user: { language: 'ENGLISH' },
  setUser: () => {},
  isEnglish: true,
});

const getInitialLanguage = (): 'ENGLISH' | 'KOREAN' => {
  if (typeof window !== 'undefined') {
    const lang = navigator.language.toLowerCase();
    if (lang.startsWith('ko')) return 'KOREAN';
  }
  return 'ENGLISH';
};

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<LanguageContextState>({ language: getInitialLanguage() });

  const setUser = (user: LanguageContextState) => {
    setUserState(user);
  };

  const isEnglish = user.language === 'ENGLISH';

  const contextValue = useMemo(() => ({ user, setUser, isEnglish }), [user, isEnglish]);

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);
