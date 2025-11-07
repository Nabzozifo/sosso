import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import AfricanPatterns, { AdinkraSymbol } from './AfricanPatterns';
import image1 from '../assets/7062114.jpg';
import image2 from '../assets/7078374.jpg';
import image3 from '../assets/7082095.jpg';
import { soussouNumbers } from '../data/soussouNumbers.generated';

const HomePage = ({ setGameMode }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // États pour les carrousels horizontaux
  const [testimonialsStartIndex, setTestimonialsStartIndex] = useState(0);
  const [logosStartIndex, setLogosStartIndex] = useState(0);
  
  // Auto-rotation des carrousels
  useEffect(() => {
    const visible = Math.min(3, testimonials.length);
    const maxIndex = Math.max(0, testimonials.length - visible);
    const id = setInterval(() => {
      setTestimonialsStartIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000); // avance toutes les 5s
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const logos = collaborationLogos.flat();
    const visible = Math.min(6, logos.length);
    const maxIndex = Math.max(0, logos.length - visible);
    const id = setInterval(() => {
      setLogosStartIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000); // avance toutes les 4s
    return () => clearInterval(id);
  }, []);
  
  const collaborationLogos = [
    [
      { name: "Université de Conakry", logo: "UC", color: "from-blue-500 to-blue-700" },
      { name: "Institut Culturel Guinéen", logo: "ICG", color: "from-green-500 to-green-700" },
      { name: "UNESCO", logo: "UNESCO", color: "from-purple-500 to-purple-700" },
      { name: "OIF", logo: "OIF", color: "from-red-500 to-red-700" }
    ],
    [
      { name: "Ministère Éducation", logo: "ME", color: "from-orange-500 to-orange-700" },
      { name: "Centre Culturel Franco-Guinéen", logo: "CCFG", color: "from-indigo-500 to-indigo-700" },
      { name: "Association Soussou", logo: "AS", color: "from-teal-500 to-teal-700" },
      { name: "Fondation Patrimoine", logo: "FP", color: "from-pink-500 to-pink-700" }
    ]
  ];
  
  const testimonials = [
    {
      name: "Aminata Diallo",
      role: "Étudiante",
      text: "Grâce à Sosso Game, j'ai redécouvert la beauté de ma langue maternelle. Les jeux sont captivants !",
      avatar: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      rating: 5
    },
    {
      name: "Mamadou Bah",
      role: "Enseignant",
      text: "Un outil pédagogique exceptionnel que j'utilise avec mes élèves. L'approche ludique fonctionne parfaitement.",
      avatar: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      ),
      rating: 5
    },
    {
      name: "Fatoumata Camara",
      role: "Parent",
      text: "Mes enfants adorent apprendre le Soussou avec cette application. C'est éducatif et amusant !",
      avatar: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      rating: 5
    },
    {
      name: "Ibrahim Touré",
      role: "Linguiste",
      text: "Une approche innovante pour préserver notre patrimoine linguistique. La qualité du contenu est remarquable.",
      avatar: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      ),
      rating: 5
    },
    {
      name: "Mariama Condé",
      role: "Directrice d'école",
      text: "Nous avons intégré Sosso Game dans notre programme. Les résultats sont impressionnants !",
      avatar: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      rating: 5
    },
    {
      name: "Alsény Bangoura",
      role: "Étudiant universitaire",
      text: "Parfait pour réviser mes bases en Soussou avant mes examens. Interface intuitive et contenu riche.",
      avatar: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      ),
      rating: 4
    },
    {
      name: "Hadja Kaba",
      role: "Grand-mère",
      text: "Je suis fière de voir mes petits-enfants apprendre notre langue avec tant d'enthousiasme !",
      avatar: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      rating: 5
    },
    {
      name: "Ousmane Sylla",
      role: "Développeur",
      text: "En tant que développeur, j'apprécie la qualité technique de l'application. Bravo à l'équipe !",
      avatar: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      ),
      rating: 5
    }
  ];



  const handleStartLearning = () => {
    setGameMode('menu');
    navigate('/jeu');
  };

  const features = [
    {
      icon: <AdinkraSymbol symbol="sankofa" size="w-8 h-8" color="text-white" />,
      title: t('culturalImportance'),
      description: t('culturalImportanceDesc'),
      color: 'from-orange-400 to-red-400',
      pattern: 'kente'
    },
    {
      icon: <AdinkraSymbol symbol="gye_nyame" size="w-8 h-8" color="text-white" />,
      title: t('cognitiveSkills'),
      description: t('cognitiveSkillsDesc'),
      color: 'from-yellow-400 to-orange-400',
      pattern: 'wax'
    },
    {
      icon: <AdinkraSymbol symbol="dwennimmen" size="w-8 h-8" color="text-white" />,
      title: t('communityConnection'),
      description: t('communityConnectionDesc'),
      color: 'from-red-400 to-pink-400',
      pattern: 'dogon'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 animate-gradient-shift">
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.h1 
                className="text-5xl lg:text-6xl font-bold mb-6 gradient-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                {t('welcomeTitle')}
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-700 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {t('welcomeSubtitle')}
              </motion.p>

              <motion.button
                onClick={handleStartLearning}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse-orange flex items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('startLearning')}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </motion.button>


            </motion.div>

            {/* Right Content - Children Images */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="bg-gradient-to-br from-orange-200 to-yellow-200 rounded-2xl p-4 shadow-lg overflow-hidden"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src={image1} alt={t('discoverSoussou')} className="w-full h-32 object-cover mb-2" />
                  <p className="text-sm font-medium text-orange-800 text-center">{t('discoverSoussou')}</p>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-red-200 to-pink-200 rounded-2xl p-4 shadow-lg overflow-hidden mt-8"
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src={image2} alt={t('preserveLanguage')} className="w-full h-32 object-cover mb-2" />
                  <p className="text-sm font-medium text-red-800 text-center">{t('preserveLanguage')}</p>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-yellow-200 to-orange-200 rounded-2xl p-4 shadow-lg overflow-hidden -mt-4 col-span-2"
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src={image3} alt={t('learnFun')} className="w-full h-32 object-cover mb-2" />
                  <p className="text-sm font-medium text-yellow-800 text-center">{t('learnFun')}</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Why Learn Section */}
      <div className="py-20 bg-white/50 backdrop-blur-sm relative">
        {/* Motif Bogolan en arrière-plan */}
        <AfricanPatterns patternType="bogolan" opacity={0.05} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold gradient-text mb-6">{t('whyLearnTitle')}</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {t('whyLearnContent')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mb-6 mx-auto animate-bounce-gentle relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20">
                    <AfricanPatterns patternType={feature.pattern} opacity={0.3} />
                  </div>
                  <div className="relative z-10">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bloc 3: Exemples - Design alterné (similaire au bloc 1) */}
      <div className="relative overflow-hidden py-20">
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
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold gradient-text mb-6 font-gilroy">Exemples d'Apprentissage</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Découvrez comment nos méthodes interactives rendent l'apprentissage du Soussou amusant et efficace
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {getHomeExamples().map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${example.color} rounded-full flex items-center justify-center mb-6 mx-auto animate-bounce-gentle text-white font-bold`}>
                  {example.number}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center font-gilroy">{example.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed mb-4">{example.description}</p>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border-l-4 border-orange-400">
                  <p className="text-center font-mono text-lg font-semibold text-gray-800">{example.example}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bloc 4: Témoignages - Design différent (similaire au bloc 2) */}
      <div className="py-20 bg-white/50 backdrop-blur-sm relative">
        <AfricanPatterns patternType="bogolan" opacity={0.05} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold gradient-text mb-6">Témoignages</h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Ce que disent nos utilisateurs de leur expérience d'apprentissage
            </p>
          </motion.div>

          {/* Carrousel horizontal des témoignages */}
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              <div className="overflow-hidden">
                <div className="flex gap-6 transition-transform duration-500 ease-in-out" 
                     style={{ transform: `translateX(-${testimonialsStartIndex * (100 / Math.min(3, testimonials.length))}%)` }}>
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100 flex-shrink-0"
                      style={{ width: `${100 / Math.min(3, testimonials.length)}%` }}
                    >
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center mr-4 text-white text-xl">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-xl">{testimonial.name}</h4>
                          <p className="text-gray-600 text-base">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-6 italic text-base leading-relaxed">"{testimonial.text}"</p>
                      <div className="flex justify-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Boutons de navigation - seulement si nécessaire */}
              {testimonials.length > 3 && (
                <>
                  <button
                    onClick={() => setTestimonialsStartIndex(Math.max(0, testimonialsStartIndex - 1))}
                    disabled={testimonialsStartIndex === 0}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setTestimonialsStartIndex(Math.min(testimonials.length - 3, testimonialsStartIndex + 1))}
                    disabled={testimonialsStartIndex >= testimonials.length - 3}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* Indicateurs - seulement si nécessaire */}
              {testimonials.length > 3 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: testimonials.length - 2 }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setTestimonialsStartIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === testimonialsStartIndex
                          ? 'bg-orange-600 scale-125'
                          : 'bg-orange-300 hover:bg-orange-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bloc 5: Collaboration - Design alterné (similaire au bloc 1) */}
      <div className="relative overflow-hidden py-20">
        {/* Motifs africains authentiques en arrière-plan */}
        <AfricanPatterns patternType="kente" opacity={0.08} />
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 right-10">
            <AdinkraSymbol symbol="sankofa" size="w-32 h-32" color="text-orange-400" />
          </div>
          <div className="absolute bottom-20 left-20">
            <AdinkraSymbol symbol="gye_nyame" size="w-40 h-40" color="text-red-400" />
          </div>
          <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2">
            <AdinkraSymbol symbol="dwennimmen" size="w-36 h-36" color="text-yellow-500" />
          </div>
        </div>

        <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold gradient-text mb-6">Collaboration & Partenariats</h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-12">
              Ensemble, préservons et promouvons la richesse linguistique de l'Afrique de l'Ouest
            </p>
            
            {/* Carrousel horizontal des logos de partenaires */}
            <div className="max-w-6xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-700 mb-6 text-center">Nos Partenaires</h3>
              <div className="relative">
                  <div className="overflow-hidden">
                    <div className="flex gap-6 transition-transform duration-500 ease-in-out" 
                         style={{ transform: `translateX(-${logosStartIndex * (100 / Math.min(6, collaborationLogos.flat().length))}%)` }}>
                      {collaborationLogos.flat().map((partner, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="flex flex-col items-center group cursor-pointer flex-shrink-0"
                          style={{ width: `${100 / Math.min(6, collaborationLogos.flat().length)}%` }}
                        >
                          <div className={`w-20 h-20 bg-gradient-to-r ${partner.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-all duration-300`}>
                            {partner.logo}
                          </div>
                          <span className="text-sm text-gray-600 mt-3 text-center max-w-24 leading-tight">
                            {partner.name}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Boutons de navigation - seulement si nécessaire */}
                  {collaborationLogos.flat().length > 6 && (
                    <>
                      <button
                        onClick={() => setLogosStartIndex(Math.max(0, logosStartIndex - 1))}
                        disabled={logosStartIndex === 0}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setLogosStartIndex(Math.min(collaborationLogos.flat().length - 6, logosStartIndex + 1))}
                        disabled={logosStartIndex >= collaborationLogos.flat().length - 6}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                  
                  {/* Indicateurs - seulement si nécessaire */}
                  {collaborationLogos.flat().length > 6 && (
                    <div className="flex justify-center mt-4 space-x-2">
                      {Array.from({ length: collaborationLogos.flat().length - 5 }, (_, index) => (
                        <button
                          key={index}
                          onClick={() => setLogosStartIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === logosStartIndex
                              ? 'bg-orange-600 scale-125'
                              : 'bg-orange-300 hover:bg-orange-400'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
            </div>
          </motion.div>

          {/* Bloc indépendant: Rejoignez Notre Mission */}
          <div className="relative z-10 py-20">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 border border-orange-100 shadow-lg"
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <AdinkraSymbol symbol="sankofa" size="w-10 h-10" color="text-orange-500" />
                  <h3 className="text-3xl font-bold text-gray-800">Rejoignez Notre Mission</h3>
                </div>
                <p className="text-gray-700 mb-10 leading-relaxed text-lg text-center">
                  Vous êtes une institution, une organisation ou un passionné de la culture Soussou ? 
                  Collaborons ensemble pour enrichir cette plateforme éducative.
                </p>
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Nous Contacter
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-white/50 backdrop-blur-sm relative">
        <AfricanPatterns patternType="bogolan" opacity={0.05} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative z-10">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 gradient-text">{t('readyToDiscover')}</h2>
            <p className="text-xl text-gray-800 mb-8 leading-relaxed max-w-3xl mx-auto">{t('joinCommunity')}</p>
            <motion.button
              onClick={() => setGameMode('menu')}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse-orange flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('startLearning')}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
  const getHomeExamples = () => {
    // Sélectionne des exemples représentatifs et corrects depuis le CSV généré
    const sample = [1, 21, 100, 250, 1000].map(n => soussouNumbers.find(x => x.number === n)).filter(Boolean);
    return [
      {
        title: "Conversion Nombres Simples",
        description: "Exemples corrects tirés du corpus Soussou (CSV)",
        number: sample[0]?.number || 1,
        example: `${sample[0]?.number || 1} → ${sample[0]?.soussou || '—'}`,
        color: 'from-orange-400 to-red-400'
      },
      {
        title: "Nombres Composés",
        description: "Structure avec liaison 'nŭn' et ordre des constituants",
        number: sample[1]?.number || 21,
        example: `${sample[1]?.number || 21} → ${sample[1]?.soussou || '—'}`,
        color: 'from-blue-400 to-purple-400'
      },
      {
        title: "Grands Nombres",
        description: "Centaines et milliers selon les règles du corpus",
        number: sample[3]?.number || 250,
        example: `${sample[3]?.number || 250} → ${sample[3]?.soussou || '—'}`,
        color: 'from-green-400 to-teal-400'
      }
    ];
  };