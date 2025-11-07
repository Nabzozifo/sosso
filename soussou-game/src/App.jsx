import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

// Import hooks
import useTimer from './hooks/useTimer'
import usePlayerProgress from './hooks/usePlayerProgress'
import useGameState from './hooks/useGameState'
import useGameLogic from './hooks/useGameLogic'

// Import components
import Navbar from './components/Navbar'
import AuthModal from './components/AuthModal'
import Footer from './components/Footer'
import HomePage from './components/HomePage'
import MainMenu from './components/MainMenu'
import GameInterface from './components/GameInterface'
import LessonsMode from './components/LessonsMode'
import QcmMode from './components/QcmMode'
import ExplorationMode from './components/ExplorationMode'
import FreeChallengeMode from './components/FreeChallengeMode'
import DifficultySelector from './components/DifficultySelector.jsx'
import CookieBanner from './components/CookieBanner'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'

// Import language context
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider } from './contexts/AuthContext'
import { CookieConsentProvider } from './contexts/CookieConsentContext'

// Import i18n configuration
import './translations/i18n'

function App() {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const location = useLocation()
  
  // Game mode and UI state - initialize from URL
  const [gameMode, setGameMode] = useState(() => {
    const path = location.pathname.slice(1) || 'home';
    return path;
  })
  const [selectedGameType, setSelectedGameType] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState(null)
  const [difficulty, setDifficulty] = useState(() => localStorage.getItem('soussou-difficulty') || 'facile')
  const [format, setFormat] = useState(() => localStorage.getItem('soussou-format') || 'dataset')
  const [guessDirection, setGuessDirection] = useState(() => localStorage.getItem('soussou-guessDirection') || 'soussou-to-number')
  
  // Exploration state
  const [explorationNumber, setExplorationNumber] = useState('')
  const [explorationResult, setExplorationResult] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [authOpen, setAuthOpen] = useState(false)

  // Initialize hooks
  const timer = useTimer()
  const playerProgress = usePlayerProgress()
  const gameState = useGameState()
  const gameLogic = useGameLogic(selectedDifficulty || 'facile', guessDirection)

  // Sync gameMode with URL changes only (one-way sync)
  useEffect(() => {
    const path = location.pathname.slice(1) || 'home';
    if (path !== gameMode) {
      setGameMode(path);
      localStorage.setItem('soussou-gameMode', path);
    }
  }, [location.pathname]);

  // Save other settings to localStorage
  useEffect(() => {
    localStorage.setItem('soussou-difficulty', difficulty)
    localStorage.setItem('soussou-format', format)
    localStorage.setItem('soussou-guessDirection', guessDirection)
  }, [difficulty, format, guessDirection])

  // Initialiser le préchargement au démarrage
  useEffect(() => {
    if (gameLogic.preloadNumbers) {
      gameLogic.preloadNumbers(3, format);
    }
  }, [gameLogic.preloadNumbers, format]);

  // Fonction pour explorer un nombre
  const exploreNumber = async (numberToExplore = null) => {
    const targetNumber = numberToExplore || explorationNumber
    if (!targetNumber || targetNumber < 1 || targetNumber > 999999) return

    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:8000/api/explore/${targetNumber}`)
      setExplorationResult(response.data)
    } catch (error) {
      console.error('Erreur lors de l\'exploration:', error)
      setExplorationResult({
        number: targetNumber,
        soussou: 'Données non disponibles',
        pronunciation: 'N/A',
        breakdown: [],
        patterns: [],
        cultural: null,
        tips: [],
        similar: []
      })
    } finally {
      setLoading(false)
    }
  }

  // Système de particules pour les effets visuels
  const ParticleSystem = ({ isActive, type = 'success' }) => {
    if (!isActive) return null

    const particles = Array.from({ length: 20 }, (_, i) => (
      <motion.div
        key={i}
        className={`absolute w-2 h-2 rounded-full ${
          type === 'success' ? 'bg-green-400' : 'bg-red-400'
        }`}
        initial={{
          x: 0,
          y: 0,
          opacity: 1,
          scale: 0
        }}
        animate={{
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200,
          opacity: 0,
          scale: 1
        }}
        transition={{
          duration: 1,
          delay: i * 0.05
        }}
      />
    ))

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles}
      </div>
    )
  }

  // Fonction pour débuter un nouveau jeu
  const startGame = (gameType, difficultyConfig) => {
    setSelectedGameType(gameType)
    setSelectedDifficulty(difficultyConfig)
    setGameMode('guess')
    // Sécuriser l'appel en cas de hot-reload ou version ancienne du hook
    if (gameState && typeof gameState.resetStats === 'function') {
      gameState.resetStats()
    } else if (gameState && typeof gameState.resetGame === 'function') {
      gameState.resetGame()
    }
    timer.resetTimer()
    gameLogic.generateNewNumberWithDifficulty(difficultyConfig, format, 'soussou')
  }

  // Fonction pour gérer la sélection de difficulté
  const handleDifficultySelect = async (difficultyConfig) => {
    startGame(selectedGameType, difficultyConfig)
    navigate('/guess')
  }

  // Fonction pour débuter un mode de jeu (pour compatibilité)
  const startGameMode = async (mode) => {
    if (typeof mode === 'string') {
      setSelectedGameType(mode)
      if (mode === 'lessons') {
        setGameMode('lessons')
        navigate('/lessons')
      } else if (mode === 'qcm') {
        setGameMode('qcm')
        navigate('/qcm')
      } else {
        setGameMode('difficulty-selector')
        navigate('/difficulty-selector')
      }
    }
  }

  return (
    <AuthProvider>
      <LanguageProvider>
      <CookieConsentProvider>
      <div className="App relative min-h-screen bg-white">
        {/* Fond global neutre pour laisser les pages gérer motif+image */}
        
        <Navbar 
          gameMode={gameMode} 
          setGameMode={setGameMode}
          playerLevel={playerProgress.playerLevel}
          totalXP={playerProgress.totalXP}
          badges={playerProgress.badges}
          openAuth={() => setAuthOpen(true)}
        />
        
        <main className="flex-1 p-4">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <HomePage 
                  key="home"
                  setGameMode={setGameMode}
                />
              } />
              
              <Route path="/jeu" element={
                <MainMenu 
                  key="menu"
                  setGameMode={setGameMode}
                  startGame={startGameMode}
                  playerLevel={playerProgress.playerLevel}
                  totalXP={playerProgress.totalXP}
                  getLevelProgress={playerProgress.getLevelProgress}
                  badges={playerProgress.badges}
                  ParticleSystem={ParticleSystem}
                />
              } />
              
              <Route path="/difficulty-selector" element={
                <DifficultySelector 
                  key="difficulty"
                  gameType={selectedGameType}
                  onSelectDifficulty={handleDifficultySelect}
                  onBack={() => {
                    setGameMode('menu')
                    navigate('/jeu')
                  }}
                />
              } />
              
              <Route path="/lessons" element={
                <LessonsMode 
                  key="lessons"
                  setGameMode={setGameMode}
                />
              } />

              <Route path="/qcm" element={
                <QcmMode 
                  key="qcm"
                  setGameMode={setGameMode}
                />
              } />
              
              <Route path="/exploration" element={
                <ExplorationMode 
                  key="exploration"
                  setGameMode={setGameMode}
                  explorationNumber={explorationNumber}
                  setExplorationNumber={setExplorationNumber}
                  explorationResult={explorationResult}
                  setExplorationResult={setExplorationResult}
                  exploreNumber={exploreNumber}
                  loading={loading}
                  showExplanation={showExplanation}
                  setShowExplanation={setShowExplanation}
                  generateNewNumber={gameLogic.generateNewNumber}
                />
              } />
              
              <Route path="/free-challenge" element={
                <FreeChallengeMode 
                  key="free-challenge"
                  setGameMode={setGameMode}
                  generateNewNumber={gameLogic.generateNewNumber}
                  currentNumber={gameLogic.currentNumber}
                  soussouData={gameLogic.soussouData}
                  loading={gameLogic.loading}
                  format={format}
                  setFormat={setFormat}
                  guessDirection={guessDirection}
                  setGuessDirection={setGuessDirection}
                  userAnswer={userAnswer}
                  setUserAnswer={setUserAnswer}
                  difficulty={selectedDifficulty}
                />
              } />
              
              <Route path="/guess" element={
                <GameInterface 
                  key="game"
                  gameMode={gameMode}
                  setGameMode={setGameMode}
                  showTimer={selectedGameType === 'timed-challenge'}
                  timeLeft={timer.timeLeft}
                  score={gameState.score}
                  streak={gameState.streak}
                  gameStats={gameState.gameStats}
                  loading={gameLogic.loading}
                  currentNumber={gameLogic.currentNumber}
                  soussouData={gameLogic.soussouData}
                  format={format}
                  stopTimer={timer.stopTimer}
                  startTimer={timer.startTimer}
                  generateNewNumber={gameLogic.generateNewNumber}
                  getDifficultyPoints={gameLogic.getDifficultyPoints}
                  setScore={gameState.setScore}
                  setGameStats={gameState.setGameStats}
                  explorationResult={explorationResult}
                  Footer={Footer}
                  difficulty={selectedDifficulty}
                />
              } />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </AnimatePresence>
         </main>

         <CookieBanner />
         <Footer />
         <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
       </div>
      </CookieConsentProvider>
    </LanguageProvider>
    </AuthProvider>
  )
}

export default App
