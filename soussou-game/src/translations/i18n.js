import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import des traductions
import { fr } from './fr';
import { en } from './en';

// Configuration d'i18next
i18n
  .use(LanguageDetector) // Détection automatique de la langue du navigateur
  .use(initReactI18next) // Passe init i18next à react-i18next
  .init({
    resources: {
      fr: {
        translation: fr
      },
      en: {
        translation: en
      }
    },
    fallbackLng: 'fr', // Langue par défaut
    debug: false, // Mode debug désactivé en production
    
    // Options de détection de langue
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    
    interpolation: {
      escapeValue: false // React s'occupe déjà de l'échappement
    }
  });

export default i18n;