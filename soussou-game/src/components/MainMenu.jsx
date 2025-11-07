import { motion } from 'framer-motion';
import { Clock, BookOpen, Timer } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AfricanPatterns from './AfricanPatterns';

const MainMenu = ({ 
  startGame, 
  playerLevel, 
  totalXP, 
  getLevelProgress, 
  badges, 
  ParticleSystem 
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Section principale avec motifs + image en overlay fixe */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Motifs africains authentiques en arrière-plan */}
        <AfricanPatterns patternType="bogolan" opacity={0.05} />
        <img src="/7078374.jpg" alt="Motif ouest africain" className="absolute inset-0 w-full h-full object-cover opacity-[0.12]" />
      </div>
      
      <div className="relative z-10 p-4">
        <div className="max-w-6xl mx-auto">
        {/* Header simplifié */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">
            {t('siteName')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('welcomeSubtitle')}
          </p>
          
          {/* Panneau de progression simplifié */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto mb-8 border border-orange-100">
            <div className="flex flex-wrap justify-center items-center gap-6">
              {/* Niveau du joueur */}
              <div className="bg-orange-100 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-600">Niveau</div>
                  <div className="text-2xl font-bold text-orange-600">{playerLevel}</div>
                </div>
              </div>
              
              {/* Barre de progression XP */}
              <div className="bg-blue-100 rounded-xl p-4 flex-1 min-w-64">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-600">Expérience</span>
                  <span className="text-sm font-semibold text-gray-600">{totalXP} XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getLevelProgress()}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{100 - (totalXP % 100)} XP pour le niveau {playerLevel + 1}</div>
              </div>
              
              {/* Badges récents */}
              <div className="bg-green-100 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-600 mb-2">Badges</div>
                  <div className="flex gap-1">
                    {badges.slice(-3).map((badge, index) => (
                      <div key={badge.id} className="text-2xl">
                        {badge.icon}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
            
            {/* Conseil d'utilisation simplifié */}
            <div className="bg-orange-100 rounded-xl p-4 max-w-2xl mx-auto mb-8">
              <p className="text-gray-700 text-center">
                Commence par les "{t('lessons')}" pour apprendre les bases, puis amuse-toi avec les jeux !
              </p>
            </div>
          </div>

          {/* Menu des jeux simplifié */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Soussou vers Nombre */}
            <button
              onClick={() => startGame('guess')}
              className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100 hover:border-orange-200"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Soussou ➡️ Nombre</h3>
                <p className="text-sm text-gray-600 mb-3">Traduisez du soussou vers les chiffres</p>
                <div className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1 inline-block">20 secondes par défi</div>
              </div>
            </button>

            {/* Défi Chrono */}
            <button
              onClick={() => startGame('timed-challenge')}
              className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-200"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Timer className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Défi Chrono</h3>
                <p className="text-sm text-gray-600 mb-3">Mode chronométré</p>
                <div className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1 inline-block">Chaque seconde compte</div>
              </div>
            </button>

            {/* Défi Libre */}
            <button
              onClick={() => startGame('free-challenge')}
              className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-200"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Défi Libre</h3>
                <p className="text-sm text-gray-600 mb-3">Apprenez à votre rythme</p>
                <div className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1 inline-block">Avec système d'aide</div>
              </div>
            </button>

            {/* QCM */}
            <button
              onClick={() => startGame('qcm')}
              className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100 hover:border-purple-200"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">QCM</h3>
                <p className="text-sm text-gray-600 mb-3">Vérifiez votre compréhension</p>
                <div className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1 inline-block">Questionnaire à choix multiples</div>
              </div>
            </button>
          </div>
        </div>
      </div>
  );
};

export default MainMenu;