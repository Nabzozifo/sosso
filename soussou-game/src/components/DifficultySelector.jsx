import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import AfricanPatterns, { AdinkraSymbol } from './AfricanPatterns';

const DifficultySelector = ({ gameType, onSelectDifficulty, onBack }) => {
  const { t } = useLanguage();
  const [selectedDifficulty, setSelectedDifficulty] = React.useState(null);

  const difficulties = [
    {
      id: 'facile',
      name: 'Facile',
      description: 'Nombres de 1 à 100',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200',
      range: { min: 1, max: 999 },
      digits: '1-3'
    },
    {
      id: 'moyen',
      name: 'Moyen',
      description: 'Nombres de 1 à 3999',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200',
      range: { min: 1, max: 3999 },
      digits: '1-4'
    },
    {
      id: 'difficile',
      name: 'Difficile',
      description: 'Nombres de 1 à 9999',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200',
      range: { min: 1, max: 9999 },
      digits: '1-4'
    }
  ];

  const handleStart = () => {
    if (selectedDifficulty && onSelectDifficulty) {
      const difficultyConfig = difficulties.find(d => d.id === selectedDifficulty);
      onSelectDifficulty(difficultyConfig);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Overlay de fond couvrant toute la page (sans dépendre de h-full) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AfricanPatterns patternType="bogolan" opacity={0.06} />
        <img src="/7062114.jpg" alt="Motif ouest africain" className="absolute inset-0 object-cover w-full h-full opacity-[0.12]" />
      </div>
      
      {/* Contenu au-dessus du fond */}
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={onBack}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour au Menu
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Choisis ton niveau
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sélectionne le niveau de difficulté qui te convient
            </p>
          </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-8"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {difficulties.map((difficulty) => (
            <motion.button
              key={difficulty.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              onClick={() => setSelectedDifficulty(difficulty.id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 ${difficulty.bgColor} ${difficulty.borderColor} ${
                selectedDifficulty === difficulty.id
                  ? 'ring-4 ring-blue-400 transform scale-105 border-blue-400'
                  : 'hover:shadow-lg'
              }`}
              animate={
                selectedDifficulty === difficulty.id
                  ? { scale: [1, 1.05, 1], transition: { duration: 1.2, repeat: Infinity, repeatType: 'reverse' } }
                  : {}
              }
            >
              <div className={`text-center ${difficulty.textColor}`}>
                <h3 className="text-2xl font-bold mb-2">{difficulty.name}</h3>
                <p className="text-lg opacity-80">{difficulty.description}</p>
                {selectedDifficulty === difficulty.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-3"
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded-full mx-auto flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            disabled={!selectedDifficulty}
            className={`px-8 py-4 rounded-2xl text-xl font-bold transition-all duration-300 ${
              selectedDifficulty
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Commencer le jeu
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="px-6 py-3 rounded-xl text-lg font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-all duration-300 ml-4"
          >
            Retour au menu
          </motion.button>
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DifficultySelector;