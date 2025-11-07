import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AdinkraSymbol } from './AfricanPatterns';
import AfricanPatterns from './AfricanPatterns';
import { TreePine, Target, Sparkles, BarChart3, Info } from 'lucide-react';
import apiService from '../services/api';
import { findSoussouNumber } from '../data/soussouNumbers.generated';
import DecisionTree from './DecisionTree';

// Composant pour afficher l'arbre morphologique
const MorphologicalTreeComponent = ({ tree }) => {
  if (!tree) return null;
  
  // Calculer les positions des nœuds pour un arbre équilibré et compact
  const calculateNodePositions = (node, level = 0, index = 0, parentX = 200) => {
    const positions = [];
    const nodeWidth = 80;
    const levelHeight = 80;
    const childSpacing = Math.max(100, 300 / Math.max(node.children?.length || 1, 1)); // Espacement adaptatif
    
    if (node.children && node.children.length > 0) {
      const totalWidth = (node.children.length - 1) * childSpacing;
      const startX = parentX - totalWidth / 2;
      
      node.children.forEach((child, i) => {
        const childX = startX + i * childSpacing;
        const childY = (level + 1) * levelHeight + 40;
        positions.push({
          node: child,
          x: childX,
          y: childY,
          level: level + 1,
          parentX: parentX,
          parentY: level * levelHeight + 40
        });
        
        // Récursion pour les petits-enfants
        positions.push(...calculateNodePositions(child, level + 1, i, childX));
      });
    }
    
    return positions;
  };

  const allPositions = [
    { node: tree, x: 200, y: 40, level: 0, parentX: null, parentY: null },
    ...calculateNodePositions(tree)
  ];

  // Calculer les dimensions de manière plus compacte
  const minX = Math.min(...allPositions.map(p => p.x));
  const maxX = Math.max(...allPositions.map(p => p.x));
  const maxY = Math.max(...allPositions.map(p => p.y));
  
  const svgWidth = Math.min(400, Math.max(350, maxX - minX + 120)); // Largeur limitée
  const svgHeight = Math.max(300, maxY + 80);
  
  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-green-800 flex items-center justify-center gap-2">
          🌳 Arbre Morphologique Magique
          <span className="text-sm font-normal text-gray-600">(Structure visuelle)</span>
        </div>
        <div className="text-sm text-green-600">Découvre comment le nombre se décompose !</div>
      </div>
      
      <div className="flex justify-center overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} className="border border-green-200 rounded-lg bg-white max-w-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          {/* Palette simple sans dégradés */}
          
          {/* Dessiner les branches (lignes de connexion) */}
          {allPositions.map((pos, index) => {
            if (pos.parentX !== null && pos.parentY !== null) {
              return (
                <g key={`branch-${index}`}>
                  <line
                    x1={pos.parentX}
                    y1={pos.parentY + 25}
                    x2={pos.x}
                    y2={pos.y - 25}
                    stroke="#059669"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Petites feuilles sur les branches */}
                  <circle
                    cx={(pos.parentX + pos.x) / 2 + (Math.random() - 0.5) * 20}
                    cy={(pos.parentY + pos.y) / 2 + (Math.random() - 0.5) * 20}
                    r="3"
                    fill="#22c55e"
                    opacity="0.7"
                  />
                </g>
              );
            }
            return null;
          })}
          
          {/* Dessiner les nœuds */}
          {allPositions.map((pos, index) => {
            return (
              <g key={`node-${index}`}>
                {/* Cercle du nœud */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={pos.level === 0 ? "24" : pos.level >= 3 ? "16" : "20"}
                  fill="#f9fafb"
                  stroke="#9ca3af"
                  strokeWidth="2"
                />
                
                {/* Étiquette avec la valeur */}
                <rect
                  x={pos.x - 35}
                  y={pos.y + (pos.level >= 3 ? 25 : 30)}
                  width="70"
                  height="24"
                  rx="8"
                  fill="#ffffff"
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                />
                
                <text
                  x={pos.x}
                  y={pos.y + (pos.level >= 3 ? 40 : 45)}
                  textAnchor="middle"
                  fontSize={pos.level >= 3 ? "10" : "11"}
                  fontWeight="bold"
                  fill="#374151"
                >
                  {pos.node.value}
                </text>
                
                {/* Texte soussou si disponible */}
                {pos.node.soussou_text && (
                  <text
                    x={pos.x}
                    y={pos.y + (pos.level >= 3 ? 58 : 65)}
                    textAnchor="middle"
                    fontSize={pos.level >= 3 ? "8" : "9"}
                    fill="#6b7280"
                  >
                    {pos.node.soussou_text}
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Décor minimal retiré pour un style épuré */}
        </svg>
      </div>
      
      {/* Légende (sans emojis) */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <div className="flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-gray-500"></span>
            <span>Racine</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-gray-400"></span>
            <span>Branches</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-gray-300"></span>
            <span>Feuilles</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExplorationMode = ({ explorationResult, setExplorationResult }) => {
  const [inputNumber, setInputNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    const numValue = parseInt(inputNumber, 10);
    if (!inputNumber || isNaN(numValue) || numValue < 1 || numValue > 9999) {
      setError('Veuillez entrer un nombre valide entre 1 et 9999');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Analyse statique depuis le module généré
      const found = findSoussouNumber(numValue);
      const soussouText = found?.soussou || found?.translation || '—';

      // Décomposition simple basée sur le texte (tokens séparés par 'nŭn' et espaces)
      const tokens = soussouText.split('nŭn').map(t => t.trim()).filter(Boolean);
      const parts = tokens.flatMap(t => t.split(' ').map(s => s.trim()).filter(Boolean));

      // Décomposition numérique de base
      const thousands = Math.floor(numValue / 1000);
      const hundreds = Math.floor((numValue % 1000) / 100);
      const tens = Math.floor((numValue % 100) / 10);
      const units = numValue % 10;

      const exploration = {
        number: numValue,
        translation: soussouText,
        soussou_translation: soussouText,
        pronunciation: undefined,
        morphological_decomposition: {
          tokens: parts,
          structure: {
            thousands,
            hundreds,
            tens,
            units
          }
        },
        morphological_rules_applied: [
          { rule_name: 'Ordre des constituants', description: 'milliers → centaines → dizaines → unités' },
          { rule_name: 'Liaison', description: "Les segments sont reliés par 'nŭn' pour former des nombres composés" }
        ],
        stats: {
          token_count: parts.length,
          segments: tokens.length
        },
        additional_info: {
          note: "Analyse statique basée sur la décomposition de la traduction Soussou",
          source: 'frontend-static-module'
        }
      };

      setExplorationResult(exploration);
    } catch (err) {
      console.error('Erreur lors de l\'analyse statique:', err);
      setError('Analyse indisponible pour ce nombre. Réessayez avec un autre.');
    } finally {
      setLoading(false);
    }
  };
  if (!explorationResult) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Section principale avec motifs - style exact de la page leçon */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Motifs africains authentiques en arrière-plan - Style exact du bloc 2 de l'accueil */}
          <AfricanPatterns patternType="bogolan" opacity={0.05} />
          <img src="/7082095.jpg" alt="Motif ouest africain" className="absolute inset-0 w-full h-full object-cover opacity-[0.12] pointer-events-none" />
        </div>
        
        <div className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold gradient-text mb-6">Mode Exploration</h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">Analyse de la formation des nombres en soussou</p>
            </div>

            <div className="text-center">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-orange-100 mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Prêt pour l'Exploration ?</h3>
                <p className="text-gray-600 text-lg mb-6">Plongez dans l'univers fascinant de la numération soussou et découvrez ses secrets millénaires</p>
                <div className="space-y-6">
                  {/* Input pour vérifier un nombre */}
                  <div className="relative max-w-md mx-auto">
                    <input
                      type="number"
                      value={inputNumber}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === '' || /^\d+$/.test(raw)) {
                          const value = raw === '' ? '' : Math.min(9999, parseInt(raw, 10));
                          setInputNumber(value === '' ? '' : String(value));
                          setError('');
                        }
                      }}
                      placeholder="Entrez un nombre (1-9999)"
                      className="w-full px-6 py-4 text-xl font-semibold bg-white border-2 border-orange-300 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-200 focus:outline-none transition-all duration-300 text-center placeholder-gray-500"
                      min="1"
                      max="9999"
                      onKeyPress={(e) => {
                        // Empêcher la saisie de caractères non numériques
                        if (!/[0-9]/.test(e.key) && e.key !== 'Enter' && e.key !== 'Backspace' && e.key !== 'Delete') {
                          e.preventDefault();
                        }
                        if (e.key === 'Enter') {
                          handleAnalyze();
                        }
                      }}
                    />
                  </div>
                  
                  {/* Messages d'erreur */}
                  {error && (
                    <div className="max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                  
                  {/* Bouton de vérification */}
                  <div className="max-w-md mx-auto">
                    <motion.button 
                      onClick={handleAnalyze}
                      disabled={loading || !inputNumber}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl text-lg font-bold transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse' }}
                    >
                       <Sparkles className="w-5 h-5" />
                       <span className="font-bold">{loading ? 'Analyse en cours...' : 'Analyser le nombre'}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
  
  // Render exploration result if available
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Section principale avec motifs - style exact de la page leçon */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Motifs africains authentiques en arrière-plan - Style exact du bloc 2 de l'accueil */}
        <AfricanPatterns patternType="bogolan" opacity={0.05} />
        <img src="/7062114.jpg" alt="Motif ouest africain" className="absolute inset-0 w-full h-full object-cover opacity-[0.12] pointer-events-none" />
      </div>
      
      <div className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header avec bouton retour */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setExplorationResult(null)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1"
          >
            Nouvelle Analyse
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Analyse Linguistique</h1>
            <p className="text-gray-600 text-lg">Nombre analysé: <span className="font-bold text-2xl text-orange-600">{explorationResult?.number || 'N/A'}</span></p>
          </div>
          <div className="w-32"></div>
        </div>

        {/* Résultat principal - Traduction Soussou */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-orange-100">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Traduction Soussou</h2>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl font-semibold text-gray-900 mb-2">
                {explorationResult?.soussou_translation || explorationResult?.translation || '—'}
              </div>
              <div className="text-sm text-gray-600">
                Prononciation : <span className="font-medium">{explorationResult?.pronunciation || explorationResult?.prononciation || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Arbre de décomposition morphologique */}
         <div className="grid lg:grid-cols-2 gap-8 mb-8">
           {/* Arbre visuel */}
           <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-100">
             <div className="flex items-center justify-center gap-3 mb-8">
               <TreePine className="w-8 h-8 text-green-600" />
               <h3 className="text-2xl font-bold text-gray-800">Arbre Morphologique</h3>
             </div>
             
             {/* Structure d'arbre visuelle */}
             <div className="relative">
               <DecisionTree explorationResult={explorationResult} />
             </div>
           </div>

          {/* Règles */}
           <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-100">
             <div className="flex items-center justify-center gap-3 mb-8">
               <Target className="w-8 h-8 text-purple-600" />
               <h3 className="text-2xl font-bold text-gray-800">Règles Appliquées</h3>
             </div>
             
             <div>
               {explorationResult?.morphological_rules_applied && explorationResult.morphological_rules_applied.length > 0 ? (
                 <div className="space-y-4">
                   {explorationResult.morphological_rules_applied.map((rule, index) => {
                     const magicColors = [
                       'from-purple-400 to-indigo-500',
                       'from-pink-400 to-rose-500',
                       'from-blue-400 to-purple-500',
                       'from-indigo-400 to-pink-500',
                       'from-violet-400 to-purple-500'
                     ];
                     const bgMagic = [
                       'border-purple-200 bg-purple-50/90',
                       'border-pink-200 bg-pink-50/90', 
                       'border-blue-200 bg-blue-50/90',
                       'border-indigo-200 bg-indigo-50/90',
                       'border-violet-200 bg-violet-50/90'
                     ];
                     
                     return (
                       <div key={index} className={`${bgMagic[index % bgMagic.length]} backdrop-blur-sm rounded-2xl p-6 border-2`}>
                         <div className="flex items-start gap-4">
                           <div className={`w-10 h-10 bg-gradient-to-r ${magicColors[index % magicColors.length]} rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white`}>
                             {index + 1}
                           </div>
                           <div className="flex-1">
                             <div className="font-bold text-purple-800 mb-2 text-lg">
                               {rule.rule_name || `Règle ${index + 1}`}
                             </div>
                             <div className="text-gray-700 text-base font-medium leading-relaxed">
                               {rule.description || rule.rule || (typeof rule === 'string' ? rule : JSON.stringify(rule))}
                             </div>
                           </div>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               ) : (
                 <div className="text-center py-12">
                   <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                   <h4 className="text-2xl font-bold text-purple-700 mb-4">Règles en Préparation</h4>
                   <p className="text-purple-600 text-lg font-medium">Les règles se préparent...</p>
                 </div>
               )}
             </div>
           </div>
        </div>

        {/* Explication détaillée de la formation du nombre */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-100">
          <div className="flex items-center justify-center gap-3 mb-6">
            <TreePine className="w-8 h-8 text-emerald-600" />
            <h3 className="text-2xl font-bold text-gray-800">Explication détaillée</h3>
          </div>
          {(() => {
            const s = explorationResult?.morphological_decomposition?.structure || {};
            const hasAny = ['thousands','hundreds','tens','units'].some(k => s[k] && Number(s[k]) > 0) || Object.values(s).some(v => Number(v) > 0);
            const ordered = Object.entries(s).sort(([a],[b]) => {
              const weight = (k) => {
                const t = String(k).toLowerCase();
                if (t.includes('mill')) return 0;
                if (t.includes('cent')) return 1;
                if (t.includes('diz') || t.includes('ten')) return 2;
                if (t.includes('uni')) return 3;
                return 4;
              };
              return weight(a) - weight(b);
            });
            const tokens = explorationResult?.morphological_decomposition?.tokens || [];
            const soussou = explorationResult?.soussou_translation || explorationResult?.translation || '';
            if (!hasAny) {
              return (
                <p className="text-gray-700 text-lg text-center">Aucune décomposition disponible.</p>
              );
            }
            return (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border">
                  <div className="text-lg text-gray-700 leading-relaxed">
                    <span className="font-semibold">Principe&nbsp;:</span> le nombre se forme en reliant les segments dans l’ordre <span className="font-semibold">milliers → centaines → dizaines → unités</span>, avec le lien «&nbsp;nŭn&nbsp;» pour les nombres composés.
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl border">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Étapes (racine → feuilles)</h4>
                    <ul className="space-y-3">
                      {ordered.map(([key, value]) => (
                        Number(value) > 0 ? (
                          <li key={key} className="flex items-start gap-3">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">
                              {(() => { const w = String(key).toLowerCase(); if (w.includes('mill')) return 'M'; if (w.includes('cent')) return 'C'; if (w.includes('diz')||w.includes('ten')) return 'D'; if (w.includes('uni')) return 'U'; return '·'; })()}
                            </span>
                            <div>
                              <div className="font-semibold capitalize">{key.replace('_',' ')}&nbsp;:&nbsp;<span className="text-gray-900">{value}</span></div>
                              <div className="text-gray-600 text-sm">Ajoute ce segment sous la branche correspondante.</div>
                            </div>
                          </li>
                        ) : null
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Formule textuelle (Soussou)</h4>
                    <div className="text-gray-800">
                      {tokens.length > 0 ? (
                        <div className="space-y-2">
                          <div className="text-lg font-semibold">Segments&nbsp;:</div>
                          <div className="flex flex-wrap gap-2">
                            {tokens.map((t, i) => (
                              <span key={i} className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 font-medium">{t}</span>
                            ))}
                          </div>
                          <div className="mt-4 text-sm text-gray-600">Assemblage&nbsp;:&nbsp;<span className="font-semibold text-gray-800">{tokens.join(' nŭn ')}</span></div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">{soussou || '—'}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Section simplifiée : suppression des statistiques et informations pour se concentrer sur l'arbre */}
      </div>
    </div>
  );
};

export default ExplorationMode;