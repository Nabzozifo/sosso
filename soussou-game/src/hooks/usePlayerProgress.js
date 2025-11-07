import { useState, useEffect } from 'react';
import axios from 'axios';

const usePlayerProgress = () => {
  const [playerLevel, setPlayerLevel] = useState(1);
  const [totalXP, setTotalXP] = useState(0);
  const [badges, setBadges] = useState([]);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('playerProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setPlayerLevel(progress.playerLevel || 1);
      setTotalXP(progress.totalXP || 0);
      setBadges(progress.badges || []);
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    const progress = {
      playerLevel,
      totalXP,
      badges
    };
    localStorage.setItem('playerProgress', JSON.stringify(progress));

    // Tentative de synchronisation côté API (si connecté via cookies)
    const sync = async () => {
      try {
        const payload = {
          games_played: Math.max(1, Math.floor(totalXP / 30)),
          correct_answers: Math.floor(totalXP / 10),
          streak: Math.min(10, Math.floor(totalXP / 25)),
          lessons_completed: Math.floor(totalXP / 50),
          hard_mode_wins: Math.floor(totalXP / 70)
        };
        // Utiliser la base API configurable (dev/prod)
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
        await axios.post(`${API_BASE_URL}/progress`, payload, { withCredentials: true });
      } catch (e) {
        // Non connecté ou API indisponible : ignorer silencieusement
      }
    };
    sync();
  }, [playerLevel, totalXP, badges]);

  const addXP = (xp) => {
    setTotalXP(prev => {
      const newXP = prev + xp;
      const newLevel = Math.floor(newXP / 100) + 1;
      if (newLevel > playerLevel) {
        setPlayerLevel(newLevel);
        // Add level up badge
        addBadge({
          id: `level-${newLevel}`,
          name: `Niveau ${newLevel}`,
          emoji: '🏆',
          description: `Atteint le niveau ${newLevel}`,
          earnedAt: new Date().toISOString()
        });
      }
      return newXP;
    });
  };

  const addBadge = (badge) => {
    setBadges(prev => {
      // Check if badge already exists
      if (prev.some(b => b.id === badge.id)) {
        return prev;
      }
      return [...prev, badge];
    });
  };

  const getLevelProgress = () => {
    return (totalXP % 100);
  };

  const getXPToNextLevel = () => {
    return 100 - (totalXP % 100);
  };

  return {
    playerLevel,
    totalXP,
    badges,
    addXP,
    addBadge,
    getLevelProgress,
    getXPToNextLevel
  };
};

export default usePlayerProgress;