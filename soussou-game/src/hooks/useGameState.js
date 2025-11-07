import { useState, useEffect } from 'react';

const useGameState = () => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameStats, setGameStats] = useState({
    total: 0,
    correct: 0
  });
  const [gameMode, setGameMode] = useState('menu');
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [loading, setLoading] = useState(false);

  // Load game state from localStorage on mount
  useEffect(() => {
    const savedGameState = localStorage.getItem('gameState');
    if (savedGameState) {
      const state = JSON.parse(savedGameState);
      setScore(state.score || 0);
      setStreak(state.streak || 0);
      setGameStats(state.gameStats || { total: 0, correct: 0 });
      setSelectedDifficulty(state.selectedDifficulty || 'easy');
    }
  }, []);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      score,
      streak,
      gameStats,
      selectedDifficulty
    };
    localStorage.setItem('gameState', JSON.stringify(state));
  }, [score, streak, gameStats, selectedDifficulty]);

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    setGameStats({ total: 0, correct: 0 });
    setLoading(false);
  };

  const incrementStreak = () => {
    setStreak(prev => prev + 1);
  };

  const resetStreak = () => {
    setStreak(0);
  };

  const resetStats = () => {
    setGameStats({ total: 0, correct: 0, incorrect: 0 });
    setStreak(0);
  };

  const updateGameStats = (isCorrect) => {
    setGameStats(prev => ({
      total: prev.total + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1)
    }));
  };

  const updateStats = (isCorrect) => {
    setGameStats(prev => ({
      total: prev.total + 1,
      correct: prev.correct + (isCorrect ? 1 : 0)
    }));

    if (isCorrect) {
      incrementStreak();
    } else {
      resetStreak();
    }
  };

  const getAccuracy = () => {
    if (gameStats.total === 0) return 0;
    return Math.round((gameStats.correct / gameStats.total) * 100);
  };

  return {
    score,
    setScore,
    streak,
    setStreak,
    gameStats,
    setGameStats,
    gameMode,
    setGameMode,
    selectedDifficulty,
    setSelectedDifficulty,
    loading,
    setLoading,
    resetGame,
    incrementStreak,
    resetStreak,
    resetStats,
    updateGameStats,
    updateStats,
    getAccuracy
  };
};

export default useGameState;