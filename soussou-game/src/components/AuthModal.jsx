import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle2, AlertCircle, ChevronDown, Search } from 'lucide-react';

const AuthModal = ({ open, onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Pays: chargement dynamique via REST Countries (noms FR si dispo)
  const [countryQuery, setCountryQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [countryOpen, setCountryOpen] = useState(false);
  const countryBoxRef = useRef(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,translations,cca2');
        const data = await res.json();
        const list = data.map(c => ({
          code: c.cca2,
          name: (c.translations?.fra?.common || c.name?.common || '').trim(),
        })).filter(c => c.name).sort((a, b) => a.name.localeCompare(b.name));
        setCountries(list);
      } catch (e) {
        // Fallback minimal si API indisponible
        setCountries([
          { code: 'FR', name: 'France' },
          { code: 'GN', name: 'Guinée' },
          { code: 'SN', name: 'Sénégal' },
          { code: 'CI', name: "Côte d'Ivoire" },
          { code: 'US', name: 'États-Unis' },
        ]);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (countryBoxRef.current && !countryBoxRef.current.contains(e.target)) {
        setCountryOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const filteredCountries = useMemo(() => {
    const q = countryQuery.toLowerCase();
    return countries.filter(c => c.name.toLowerCase().includes(q));
  }, [countries, countryQuery]);

  // Validation robuste du mot de passe
  const passwordChecks = useMemo(() => ({
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }), [password]);
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const isConfirmValid = confirmPassword && password === confirmPassword;

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);
    try {
      if (mode === 'register') {
        const newFieldErrors = {};
        if (!isPasswordValid) {
          newFieldErrors.password = 'Le mot de passe ne respecte pas les critères requis.';
        }
        if (!isConfirmValid) {
          newFieldErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
        }
        if (Object.keys(newFieldErrors).length > 0) {
          setFieldErrors(newFieldErrors);
          throw new Error('Validation échouée');
        }
        await register({ name, email, password, password_confirmation: confirmPassword, country });
      } else {
        await login({ email, password });
      }
      onClose?.();
    } catch (e) {
      setError('Échec de l\'authentification. Vérifiez vos informations.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md font-gilroy overflow-hidden">
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b bg-white/95 backdrop-blur">
          <h3 id="auth-modal-title" className="text-2xl font-bold">{mode === 'register' ? "Créer un compte" : "Se connecter"}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded" aria-label="Fermer la modale">✕</button>
        </div>
        <div className="flex gap-2 px-6 pt-4">
          <button className={`flex-1 px-3 py-2 rounded-lg border ${mode==='login'?'bg-gray-100 font-semibold':''}`} onClick={() => setMode('login')}>Connexion</button>
          <button className={`flex-1 px-3 py-2 rounded-lg border ${mode==='register'?'bg-gray-100 font-semibold':''}`} onClick={() => setMode('register')}>Inscription</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6 pt-4 max-h-[70vh] overflow-y-auto">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${fieldErrors.email? 'border-red-500 focus:ring-red-500':'focus:ring-emerald-500'}`} required />
            {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${mode==='register' && !isPasswordValid && password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-emerald-500'}`}
              required
              aria-invalid={mode==='register' && !isPasswordValid && password ? 'true':'false'}
            />
            {mode === 'register' && (
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <PasswordCheck label="≥ 8 caractères" ok={passwordChecks.length} />
                <PasswordCheck label="Majuscule" ok={passwordChecks.upper} />
                <PasswordCheck label="Minuscule" ok={passwordChecks.lower} />
                <PasswordCheck label="Chiffre" ok={passwordChecks.number} />
                <PasswordCheck label="Spécial" ok={passwordChecks.special} />
              </div>
            )}
            {fieldErrors.password && <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>}
          </div>
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
              <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${!isConfirmValid && confirmPassword? 'border-red-500 focus:ring-red-500':'focus:ring-emerald-500'}`} required aria-invalid={!isConfirmValid && confirmPassword ? 'true':'false'} />
              {!isConfirmValid && confirmPassword && <p className="mt-1 text-sm text-red-600">Les mots de passe ne correspondent pas.</p>}
            </div>
          )}

          {mode === 'register' && (
            <div ref={countryBoxRef}>
              <label className="block text-sm font-medium mb-1">Pays</label>
              <div className="relative">
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={country ? countries.find(c=>c.code===country)?.name || '' : ''}
                    onChange={(e)=>{ setCountry(''); setCountryQuery(e.target.value); }}
                    onFocus={()=> setCountryOpen(true)}
                    placeholder="Sélectionnez votre pays"
                    className="w-full outline-none"
                  />
                  <button type="button" onClick={()=> setCountryOpen(v=>!v)} className="text-gray-500">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                {countryOpen && (
                  <div className="absolute left-0 right-0 mt-2 max-h-56 overflow-auto border rounded-lg bg-white shadow-lg z-10">
                    {filteredCountries.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-500">Aucun résultat</div>
                    ) : (
                      filteredCountries.map((c) => (
                        <button key={c.code} type="button" onClick={()=>{ setCountry(c.code); setCountryQuery(''); setCountryOpen(false); }} className="w-full text-left px-3 py-2 hover:bg-emerald-50">
                          {c.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
                {fieldErrors.country && <p className="mt-1 text-sm text-red-600">{fieldErrors.country}</p>}
              </div>
            </div>
          )}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" disabled={loading || (mode==='register' && (!isPasswordValid || !isConfirmValid))} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-lg px-4 py-2 transition-colors">
            {loading ? 'Traitement...' : (mode === 'register' ? 'Créer mon compte' : 'Me connecter')}
          </button>
        </form>
        <p className="px-6 pb-6 text-xs text-gray-600">Vous pouvez jouer sans compte. L'inscription permet de sauvegarder votre progression et vos badges.</p>
      </motion.div>
    </div>
  );
};

export default AuthModal;

// Sous-composant: indicateur de critère mot de passe
function PasswordCheck({ label, ok }) {
  return (
    <div className={`flex items-center gap-2 px-2 py-1 rounded ${ok ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-red-700 bg-red-50 border border-red-200'}`}>
      {ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      <span>{label}</span>
    </div>
  );
}