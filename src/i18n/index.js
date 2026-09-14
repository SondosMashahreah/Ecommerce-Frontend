import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ar from './ar.json';
import { readPreference, savePreference } from '../preferences/storage';

function browserLanguage() {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return languages.some((language) => String(language).toLowerCase().startsWith('ar')) ? 'ar' : 'en';
}

function applyLanguage(language) {
  const lang = language === 'ar' ? 'ar' : 'en';
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  savePreference('store.language', lang);
}
i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: readPreference('store.language', browserLanguage(), ['en', 'ar']),
  fallbackLng: 'en', supportedLngs: ['en', 'ar'],
  keySeparator: false, nsSeparator: false,
  interpolation: { escapeValue: false },
  returnNull: false,
});
applyLanguage(i18n.language);
i18n.on('languageChanged', applyLanguage);
export const translate = (key, options) => i18n.t(key, options);
export const locale = () => i18n.language === 'ar' ? 'ar' : 'en-US';
export default i18n;
export function translateError(message) {
  if (!message) return '';
  const value = typeof message === 'string' ? message : '';
  if (i18n.exists(value)) return i18n.t(value);
  if (i18n.language !== 'ar' || /[\u0600-\u06ff]/.test(value)) return value;
  return i18n.t('Unexpected error. Please try again.');
}
