import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import detector from 'i18next-browser-languagedetector';


import en from './locales/en/defaults.json';
import ja from './locales/en/defaults.json';
import ko from './locales/en/defaults.json';
import cn from './locales/en/defaults.json';

declare global {
  interface Window {
    i18n: any;
  }
}

const resources = {
  en: {
    translation: en,
  },
  ja: {
    translation: ja,
  },
  ko: {
    translation: ko,
  },
  cn: {
    translation: cn,
  },
};

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: { default: ['en'] },
    nsSeparator: false,
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupCookie: 'i18n',
      lookupLocalStorage: 'i18BitsazoUser',
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;

window.i18n = i18n;

export function getCurrentLanguage() {
  return localStorage.getItem('i18BitsazoUser') || 'en';
}
