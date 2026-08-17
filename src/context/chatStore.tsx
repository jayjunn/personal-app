// src/context/chatStore.ts
import { atom } from 'jotai';

// 챗봇이 열려있는지(true) 닫혀있는지(false) 확인하는 상태
export const isChatOpenAtom = atom<boolean>(false);