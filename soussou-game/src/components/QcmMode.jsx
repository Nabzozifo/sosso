import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AfricanPatterns, { AdinkraSymbol } from './AfricanPatterns';
import { BookOpen, Target } from 'lucide-react';
import { soussouNumbers } from '../data/soussouNumbers.generated';

const buildQuestions = () => {
  const sampleNumbers = [1, 21, 35, 147, 250, 1000].map(n => soussouNumbers.find(x => x.number === n)).filter(Boolean);
  const questions = [];
  if (sampleNumbers[0]) {
    questions.push({
      question: `Comment s'écrit ${sampleNumbers[0].number} en Soussou ?`,
      options: [sampleNumbers[0].soussou, 'tòngó sàxán', 'k̀ɛḿɛ', 'wúlù kérén'],
      answer: sampleNumbers[0].soussou
    });
  }
  if (sampleNumbers[1]) {
    questions.push({
      question: `Quelle est la bonne écriture pour ${sampleNumbers[1].number} ?`,
      options: [sampleNumbers[1].soussou, 'fuú nŭn kérén', 'k̀ɛḿɛ kérén', 'wúlù ̀fírín'],
      answer: sampleNumbers[1].soussou
    });
  }
  questions.push({
    question: 'Quel mot relie les segments pour former un nombre composé ?',
    options: ['nŭn', 'tòngó', 'k̀ɛḿɛ', 'wúlù'],
    answer: 'nŭn'
  });
  questions.push({
    question: "Quel est l'ordre des constituants lors de la construction ?",
    options: [
      'milliers → centaines → dizaines → unités',
      'unités → dizaines → centaines → milliers',
      'dizaines → unités → centaines → milliers',
      'centaines → milliers → dizaines → unités'
    ],
    answer: 'milliers → centaines → dizaines → unités'
  });
  return questions;
};

const QcmMode = ({ setGameMode }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const questions = buildQuestions();
  const q = questions[current % questions.length];

  const submit = () => {
    if (selected == null) return;
    setResult(selected === q.answer ? 'correct' : 'incorrect');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Overlay de fond couvrant toute la page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AfricanPatterns patternType="kente" opacity={0.08} />
        <img src="/7062114.jpg" alt="Motif ouest africain" className="absolute inset-0 object-cover w-full h-full opacity-[0.12]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setGameMode('menu')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Retour au Jeu</button>
          <div className="flex items-center gap-2 text-gray-700">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span className="font-semibold">QCM – Compréhension</span>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-100 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-orange-600" />
            <h3 className="text-2xl font-bold text-gray-800">Question {current + 1}</h3>
          </div>

          <p className="text-lg font-semibold text-gray-800 mb-4">{q.question}</p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => { setSelected(opt); setResult(null); }}
                className={`text-left px-6 py-5 rounded-2xl border transition-all min-h-[72px] text-base sm:text-lg shadow-sm ${selected === opt ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white hover:bg-gray-50 hover:shadow-md'}`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={submit} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">Valider</button>
            {result && (
              <span className={`font-semibold ${result === 'correct' ? 'text-green-600' : 'text-red-600'}`}>{result === 'correct' ? 'Correct !' : 'Incorrect.'}</span>
            )}
            <button onClick={() => { setSelected(null); setResult(null); setCurrent(current + 1); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Suivante</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QcmMode;