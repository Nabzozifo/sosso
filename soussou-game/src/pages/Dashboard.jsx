import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import usePlayerProgress from '../hooks/usePlayerProgress';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AfricanPatterns, { AdinkraSymbol } from '../components/AfricanPatterns';
import { User, Trophy, BarChart3, Target, TrendingUp } from 'lucide-react';
import { apiService } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const progress = usePlayerProgress();
  const [serverProgress, setServerProgress] = useState(null);
  const [serverLoading, setServerLoading] = useState(false);
  const [globalStats, setGlobalStats] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(false);

  useEffect(() => {
    const loadGlobal = async () => {
      setGlobalLoading(true);
      try {
        const res = await apiService.getStats();
        setGlobalStats(res?.stats || res);
      } catch (e) {
        // Statistiques indisponibles
      } finally {
        setGlobalLoading(false);
      }
    };
    loadGlobal();
  }, []);

  useEffect(() => {
    if (!user) return;
    const loadServerProgress = async () => {
      setServerLoading(true);
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
        const res = await axios.get(`${API_BASE_URL}/progress`, {
          withCredentials: true,
          headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        });
        setServerProgress(res.data);
      } catch (e) {
        // Données serveur indisponibles
      } finally {
        setServerLoading(false);
      }
    };
    loadServerProgress();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <AfricanPatterns patternType="bogolan" opacity={0.06} />
          <img src="/7078374.jpg" alt="Motif ouest africain" className="absolute inset-0 w-full h-full object-cover opacity-[0.12]" />
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
          <h1 className="text-3xl font-bold gradient-text mb-4">Mon tableau de bord</h1>
          <p className="text-gray-700 mb-6">Veuillez vous connecter pour accéder à votre tableau de bord.</p>
          <button className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50" onClick={() => navigate('/')}>Aller à l’accueil</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AfricanPatterns patternType="kente" opacity={0.07} />
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

      <div className="relative z-10 max-w-6xl mx-auto py-16 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center ring-1 ring-orange-200">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Bienvenue, {user.name || user.email}</h1>
              <p className="text-gray-600">Votre centre de progression et d’objectifs</p>
            </div>
          </div>
          <button onClick={() => navigate('/profile')} className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">Modifier mon profil</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl border bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gray-800 mb-2">
              <Trophy className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold">Niveau</h2>
            </div>
            <p className="text-4xl font-bold text-orange-600">{progress.playerLevel}</p>
            <p className="text-gray-600 mt-1">Vers prochain niveau: {progress.getLevelProgress()}%</p>
          </div>
          <div className="p-5 rounded-2xl border bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gray-800 mb-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold">XP total</h2>
            </div>
            <p className="text-4xl font-bold text-orange-600">{progress.totalXP}</p>
            <p className="text-gray-600 mt-1">XP requis prochain niveau: {progress.getXPToNextLevel()}</p>
          </div>
          <div className="p-5 rounded-2xl border bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gray-800 mb-2">
              <Target className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold">Badges</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {progress.badges.length === 0 ? (
                <span className="text-gray-600">Aucun badge pour le moment</span>
              ) : (
                progress.badges.map((b) => (
                  <span key={b.id} className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm">{b.name}</span>
                ))
              )}
            </div>
          </div>
          <div className="p-5 rounded-2xl border bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gray-800 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold">Objectifs</h2>
            </div>
            <ul className="text-gray-700 list-disc list-inside space-y-1">
              <li>Réussir 5 réponses d’affilée</li>
              <li>Terminer 2 leçons aujourd’hui</li>
              <li>Jouer une partie en difficulté « difficile »</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gray-800 mb-4">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold">Progression synchronisée (serveur)</h2>
            </div>
            {serverLoading ? (
              <p className="text-gray-600">Chargement…</p>
            ) : serverProgress ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Score</p>
                  <p className="text-2xl font-bold text-orange-600">{serverProgress.score}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Badge</p>
                  <p className="text-2xl font-bold text-orange-600">{serverProgress.badge || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Parties jouées</p>
                  <p className="text-xl font-semibold text-gray-800">{serverProgress.games_played}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Réponses correctes</p>
                  <p className="text-xl font-semibold text-gray-800">{serverProgress.correct_answers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Série max</p>
                  <p className="text-xl font-semibold text-gray-800">{serverProgress.streak}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Leçons terminées</p>
                  <p className="text-xl font-semibold text-gray-800">{serverProgress.lessons_completed}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Victoires (difficile)</p>
                  <p className="text-xl font-semibold text-gray-800">{serverProgress.hard_mode_wins}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Aucune donnée serveur n’a été trouvée.</p>
            )}
          </div>

          <div className="p-6 rounded-2xl border bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gray-800 mb-4">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold">Statistiques globales</h2>
            </div>
            {globalLoading ? (
              <p className="text-gray-600">Chargement…</p>
            ) : globalStats ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total de nombres</p>
                  <p className="text-xl font-semibold text-gray-800">{globalStats.total_numbers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Plage</p>
                  <p className="text-xl font-semibold text-gray-800">{globalStats.range?.min} – {globalStats.range?.max}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Faciles</p>
                  <p className="text-xl font-semibold text-gray-800">{globalStats.difficulty_distribution?.easy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Moyens</p>
                  <p className="text-xl font-semibold text-gray-800">{globalStats.difficulty_distribution?.medium}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Difficiles</p>
                  <p className="text-xl font-semibold text-gray-800">{globalStats.difficulty_distribution?.hard}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Très difficiles</p>
                  <p className="text-xl font-semibold text-gray-800">{globalStats.difficulty_distribution?.very_hard}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Statistiques indisponibles.</p>
            )}
          </div>
        </div>

        <div className="mt-8 p-6 rounded-2xl border bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-gray-800 mb-4">
            <Target className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold">Actions rapides</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700" onClick={() => navigate('/jeu')}>Jouer maintenant</button>
            <button className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50" onClick={() => navigate('/exploration')}>Explorer un nombre</button>
            <button className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50" onClick={() => navigate('/qcm')}>Mode QCM</button>
            <button className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50" onClick={() => navigate('/lessons')}>Cours</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;