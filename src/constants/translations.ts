import enMessages from '@/messages/en.json';
import koMessages from '@/messages/ko.json';

export const translations = {
  en: enMessages,
  kr: koMessages,
};

export type TranslationsType = typeof enMessages;
