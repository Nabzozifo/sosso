import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCookieConsent } from '../contexts/CookieConsentContext';

const CookieBanner = () => {
  const { consent, shouldShowBanner, acceptAll, rejectAll, savePreferences } = useCookieConsent();
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState({ necessary: true, preferences: false, statistics: false, marketing: false });

  useEffect(() => {
    if (consent && consent.preferences) {
      setPrefs({ ...consent.preferences });
    }
  }, [consent]);

  if (!shouldShowBanner) return null;

  const handleSave = () => {
    savePreferences(prefs);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="fixed bottom-4 left-4 right-4 z-50"
      >
        <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">Cookies et confidentialité</h3>
              <p className="text-sm text-gray-600 mt-1">
                Nous utilisons des cookies indispensables pour assurer le bon fonctionnement du site (authentification, sécurité).
                Vous pouvez accepter tous les cookies, les refuser, ou personnaliser vos préférences. Consultez notre{' '}
                <Link to="/privacy" className="text-emerald-700 hover:underline">Politique de confidentialité</Link> et nos{' '}
                <Link to="/terms" className="text-emerald-700 hover:underline">Conditions d’utilisation</Link>.
              </p>
              {open && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-start gap-3 border rounded-xl p-3">
                    <input type="checkbox" checked readOnly className="mt-1" />
                    <div>
                      <span className="font-medium text-gray-800">Cookies nécessaires</span>
                      <p className="text-sm text-gray-600">Obligatoires au fonctionnement du site (sécurité, session, langue). Toujours activés.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 border rounded-xl p-3">
                    <input
                      type="checkbox"
                      checked={prefs.preferences}
                      onChange={(e) => setPrefs((p) => ({ ...p, preferences: e.target.checked }))}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium text-gray-800">Préférences</span>
                      <p className="text-sm text-gray-600">Sauvegarder vos paramètres non essentiels (thème, affichages, confort).</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 border rounded-xl p-3">
                    <input
                      type="checkbox"
                      checked={prefs.statistics}
                      onChange={(e) => setPrefs((p) => ({ ...p, statistics: e.target.checked }))}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium text-gray-800">Statistiques</span>
                      <p className="text-sm text-gray-600">Mesurer l’usage pour améliorer le site (aucun tracking marketing).</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 border rounded-xl p-3">
                    <input
                      type="checkbox"
                      checked={prefs.marketing}
                      onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium text-gray-800">Marketing</span>
                      <p className="text-sm text-gray-600">Activer de possibles cookies publicitaires ou de retargeting.</p>
                    </div>
                  </label>
                </div>
              )}
            </div>

            <div className="flex sm:flex-col gap-2 sm:w-48">
              <button onClick={acceptAll} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl px-4 py-2">Accepter tout</button>
              <button onClick={rejectAll} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl px-4 py-2">Refuser</button>
              <button onClick={() => setOpen((v) => !v)} className="w-full bg-white border hover:bg-gray-50 text-gray-800 font-semibold rounded-xl px-4 py-2">{open ? 'Masquer' : 'Personnaliser'}</button>
              {open && (
                <button onClick={handleSave} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl px-4 py-2">Enregistrer</button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieBanner;