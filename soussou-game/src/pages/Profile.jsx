import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AfricanPatterns, { AdinkraSymbol } from '../components/AfricanPatterns';
import { User, Shield, Settings } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      name: user.name || '',
      email: user.email || '',
    }));
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <AfricanPatterns patternType="bogolan" opacity={0.05} />
          <img src="/7082095.jpg" alt="Motif ouest africain" className="absolute inset-0 w-full h-full object-cover opacity-[0.12]" />
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-10 left-10">
              <AdinkraSymbol symbol="sankofa" size="w-32 h-32" color="text-orange-400" />
            </div>
            <div className="absolute top-20 right-20">
              <AdinkraSymbol symbol="gye_nyame" size="w-40 h-40" color="text-red-400" />
            </div>
            <div className="absolute bottom-20 left-1/4">
              <AdinkraSymbol symbol="dwennimmen" size="w-36 h-36" color="text-yellow-500" />
            </div>
          </div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto py-16 px-4">
          <h1 className="text-3xl font-bold gradient-text mb-4">Mon profil</h1>
          <p className="text-gray-700 mb-6">Veuillez vous connecter pour accéder à votre profil.</p>
          <button className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50" onClick={() => navigate('/')}>Aller à l’accueil</button>
        </div>
      </div>
    );
  }

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const payload = {
        name: form.name,
        email: form.email,
      };
      if (form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      await updateProfile(payload);
      setStatus({ type: 'success', message: 'Profil mis à jour avec succès.' });
      setForm((f) => ({ ...f, password: '', password_confirmation: '' }));
    } catch (e) {
      const msg = e?.response?.data?.message || 'Une erreur est survenue lors de la mise à jour.';
      setStatus({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AfricanPatterns patternType="kente" opacity={0.08} />
        <img src="/7062114.jpg" alt="Motif ouest africain" className="absolute inset-0 w-full h-full object-cover opacity-[0.12]" />
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 left-10">
            <AdinkraSymbol symbol="sankofa" size="w-32 h-32" color="text-orange-400" />
          </div>
          <div className="absolute top-20 right-20">
            <AdinkraSymbol symbol="gye_nyame" size="w-40 h-40" color="text-red-400" />
          </div>
          <div className="absolute bottom-20 left-1/4">
            <AdinkraSymbol symbol="dwennimmen" size="w-36 h-36" color="text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto py-16 px-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center ring-1 ring-orange-200">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Mon profil</h1>
            <p className="text-gray-600">Gérez vos informations personnelles et votre sécurité</p>
          </div>
        </div>

        {status && (
          <div className={`mb-6 p-4 rounded-xl border ${status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{status.message}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100">
            <div className="flex items-center gap-2 mb-4 text-gray-800">
              <Settings className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Informations personnelles</h2>
            </div>
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input type="text" name="name" value={form.name} onChange={onChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="Votre nom" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={form.email} onChange={onChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="vous@example.com" />
              </div>
              <div className="flex items-center gap-3">
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60">
                  {submitting ? 'Enregistrement…' : 'Enregistrer les modifications'}
                </button>
                <button type="button" onClick={() => navigate('/dashboard')} className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">Aller au tableau de bord</button>
              </div>
            </form>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100">
            <div className="flex items-center gap-2 mb-4 text-gray-800">
              <Shield className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Sécurité</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                <input type="password" name="password" value={form.password} onChange={onChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="••••••••" />
                <p className="text-xs text-gray-500 mt-1">Laisser vide pour ne pas changer.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={onChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="••••••••" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;