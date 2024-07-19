'use client';

import { createContext, useContext, useState, ReactElement, ReactNode, useEffect } from 'react';
import { json } from 'stream/consumers';

interface IUserContextProvider {
  children: ReactElement | ReactElement[] | ReactNode | ReactNode[];
}

type LanguageContextState = { language: string };

const languageDefaultValue = {
  user: { language: 'ENGLISH' },
  setUser: (user: LanguageContextState) => {},
  isEnglish: true,
};

const userContext = createContext(languageDefaultValue);

export function UserContextProvider({ children }: IUserContextProvider) {
  const [user, setUser] = useState(languageDefaultValue.user);
  const isEnglish = user?.language === 'ENGLISH';

  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
  }, []);

  return (
    <userContext.Provider
      value={{
        user,
        setUser,
        isEnglish,
      }}>
      {children}
    </userContext.Provider>
  );
}

export function useUserContext() {
  return useContext(userContext);
}
