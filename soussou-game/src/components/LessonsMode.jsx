import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, BookOpen, Star, Lightbulb, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdinkraSymbol } from './AfricanPatterns';
import AfricanPatterns from './AfricanPatterns';

const LessonsMode = ({ setGameMode }) => {
  const [currentLesson, setCurrentLesson] = useState(0);
  
  const lessons = [
    {
      title: "Les Nombres de Base (1-10)",
      content: {
        theory: "Apprenons d'abord les nombres fondamentaux en Soussou. Ces nombres sont la base de tout le système numérique.",
        examples: [
          { number: 1, soussou: "kérén", pronunciation: "KEH-ren" },
          { number: 2, soussou: "̀fírín", pronunciation: "fee-REEN" },
          { number: 3, soussou: "sàxán", pronunciation: "sah-KHAN" },
          { number: 4, soussou: "náání", pronunciation: "NAH-nee" },
          { number: 5, soussou: "súlí", pronunciation: "SOO-lee" },
          { number: 6, soussou: "sénní", pronunciation: "SEN-nee" },
          { number: 7, soussou: "sólófèré", pronunciation: "so-lo-FEH-reh" },
          { number: 8, soussou: "sólómásàxán", pronunciation: "so-lo-ma-sah-KHAN" },
          { number: 9, soussou: "sólómánáání", pronunciation: "so-lo-ma-NAH-nee" },
          { number: 10, soussou: "fuú", pronunciation: "FOO" }
        ],
        tip: "💡 Remarquez que 7 = sólófèré et 8 = sólómásàxán suivent un pattern spécial avec 'sóló'",
        keyPoints: [
          "Les formes 7–9 dérivent de constructions avec 'sóló'.",
          "10 ('fuú') sert de pivot pour les dizaines."
        ]
      }
    },
    {
      title: "Les Dizaines (10, 20, 30...)",
      content: {
        theory: "Les dizaines suivent un pattern régulier basé sur les nombres de base multipliés par 10 (fuu).",
        examples: [
          { number: 10, soussou: "fuú", pronunciation: "FOO" },
          { number: 20, soussou: "m̀ɔx̀ɔǵɛŋ", pronunciation: "moh-khoh-geng" },
          { number: 30, soussou: "tòngó sàxán", pronunciation: "ton-go sah-KHAN" },
          { number: 40, soussou: "tòngó náání", pronunciation: "ton-go NAH-nee" },
          { number: 50, soussou: "tòngó súlí", pronunciation: "ton-go SOO-lee" },
          { number: 60, soussou: "tòngó sénní", pronunciation: "ton-go SEN-nee" },
          { number: 70, soussou: "tòngó sólófèré", pronunciation: "ton-go so-lo-FEH-reh" },
          { number: 80, soussou: "tòngó sólómásàxán", pronunciation: "ton-go so-lo-ma-sah-KHAN" },
          { number: 90, soussou: "tòngó sólómánáání", pronunciation: "ton-go so-lo-ma-NAH-nee" }
        ],
        tip: "💡 Les dizaines utilisent 'tòngó' + nombre de base. 20 est spécial avec 'm̀ɔx̀ɔǵɛŋ'.",
        keyPoints: [
          "'tòngó' précède le nombre de base pour former les dizaines.",
          "20 ('m̀ɔx̀ɔǵɛŋ') est irrégulier et doit être mémorisé."
        ]
      }
    },
    {
      title: "Les Centaines (100, 200, 300...)",
      content: {
        theory: "Les centaines utilisent 'kɛmɛ' (100) comme base, précédé du multiplicateur.",
        examples: [
          { number: 100, soussou: "k̀ɛḿɛ", pronunciation: "KEH-meh" },
          { number: 200, soussou: "k̀ɛḿɛ ̀fírín", pronunciation: "KEH-meh fee-REEN" },
          { number: 300, soussou: "k̀ɛḿɛ sàxán", pronunciation: "KEH-meh sah-KHAN" },
          { number: 400, soussou: "k̀ɛḿɛ náání", pronunciation: "KEH-meh NAH-nee" },
          { number: 500, soussou: "k̀ɛḿɛ súlí", pronunciation: "KEH-meh SOO-lee" },
          { number: 600, soussou: "k̀ɛḿɛ sénní", pronunciation: "KEH-meh SEN-nee" },
          { number: 700, soussou: "k̀ɛḿɛ sólófèré", pronunciation: "KEH-meh so-lo-FEH-reh" }
        ],
        tip: "💡 'k̀ɛḿɛ' signifie 100. Pour les multiples, on ajoute le nombre après k̀ɛḿɛ.",
        keyPoints: [
          "Le multiplicateur suit 'k̀ɛḿɛ' pour indiquer le nombre de centaines.",
          "Les centaines >500 continuent le même motif (ex. 600, 700)."
        ]
      }
    },
    {
      title: "Les Milliers (1000, 2000...)",
      content: {
        theory: "Les milliers utilisent 'wulu' ou 'soloma' selon le contexte, avec le multiplicateur.",
        examples: [
          { number: 1000, soussou: "wúlù kérén", pronunciation: "WOO-loo KEH-ren" },
          { number: 2000, soussou: "wúlù ̀fírín", pronunciation: "WOO-loo fee-REEN" },
          { number: 3000, soussou: "wúlù sàxán", pronunciation: "WOO-loo sah-KHAN" },
          { number: 5000, soussou: "wúlù súlí", pronunciation: "WOO-loo SOO-lee" },
          { number: 7000, soussou: "wúlù sólófèré", pronunciation: "WOO-loo so-lo-FEH-reh" }
        ],
        tip: "💡 'wúlù' indique les milliers, suivi du multiplicateur (kérén, ̀fírín, etc.).",
        keyPoints: [
          "'wúlù' marque la classe des milliers.",
          "On ajoute le multiplicateur après 'wúlù'."
        ]
      }
    },
    {
      title: "Combinaisons et Règles",
      content: {
        theory: "Pour former des nombres complexes, on combine les éléments avec 'nŭn' (et/plus).",
        examples: [
          { number: 25, soussou: "m̀ɔx̀ɔǵɛŋ nŭn súlí", pronunciation: "moh-khoh-geng nun SOO-lee" },
          { number: 147, soussou: "k̀ɛḿɛ tòngó náání nŭn sólófèré", pronunciation: "KEH-meh ton-go NAH-nee nun so-lo-FEH-reh" },
          { number: 235, soussou: "k̀ɛḿɛ ̀fírín tòngó sàxán nŭn súlí", pronunciation: "KEH-meh fee-REEN ton-go sah-KHAN nun SOO-lee" },
          { number: 1234, soussou: "wúlù kérén k̀ɛḿɛ ̀fírín tòngó sàxán nŭn náání", pronunciation: "WOO-loo KEH-ren KEH-meh fee-REEN ton-go sah-KHAN nun NAH-nee" },
          { number: 17, soussou: "fuú nŭn sólófèré", pronunciation: "FOO nun so-lo-FEH-reh" },
          { number: 28, soussou: "m̀ɔx̀ɔǵɛŋ nŭn ̀fírín", pronunciation: "moh-khoh-geng nun fee-REEN" },
          { number: 349, soussou: "k̀ɛḿɛ sàxán tòngó sólómánáání", pronunciation: "KEH-meh sah-KHAN ton-go so-lo-ma-NAH-nee" },
          { number: 5721, soussou: "wúlù súlí k̀ɛḿɛ sólófèré tòngó m̀ɔx̀ɔǵɛŋ nŭn kérén", pronunciation: "WOO-loo SOO-lee KEH-meh so-lo-FEH-reh ton-go moh-khoh-geng nun KEH-ren" }
        ],
        tip: "💡 L'ordre est important : milliers → centaines → dizaines → unités, reliés par 'nŭn'.",
        keyPoints: [
          "Respecter l'ordre des constituants pour les nombres composés.",
          "'nŭn' relie les segments et se place entre chaque composant."
        ]
      }
    }
  ];

  const currentLessonData = lessons[currentLesson];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
{/* Overlay de fond couvrant toute la page */}
<div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AfricanPatterns patternType="kente" opacity={0.08} />
<img src="/7082095.jpg" alt="Motif ouest africain" className="absolute inset-0 object-cover w-full h-full opacity-[0.12]" />
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
      
      {/* Contenu de la page au-dessus du fond */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold gradient-text mb-6 font-gilroy">Leçons de Soussou</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Découvrez les secrets des nombres en Soussou à travers nos leçons interactives
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-6"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {currentLessonData.title}
            </h3>
            <p className="text-gray-600">
              Leçon {currentLesson + 1} sur {lessons.length}
            </p>
          </div>

          {/* Progress bar simple */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentLesson + 1) / lessons.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Lesson content */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg mb-6 border border-orange-100">
              <p className="text-gray-700 leading-relaxed">{currentLessonData.content.theory}</p>
            </div>

            {/* Examples */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 font-gilroy">
                <BookOpen className="w-5 h-5 text-orange-500" />
                Exemples pratiques :
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentLessonData.content.examples.map((example, index) => {
                  const colors = [
                    'from-orange-400 to-red-400',
                    'from-blue-400 to-purple-400', 
                    'from-green-400 to-teal-400',
                    'from-yellow-400 to-orange-400',
                    'from-purple-400 to-pink-400',
                    'from-teal-400 to-blue-400'
                  ];
                  return (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100 group cursor-pointer"
                    >
                      <div className="text-center">
                        <div className={`w-16 h-16 bg-gradient-to-r ${colors[index % colors.length]} rounded-full flex items-center justify-center mb-4 mx-auto text-white`}>
                          <span className="text-2xl font-bold">{example.number}</span>
                        </div>
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-3 border border-orange-100">
                          <div className="text-xl font-bold text-gray-800 mb-1">
                            {example.soussou}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 italic bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 mb-3">
                          [{example.pronunciation}]
                        </div>
                        <button className="flex items-center justify-center gap-2 mx-auto text-orange-500 hover:text-orange-600 transition-colors">
                          <Volume2 className="w-5 h-5" />
                          <span className="text-sm">Écouter</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          {/* Tip */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="w-6 h-6 text-blue-500" />
              <h4 className="text-lg font-semibold text-blue-600 font-gilroy">Conseil de Sagesse</h4>
            </div>
            <p className="text-gray-700 leading-relaxed">{currentLessonData.content.tip.replace('💡 ', '')}</p>
          </div>

          {/* Points clés */}
          {currentLessonData.content.keyPoints && currentLessonData.content.keyPoints.length > 0 && (
            <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Points clés à retenir</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {currentLessonData.content.keyPoints.map((kp, idx) => (
                  <li key={idx}>{kp}</li>
                ))}
              </ul>
            </div>
          )}
          </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-6">
          <button
            onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
            disabled={currentLesson === 0}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Précédent
          </button>
          
          <button
            onClick={() => setGameMode('menu')}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Menu Principal
          </button>
          
          <button
            onClick={() => setCurrentLesson(Math.min(lessons.length - 1, currentLesson + 1))}
            disabled={currentLesson === lessons.length - 1}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant →
          </button>
        </div>
        </motion.div>

      </div>
    </div>
  );
};

export default LessonsMode;