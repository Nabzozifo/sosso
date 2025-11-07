import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Check, X, Shuffle, ArrowLeft, TreePine, Target, Trophy, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AdinkraSymbol } from './AfricanPatterns';
import AfricanPatterns from './AfricanPatterns';
import apiService from '../services/api';

// Fonction utilitaire pour formater le temps
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const GameInterface = ({ 
  gameMode, 
  setGameMode, 
  showTimer,
  timeLeft, 
  score, 
  streak, 
  gameStats, 
  loading, 
  currentNumber, 
  soussouData, 
  format, 
  stopTimer,
  startTimer, 
  generateNewNumber, 
  getDifficultyPoints,
  setScore,
  setGameStats,
  explorationResult,
  Footer,
  difficulty
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [userGuess, setUserGuess] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [numberAnalysis, setNumberAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [gameDirection, setGameDirection] = useState('number-to-soussou'); // nouveau état

  // Démarrer/arrêter le timer selon le mode (uniquement en défi chrono)
  useEffect(() => {
    if (showTimer && startTimer) {
      startTimer(60);
    } else if (!showTimer && stopTimer) {
      stopTimer();
    }
  }, [showTimer, startTimer, stopTimer]);

  // Générer un premier nombre dès le montage et lors des changements de mode si nécessaire
  useEffect(() => {
    const noData = !currentNumber && !soussouData;
    if (noData && generateNewNumber) {
      generateNewNumber('csv_data', gameDirection);
    }
  }, [generateNewNumber]);

  useEffect(() => {
    // Si on change la direction de jeu et qu'aucune donnée n'est affichée, générer
    const noData = !currentNumber && !soussouData;
    if (noData && generateNewNumber) {
      generateNewNumber('csv_data', gameDirection);
    }
  }, [gameDirection, currentNumber, soussouData, generateNewNumber]);

  // Fonction pour obtenir l'analyse détaillée d'un nombre
  const getNumberAnalysis = async (number) => {
    setLoadingAnalysis(true);
    try {
      const analysis = await apiService.analyzeNumber(number);
      setNumberAnalysis(analysis);
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleGuess = async () => {
    let correct = false;
    
    if (gameDirection === 'number-to-soussou') {
      // Mode: Nombre vers Soussou - vérifier si la traduction est correcte
      const userAnswer = userGuess.toLowerCase().trim();
      const correctAnswers = [
        soussouData?.translation?.toLowerCase().trim(),
        soussouData?.soussou?.toLowerCase().trim(),
        ...(soussouData?.alternatives || []).map(alt => alt.toLowerCase().trim())
      ].filter(Boolean);
      
      correct = correctAnswers.some(answer => answer === userAnswer);
    } else {
      // Mode: Soussou vers Nombre - vérifier si le nombre est correct
      const userNumber = parseInt(userGuess.trim());
      correct = userNumber === currentNumber;
    }
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(prev => prev + getDifficultyPoints());
      setGameStats(prev => ({
        ...prev,
        correct: prev.correct + 1
      }));
    } else {
      setGameStats(prev => ({
        ...prev,
        incorrect: prev.incorrect + 1
      }));
    }

    // Obtenir l'analyse du nombre pour l'explication
    if (currentNumber) {
      await getNumberAnalysis(currentNumber);
    }
  };

  const handleGameDirectionChange = (newDirection) => {
    setGameDirection(newDirection);
    setUserGuess('');
    setShowResult(false);
    setIsCorrect(false);
    setShowExplanation(false);
    setNumberAnalysis(null);
    generateNewNumber('csv_data', newDirection);
  };

  const nextChallenge = () => {
    setUserGuess('');
    setShowResult(false);
    setIsCorrect(false);
    setShowExplanation(false);
    setNumberAnalysis(null);
    generateNewNumber('csv_data', gameDirection);
  };

  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Overlay motif+image fixe couvrant toute la page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AfricanPatterns patternType="bogolan" opacity={0.02} />
        <img src="/7078374.jpg" alt="Motif ouest africain" className="absolute inset-0 w-full h-full object-cover opacity-[0.15]" />
      </div>
      
      {/* Header avec navigation et stats */}
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Navigation et stats */}
          <div className="flex justify-between items-center mb-8">
            <motion.button
              onClick={() => navigate('/jeu')}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <ArrowLeft className="w-5 h-5" />
              Retour au Jeu
            </motion.button>

            {/* Stats simples */}
            <div className="flex gap-4">
              {/* Timer */}
              {showTimer && (
                <div className="bg-gray-100 rounded-lg p-3 border">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-600'}`} />
                    <div className={`text-lg font-semibold ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-700'}`}>
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                </div>
              )}

              {/* Score */}
              <div className="bg-gray-100 rounded-lg p-3 border">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <div className="text-lg font-semibold text-gray-700">
                    {score}
                  </div>
                </div>
              </div>

              {/* Streak */}
              {streak > 0 && (
                <div className="bg-gray-100 rounded-lg p-3 border">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-500" />
                    <div className="text-lg font-semibold text-gray-700">
                      {streak}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interface de jeu principale */}
          <div className="max-w-3xl mx-auto">
            {/* Carte du nombre à deviner */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
              {/* Titre simple */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Défi Soussou
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {gameDirection === 'number-to-soussou' 
                    ? 'Traduis ce nombre en langue Soussou' 
                    : 'Trouve le nombre correspondant à cette traduction Soussou'
                  }
                </p>
                
                {/* Sélecteur de mode de jeu */}
                <div className="flex justify-center mb-6">
                  <div className="bg-gray-100 rounded-lg p-1 flex">
                    <button
                      onClick={() => handleGameDirectionChange('number-to-soussou')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        gameDirection === 'number-to-soussou'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Nombre → Soussou
                    </button>
                    <button
                      onClick={() => handleGameDirectionChange('soussou-to-number')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        gameDirection === 'soussou-to-number'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Soussou → Nombre
                    </button>
                  </div>
                </div>
              </div>

              {/* Le nombre ou la traduction à deviner (animé) */}
              <div className="text-center mb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={gameDirection === 'number-to-soussou' ? currentNumber : (soussouData?.translation || soussouData?.soussou || '...')}
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.18 }}
                    className="border-2 border-orange-300 rounded-xl px-8 py-6 inline-block backdrop-blur-sm bg-white/10 shadow-[0_0_20px_rgba(255,140,0,0.20)] hover:shadow-[0_0_28px_rgba(255,140,0,0.35)] transition-shadow"
                  >
                    {gameDirection === 'number-to-soussou' ? (
                      <div className="text-5xl font-bold text-gray-800">
                        {currentNumber || '...'}
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-gray-800">
                        {soussouData?.translation || soussouData?.soussou || '...'}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Zone de saisie */}
              {!showResult && (
                <div className="space-y-6">
                  <div>
                    <input
                      type="text"
                      value={userGuess}
                      onChange={(e) => setUserGuess(e.target.value)}
                      placeholder={gameDirection === 'number-to-soussou' 
                        ? "Écris la traduction en Soussou..." 
                        : "Écris le nombre correspondant..."
                      }
                      className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                    />
                  </div>

                  <div className="flex justify-center gap-4">
                    <motion.button
                      onClick={handleGuess}
                      disabled={!userGuess.trim()}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{ y: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Check className="w-5 h-5" />
                      Vérifier
                    </motion.button>

                    <motion.button
                      onClick={() => generateNewNumber('csv_data', gameDirection)}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 flex items-center gap-2 shadow-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Shuffle className="w-5 h-5" />
                      Nouveau Nombre
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Résultat */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Résultat correct/incorrect */}
                    <div className={`text-center p-6 rounded-lg border-2 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} shadow-sm`}>
                      <div className="flex items-center justify-center gap-3 mb-4">
                        {isCorrect ? (
                          <>
                            <motion.span initial={{ scale: 0.85 }} animate={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
                              <Check className="w-8 h-8 text-green-600" />
                            </motion.span>
                            <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="text-2xl font-bold text-green-700">Excellent !</motion.span>
                          </>
                        ) : (
                          <>
                            <motion.span initial={{ scale: 0.85 }} animate={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
                              <X className="w-8 h-8 text-red-600" />
                            </motion.span>
                            <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="text-2xl font-bold text-red-700">Pas tout à fait...</motion.span>
                          </>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="text-lg">
                          <span className="font-semibold">Ta réponse:</span> 
                          <span className={`ml-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {userGuess}
                          </span>
                        </div>
                        <div className="text-lg">
                          <span className="font-semibold">Bonne réponse:</span> 
                          <span className="ml-2 text-green-700 font-bold">
                            {soussouData?.translation || 'Non disponible'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={nextChallenge}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 flex items-center gap-2"
                      >
                        <Target className="w-5 h-5" />
                        Défi Suivant
                      </button>

                      <button
                        onClick={toggleExplanation}
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 flex items-center gap-2"
                      >
                        <TreePine className="w-5 h-5" />
                        {showExplanation ? 'Masquer' : 'Voir'} l'Explication
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Explication détaillée */}
            <AnimatePresence>
              {showExplanation && numberAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl border border-gray-200 p-8"
                >
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <TreePine className="w-8 h-8 text-green-600" />
                      <h3 className="text-2xl font-bold text-gray-800">
                        Explication
                      </h3>
                    </div>
                    <p className="text-lg text-gray-600">Découvre comment ce nombre se construit en Soussou</p>
                  </div>

                  {/* Analyse détaillée */}
                  {numberAnalysis.success && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Composants du nombre */}
                      <div className="bg-gray-50 p-6 rounded-lg border">
                        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Target className="w-6 h-6" />
                          Composants
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(numberAnalysis.analysis.components).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center bg-white p-3 rounded border">
                              <span className="font-semibold capitalize">{key}:</span>
                              <span className="text-gray-700 font-bold">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Difficulté */}
                      <div className="bg-gray-50 p-6 rounded-lg border">
                        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Zap className="w-6 h-6" />
                          Niveau de Difficulté
                        </h4>
                        <div className="text-center">
                          <div className={`inline-block px-4 py-2 rounded-lg font-bold text-lg border ${
                            numberAnalysis.analysis.difficulty === 'easy' ? 'bg-green-100 text-green-800 border-green-200' :
                            numberAnalysis.analysis.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            numberAnalysis.analysis.difficulty === 'hard' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {numberAnalysis.analysis.difficulty.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      {/* Étapes de construction */}
                      <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg border">
                        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <TreePine className="w-6 h-6" />
                          Étapes de Construction
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {numberAnalysis.analysis.construction_steps.map((step, index) => (
                            <div key={index} className="flex items-center gap-3 bg-white p-3 rounded border">
                              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </div>
                              <span className="text-gray-700">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      {Footer && <Footer />}
    </div>
  );
};

export default GameInterface;