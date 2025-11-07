import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { AdinkraSymbol } from './AfricanPatterns';
import AfricanPatterns from './AfricanPatterns';

const FreeChallengeMode = ({ 
  soussouData, 
  currentNumber, 
  generateNewNumber, 
  setGameMode, 
  userAnswer, 
  setUserAnswer 
}) => {
  const { t } = useLanguage()
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [encouragement, setEncouragement] = useState('')
  const [showExplanationLink, setShowExplanationLink] = useState(false)
  const [feedback, setFeedback] = useState('')
  const inputRef = useRef(null)

  // Maintenir le focus sur l'input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentNumber, feedback])
  
  if (!soussouData) return null

  const encouragementMessages = [
    "Courage ! Vous pouvez y arriver !",
    "Essayez encore, vous êtes sur la bonne voie !",
    "Concentrez-vous, la réponse est proche !"
  ]

  const handleFreeAnswer = (answer) => {
    const correctAnswer = currentNumber?.toString()
    
    if (answer.trim() === correctAnswer) {
      setFeedback('Excellent ! Bonne réponse !')
      setAttempts(0)
      setShowHint(false)
      setEncouragement('')
      setShowExplanationLink(false)
      setTimeout(() => {
        generateNewNumber()
        setFeedback('')
      }, 2000)
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      
      if (newAttempts === 1) {
        setFeedback('Pas tout à fait. Essayez encore !')
        setEncouragement(encouragementMessages[0])
      } else if (newAttempts === 2) {
        setFeedback('Encore une tentative !')
        setEncouragement(encouragementMessages[1])
        setShowHint(true)
      } else if (newAttempts >= 3) {
        setFeedback(`La bonne réponse était : ${correctAnswer}`)
        setEncouragement('Consultez les explications pour mieux comprendre')
        setShowExplanationLink(true)
        setTimeout(() => {
          setAttempts(0)
          setShowHint(false)
          setEncouragement('')
          setShowExplanationLink(false)
          generateNewNumber()
          setFeedback('')
        }, 4000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-white p-6 relative overflow-hidden">
      {/* Overlay motif+image fixe couvrant toute la page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AfricanPatterns patternType="kente" opacity={0.06} />
        <img src="/7062114.jpg" alt="Motif ouest africain" className="absolute inset-0 w-full h-full object-cover opacity-[0.12]" />
      </div>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Motifs africains authentiques en arrière-plan */}
        <AfricanPatterns patternType="kente" opacity={0.08} />
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
          <div className="absolute top-1/2 right-1/3 transform -translate-y-1/2">
            <AfricanPatterns patternType="dogon" opacity={0.2} className="w-24 h-24" />
          </div>
          <div className="absolute bottom-20 right-20">
            <AfricanPatterns patternType="mask" opacity={0.2} className="w-32 h-32" />
          </div>
          <div className="absolute top-10 right-1/4">
            <AfricanPatterns patternType="elements" opacity={0.2} className="w-36 h-36" />
          </div>
          <div className="absolute bottom-10 left-10">
            <AfricanPatterns patternType="geometric" opacity={0.2} className="w-28 h-28" />
          </div>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-6 glass-morphism rounded-2xl shadow-xl relative z-10"
      >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black mb-2">Défi Libre</h2>
        <p className="text-black/80">Prenez votre temps, apprenez à votre rythme</p>
      </div>

      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-orange-600 mb-4 soussou-text">
          {soussouData?.soussou || soussouData?.dataset_format?.soussou || soussouData?.linguistic_format?.soussou}
        </div>
        <p className="text-lg text-black/80 mb-6">
          Quel nombre correspond à ce mot en Soussou ?
        </p>

        {showHint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4"
          >
            <p className="text-blue-800 font-medium">Indice :</p>
            <p className="text-blue-700">
              Ce nombre commence par "{currentNumber?.toString().charAt(0) || ''}..."
            </p>
          </motion.div>
        )}

        {encouragement && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4"
          >
            <p className="text-yellow-800 font-medium">{encouragement}</p>
          </motion.div>
        )}

        {showExplanationLink && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4"
          >
            <button
              onClick={() => setGameMode('exploration')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Voir les explications
            </button>
          </motion.div>
        )}

        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-2xl blur-lg animate-pulse"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-2xl opacity-50 blur-xl animate-pulse"></div>
          <input
            ref={inputRef}
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleFreeAnswer(userAnswer)}
            placeholder="TAPEZ LE NOMBRE ICI..."
            className="relative w-full p-8 text-2xl font-black bg-gradient-to-r from-white to-yellow-50 backdrop-blur-sm border-4 border-yellow-500 rounded-2xl focus:border-orange-500 focus:ring-8 focus:ring-orange-500/40 focus:outline-none shadow-2xl hover:shadow-3xl transition-all duration-300 text-gray-900 placeholder-gray-600 cultural-symbol tracking-wide"
            autoFocus
          />
        </div>

        <button
          onClick={() => handleFreeAnswer(userAnswer)}
          className="w-full bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white py-6 px-8 rounded-2xl text-2xl font-black hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border-4 border-white/70 hover:border-white/90 shadow-lg relative overflow-hidden group"
        >
          <span className="relative z-10 drop-shadow-lg tracking-wide">✅ VÉRIFIER MA RÉPONSE</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl -z-10 opacity-50 blur-lg animate-pulse"></div>
        </button>
      </div>

      {feedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-center p-4 rounded-lg mb-4 ${
            feedback.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          <p className="font-semibold">{feedback}</p>
        </motion.div>
      )}

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setGameMode('menu')}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← {t('backToMenu')}
        </button>
        <button
          onClick={() => {
            generateNewNumber()
            setAttempts(0)
            setShowHint(false)
            setEncouragement('')
            setShowExplanationLink(false)
            setFeedback('')
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Nouveau nombre
        </button>
      </div>
      </motion.div>
    </div>
  )
}

export default FreeChallengeMode