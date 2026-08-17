import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export interface ChatMessage {
  role: 'user' | 'gemini';
  text: string;
  timestamp?: number;
}

export const isChatOpenAtom = atom<boolean>(false);

// Safe storage adapter for SSR Next.js
const storage = createJSONStorage<ChatMessage[]>(() => {
  if (typeof window !== 'undefined') {
    return sessionStorage;
  }
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
});

export const chatMessagesAtom = atomWithStorage<ChatMessage[]>(
  'portfolio_chatbot_messages',
  [],
  storage,
  { getOnInit: true }
);
