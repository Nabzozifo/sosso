import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'cookieConsent';

// Forme par défaut des préférences lorsqu'elles sont décidées
const defaultPreferences = {
  necessary: true,      // cookies techniques indispensables (auth, sécurité)
  preferences: false,   // langue, thèmes, etc.
  statistics: false,    // analytics
  marketing: false,     // tracking publicitaire
};

const CookieConsentContext = createContext(null);

export const CookieConsentProvider = ({ children }) => {
  const [consent, setConsent] = useState(null); // null = non décidé

  // Charger depuis localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      // Validation minimale de forme
      if (parsed && typeof parsed === 'object' && 'preferences' in parsed) {
        setConsent(parsed);
      }
    } catch (_) {
      // ignorer
    }
  }, []);

  // Persister lors des changements
  useEffect(() => {
    if (consent) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
      } catch (_) {
        // ignorer
      }
    }
  }, [consent]);

  const acceptAll = () => {
    setConsent({
      preferences: { ...defaultPreferences, preferences: true, statistics: true, marketing: true },
      decided: true,
      updatedAt: new Date().toISOString(),
    });
  };

  const rejectAll = () => {
    setConsent({
      preferences: { ...defaultPreferences, preferences: false, statistics: false, marketing: false },
      decided: true,
      updatedAt: new Date().toISOString(),
    });
  };

  const savePreferences = (prefs) => {
    const merged = { ...defaultPreferences, ...prefs };
    setConsent({
      preferences: merged,
      decided: true,
      updatedAt: new Date().toISOString(),
    });
  };

  const resetConsent = () => {
    setConsent(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  };

  const shouldShowBanner = useMemo(() => !consent || !consent.decided, [consent]);

  return (
    <CookieConsentContext.Provider value={{ consent, setConsent, acceptAll, rejectAll, savePreferences, resetConsent, shouldShowBanner }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => useContext(CookieConsentContext);