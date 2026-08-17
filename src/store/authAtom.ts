// src/store/authAtom.ts
// Jotai atoms for Firebase admin authentication state

import { atom } from 'jotai';

export interface AdminUser {
  email: string | null;
  displayName: string | null;
  uid: string;
}

/** Current authenticated admin user, null if not logged in */
export const adminUserAtom = atom<AdminUser | null>(null);

/** True while Firebase onAuthStateChanged has not yet resolved */
export const authLoadingAtom = atom<boolean>(true);
