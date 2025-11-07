import { useState, useCallback, useRef } from 'react';
import { getRandomSoussouNumber, findSoussouNumber, findNumberBySoussou } from '../data/soussouNumbers.generated';

const useGameLogic = (difficulty = 'facile', gameDirection = 'number-to-soussou') => {
  const [currentNumber, setCurrentNumber] = useState(null);
  const [soussouData, setSoussouData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  // Cache pour le préchargement
  const cache = useRef(new Map());
  const preloadQueue = useRef([]);

  // Configuration des points par difficulté
  const difficultyPoints = {
    facile: 10,
    moyen: 20,
    difficile: 30,
    expert: 50
  };

  // Configuration des plages par difficulté (alignées avec le CSV: 1..9999)
  const difficultyRanges = {
    facile: [1, 999],
    moyen: [1, 3999],
    difficile: [1, 9999]
  };

  const getDifficultyPoints = useCallback(() => {
    return difficultyPoints[difficulty] || 10;
  }, [difficulty]);

  // Fonction de préchargement
  const preloadNumbers = useCallback((count = 3) => {
    try {
      const items = Array.from({ length: count }, () => getRandomSoussouNumber());
      preloadQueue.current = items.filter(Boolean);
    } catch (error) {
      console.error('Erreur lors du préchargement statique:', error);
    }
  }, []);

  const generateNewNumberWithDifficulty = useCallback((selectedDifficulty, _format = 'csv_data', _direction = gameDirection) => {
    setLoading(true);
    try {
      const difficultyId = selectedDifficulty?.id || selectedDifficulty || difficulty;
      const rangeCfg = selectedDifficulty?.range || difficultyRanges[difficultyId] || [1, 999];
      const min = rangeCfg[0] ?? rangeCfg.min ?? 1;
      const max = rangeCfg[1] ?? rangeCfg.max ?? 999;
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

      // Récupération depuis les données statiques
      const found = findSoussouNumber(randomNumber);
      const data = found || getRandomSoussouNumber();

      setCurrentNumber(data.number);
      setSoussouData({ number: data.number, soussou: data.soussou, translation: data.translation });
      setShowResult(false);
      setIsCorrect(false);

      return { number: data.number, data };
    } catch (error) {
      console.error('Erreur statique lors de la génération du nombre:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [difficulty, gameDirection]);

  const generateNewNumber = useCallback((_format = 'csv_data', _direction = gameDirection) => {
    setLoading(true);
    try {
      // Respecter la difficulté courante
      const rangeCfg = difficultyRanges[difficulty] || [1, 999];
      const min = rangeCfg[0] ?? rangeCfg.min ?? 1;
      const max = rangeCfg[1] ?? rangeCfg.max ?? 999;
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

      const found = findSoussouNumber(randomNumber);
      const data = found || getRandomSoussouNumber();

      setCurrentNumber(data.number);
      setSoussouData({ number: data.number, soussou: data.soussou, translation: data.translation });
      setShowResult(false);
      setIsCorrect(false);

      return { number: data.number, soussou: data.soussou, translation: data.translation };
    } catch (error) {
      console.error('Erreur statique lors de la génération du nombre:', error);
      const staticData = getRandomSoussouNumber();
      if (staticData) {
        setCurrentNumber(staticData.number);
        setSoussouData({ number: staticData.number, soussou: staticData.soussou, translation: staticData.translation });
        setShowResult(false);
        setIsCorrect(false);
        return staticData;
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [difficulty, gameDirection]);

  const checkAnswer = useCallback((userAnswer, correctAnswers) => {
    if (!userAnswer || !correctAnswers) return false;
    
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();
    
    // Vérifier contre toutes les réponses possibles
    if (Array.isArray(correctAnswers)) {
      return correctAnswers.some(answer => 
        answer.toLowerCase().trim() === normalizedUserAnswer
      );
    }
    
    return correctAnswers.toLowerCase().trim() === normalizedUserAnswer;
  }, []);

  const handleGuess = useCallback((userGuess, onCorrectAnswer, onIncorrectAnswer) => {
    if (!soussouData || !userGuess.trim()) return;

    let correct = false;
    
    if (gameDirection === 'soussou-to-number') {
      // Mode: Soussou vers Nombre
      const userNumber = parseInt(userGuess.trim());
      correct = userNumber === currentNumber;
    } else {
      // Mode: Nombre vers Soussou
      const correctAnswers = [
        soussouData.soussou,
        ...(soussouData.alternatives || [])
      ].filter(Boolean);
      
      correct = checkAnswer(userGuess, correctAnswers);
    }

    setIsCorrect(correct);
    setShowResult(true);

    if (correct && onCorrectAnswer) {
      onCorrectAnswer();
    } else if (!correct && onIncorrectAnswer) {
      onIncorrectAnswer();
    }

    return correct;
  }, [soussouData, currentNumber, gameDirection, checkAnswer]);

  const resetGame = useCallback(() => {
    setCurrentNumber(null);
    setSoussouData(null);
    setIsCorrect(false);
    setShowResult(false);
    setLoading(false);
  }, []);

  const nextChallenge = useCallback(async (format = 'linguistic', dataset = 'soussou') => {
    await generateNewNumber(format, dataset);
  }, [generateNewNumber]);

  return {
    // État
    currentNumber,
    soussouData,
    loading,
    isCorrect,
    showResult,
    
    // Actions
    generateNewNumberWithDifficulty,
    generateNewNumber,
    handleGuess,
    checkAnswer,
    getDifficultyPoints,
    resetGame,
    nextChallenge,
    preloadNumbers,
    
    // Setters pour compatibilité
    setIsCorrect,
    setShowResult
  };
};

export default useGameLogic;