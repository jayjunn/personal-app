import { createContext, useContext, useState, ReactElement, ReactNode } from 'react';

interface IUserContextProvider {
  children: ReactElement | ReactElement[] | ReactNode | ReactNode[];
}

type LanguageContextState = { language: string };

const languageDefaultValue = {
  state: { language: 'ENGLISH' },
  setState: (state: LanguageContextState) => {},
};

const userContext = createContext(languageDefaultValue);

export function UserContextProvider({ children }: IUserContextProvider) {
  const [state, setState] = useState(languageDefaultValue.state);

  return (
    <userContext.Provider
      value={{
        state,
        setState,
      }}>
      {children}
    </userContext.Provider>
  );
}

export function useUserContext() {
  return useContext(userContext);
}
