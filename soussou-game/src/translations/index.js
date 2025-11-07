import { fr } from './fr';
import { en } from './en';

export const translations = {
  fr,
  en
};

export const getTranslation = (language, key) => {
  return translations[language]?.[key] || translations['fr'][key] || key;
};

export const availableLanguages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' }
];