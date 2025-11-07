#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Framework d'évaluation pour les différentes approches de génération de nombres soussou
Compare les performances des modèles basés sur les règles, hybrides et ML purs
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Tuple, Optional, Callable
import time
import json
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from collections import defaultdict
import re

from soussou_rule_based_system import SoussouRuleBasedSystem, SoussouSemanticTokenizer
from soussou_morphological_analyzer import SoussouMorphologicalAnalyzer

class SoussouEvaluationFramework:
    """Framework d'évaluation complet pour les modèles soussou"""
    
    def __init__(self, reference_csv_path: str):
        self.reference_csv_path = reference_csv_path
        self.reference_data = self._load_reference_data()
        self.models = {}
        self.evaluation_results = {}
        
    def _load_reference_data(self) -> Dict[int, str]:
        """Charge les données de référence"""
        data = pd.read_csv(self.reference_csv_path, sep=';', encoding='utf-8')
        reference = {}
        
        for _, row in data.iterrows():
            reference[row['Nombre']] = row['Traduction_soussou']
        
        print(f"Données de référence chargées: {len(reference)} entrées")
        return reference
    
    def register_model(self, name: str, model_instance, generate_function: Callable[[int], str]):
        """Enregistre un modèle pour l'évaluation"""
        self.models[name] = {
            'instance': model_instance,
            'generate': generate_function
        }
        print(f"Modèle '{name}' enregistré")
    
    def evaluate_model(self, model_name: str, test_range: Tuple[int, int] = None, 
                      sample_size: int = None) -> Dict:
        """Évalue un modèle spécifique"""
        if model_name not in self.models:
            raise ValueError(f"Modèle '{model_name}' non enregistré")
        
        model = self.models[model_name]
        
        # Déterminer les nombres à tester
        if test_range:
            test_numbers = list(range(test_range[0], test_range[1] + 1))
        elif sample_size:
            test_numbers = np.random.choice(list(self.reference_data.keys()), 
                                          size=min(sample_size, len(self.reference_data)), 
                                          replace=False)
        else:
            test_numbers = list(self.reference_data.keys())
        
        print(f"\nÉvaluation de '{model_name}' sur {len(test_numbers)} nombres...")
        
        results = {
            'model_name': model_name,
            'test_count': len(test_numbers),
            'correct': 0,
            'incorrect': 0,
            'errors': [],
            'performance_metrics': {},
            'timing': {},
            'detailed_analysis': {}
        }
        
        # Mesurer le temps d'exécution
        start_time = time.time()
        
        for i, number in enumerate(test_numbers):
            if i % 100 == 0 and i > 0:
                print(f"  Progression: {i}/{len(test_numbers)}")
            
            try:
                # Générer la traduction
                generated = model['generate'](number)
                expected = self.reference_data[number]
                
                # Comparer
                if self._compare_translations(generated, expected):
                    results['correct'] += 1
                else:
                    results['incorrect'] += 1
                    results['errors'].append({
                        'number': number,
                        'expected': expected,
                        'generated': generated,
                        'error_type': self._classify_error(expected, generated)
                    })
                    
            except Exception as e:
                results['incorrect'] += 1
                results['errors'].append({
                    'number': number,
                    'expected': self.reference_data[number],
                    'generated': f"ERREUR: {str(e)}",
                    'error_type': 'exception'
                })
        
        end_time = time.time()
        
        # Calculer les métriques
        results['accuracy'] = results['correct'] / results['test_count']
        results['error_rate'] = results['incorrect'] / results['test_count']
        results['timing']['total_time'] = end_time - start_time
        results['timing']['avg_time_per_number'] = results['timing']['total_time'] / results['test_count']
        
        # Analyse détaillée des erreurs
        results['detailed_analysis'] = self._analyze_errors(results['errors'])
        
        # Métriques de performance par catégorie
        results['performance_metrics'] = self._calculate_category_metrics(test_numbers, results['errors'])
        
        self.evaluation_results[model_name] = results
        
        print(f"  Précision: {results['accuracy']:.4f}")
        print(f"  Temps total: {results['timing']['total_time']:.2f}s")
        print(f"  Temps moyen: {results['timing']['avg_time_per_number']*1000:.2f}ms/nombre")
        
        return results
    
    def _compare_translations(self, generated: str, expected: str) -> bool:
        """Compare deux traductions (avec normalisation)"""
        # Normalisation simple
        gen_norm = re.sub(r'\s+', ' ', generated.strip().lower())
        exp_norm = re.sub(r'\s+', ' ', expected.strip().lower())
        
        return gen_norm == exp_norm
    
    def _classify_error(self, expected: str, generated: str) -> str:
        """Classifie le type d'erreur"""
        if "ERREUR" in generated or "erreur" in generated.lower():
            return 'generation_error'
        
        exp_words = expected.split()
        gen_words = generated.split()
        
        if len(exp_words) != len(gen_words):
            return 'length_mismatch'
        
        # Vérifier les connecteurs
        if 'nŭn' in expected and 'nŭn' not in generated:
            return 'missing_connector'
        if 'nŭn' not in expected and 'nŭn' in generated:
            return 'extra_connector'
        
        # Vérifier les bases
        bases = ['fuú', 'm̀ɔx̀ɔǵɛŋ', 'tòngó', 'k̀ɛḿɛ', 'wúlù']
        for base in bases:
            if base in expected and base not in generated:
                return f'missing_{base}'
            if base not in expected and base in generated:
                return f'extra_{base}'
        
        return 'other'
    
    def _analyze_errors(self, errors: List[Dict]) -> Dict:
        """Analyse détaillée des erreurs"""
        analysis = {
            'error_types': defaultdict(int),
            'error_by_range': defaultdict(int),
            'most_problematic_numbers': [],
            'pattern_analysis': {}
        }
        
        for error in errors:
            # Type d'erreur
            analysis['error_types'][error['error_type']] += 1
            
            # Plage de nombres
            number = error['number']
            if number < 10:
                range_key = '1-9'
            elif number < 20:
                range_key = '10-19'
            elif number < 100:
                range_key = '20-99'
            elif number < 1000:
                range_key = '100-999'
            else:
                range_key = '1000+'
            
            analysis['error_by_range'][range_key] += 1
        
        # Convertir defaultdict en dict normal pour la sérialisation
        analysis['error_types'] = dict(analysis['error_types'])
        analysis['error_by_range'] = dict(analysis['error_by_range'])
        
        return analysis
    
    def _calculate_category_metrics(self, test_numbers: List[int], errors: List[Dict]) -> Dict:
        """Calcule les métriques par catégorie de nombres"""
        categories = {
            'units': (1, 9),
            'teens': (10, 19),
            'tens': (20, 99),
            'hundreds': (100, 999),
            'thousands': (1000, 9999)
        }
        
        metrics = {}
        error_numbers = {error['number'] for error in errors}
        
        for category, (min_val, max_val) in categories.items():
            category_numbers = [n for n in test_numbers if min_val <= n <= max_val]
            if category_numbers:
                category_errors = [n for n in category_numbers if n in error_numbers]
                accuracy = (len(category_numbers) - len(category_errors)) / len(category_numbers)
                
                metrics[category] = {
                    'total': len(category_numbers),
                    'correct': len(category_numbers) - len(category_errors),
                    'errors': len(category_errors),
                    'accuracy': accuracy
                }
        
        return metrics
    
    def compare_models(self, test_range: Tuple[int, int] = None, sample_size: int = None) -> Dict:
        """Compare tous les modèles enregistrés"""
        print("\n=== COMPARAISON DES MODÈLES ===")
        
        comparison_results = {
            'models': list(self.models.keys()),
            'individual_results': {},
            'comparative_metrics': {},
            'ranking': {}
        }
        
        # Évaluer chaque modèle
        for model_name in self.models.keys():
            results = self.evaluate_model(model_name, test_range, sample_size)
            comparison_results['individual_results'][model_name] = results
        
        # Métriques comparatives
        comparison_results['comparative_metrics'] = self._calculate_comparative_metrics()
        
        # Classement
        comparison_results['ranking'] = self._rank_models()
        
        return comparison_results
    
    def _calculate_comparative_metrics(self) -> Dict:
        """Calcule les métriques comparatives entre modèles"""
        metrics = {
            'accuracy_comparison': {},
            'speed_comparison': {},
            'error_type_comparison': {},
            'category_performance': {}
        }
        
        for model_name, results in self.evaluation_results.items():
            metrics['accuracy_comparison'][model_name] = results['accuracy']
            metrics['speed_comparison'][model_name] = results['timing']['avg_time_per_number']
            
            # Comparaison par catégorie
            if model_name not in metrics['category_performance']:
                metrics['category_performance'][model_name] = {}
            
            for category, cat_metrics in results['performance_metrics'].items():
                metrics['category_performance'][model_name][category] = cat_metrics['accuracy']
        
        return metrics
    
    def _rank_models(self) -> Dict:
        """Classe les modèles selon différents critères"""
        ranking = {
            'by_accuracy': [],
            'by_speed': [],
            'by_overall_score': []
        }
        
        # Classement par précision
        accuracy_ranking = sorted(self.evaluation_results.items(), 
                                key=lambda x: x[1]['accuracy'], reverse=True)
        ranking['by_accuracy'] = [(name, results['accuracy']) for name, results in accuracy_ranking]
        
        # Classement par vitesse
        speed_ranking = sorted(self.evaluation_results.items(), 
                             key=lambda x: x[1]['timing']['avg_time_per_number'])
        ranking['by_speed'] = [(name, results['timing']['avg_time_per_number']) 
                              for name, results in speed_ranking]
        
        # Score global (combinaison précision et vitesse)
        overall_scores = []
        for name, results in self.evaluation_results.items():
            # Score normalisé (précision élevée = bon, temps faible = bon)
            accuracy_score = results['accuracy']
            speed_score = 1.0 / (1.0 + results['timing']['avg_time_per_number'] * 1000)  # Normaliser
            overall_score = 0.7 * accuracy_score + 0.3 * speed_score  # Pondération
            overall_scores.append((name, overall_score))
        
        ranking['by_overall_score'] = sorted(overall_scores, key=lambda x: x[1], reverse=True)
        
        return ranking
    
    def generate_report(self, output_path: str = "evaluation_report.json"):
        """Génère un rapport d'évaluation complet"""
        report = {
            'evaluation_summary': {
                'reference_data_size': len(self.reference_data),
                'models_evaluated': list(self.models.keys()),
                'evaluation_timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
            },
            'individual_results': self.evaluation_results,
            'comparative_analysis': self._calculate_comparative_metrics(),
            'model_ranking': self._rank_models(),
            'recommendations': self._generate_recommendations()
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2, default=str)
        
        print(f"\nRapport d'évaluation sauvegardé: {output_path}")
        return report
    
    def _generate_recommendations(self) -> Dict:
        """Génère des recommandations basées sur l'évaluation"""
        recommendations = {
            'best_overall_model': None,
            'best_for_accuracy': None,
            'best_for_speed': None,
            'improvement_suggestions': [],
            'use_case_recommendations': {}
        }
        
        if not self.evaluation_results:
            return recommendations
        
        # Meilleur modèle global
        ranking = self._rank_models()
        if ranking['by_overall_score']:
            recommendations['best_overall_model'] = ranking['by_overall_score'][0][0]
        
        if ranking['by_accuracy']:
            recommendations['best_for_accuracy'] = ranking['by_accuracy'][0][0]
        
        if ranking['by_speed']:
            recommendations['best_for_speed'] = ranking['by_speed'][0][0]
        
        # Suggestions d'amélioration
        for model_name, results in self.evaluation_results.items():
            if results['accuracy'] < 0.9:
                recommendations['improvement_suggestions'].append(
                    f"{model_name}: Précision faible ({results['accuracy']:.3f}), "
                    f"analyser les erreurs de type {list(results['detailed_analysis']['error_types'].keys())}"
                )
            
            if results['timing']['avg_time_per_number'] > 0.1:
                recommendations['improvement_suggestions'].append(
                    f"{model_name}: Temps de traitement élevé ({results['timing']['avg_time_per_number']*1000:.1f}ms), "
                    "optimiser les performances"
                )
        
        # Recommandations par cas d'usage
        recommendations['use_case_recommendations'] = {
            'production_high_volume': recommendations['best_for_speed'],
            'research_high_accuracy': recommendations['best_for_accuracy'],
            'general_purpose': recommendations['best_overall_model']
        }
        
        return recommendations
    
    def visualize_results(self, save_plots: bool = True):
        """Génère des visualisations des résultats"""
        if not self.evaluation_results:
            print("Aucun résultat à visualiser")
            return
        
        # Configuration des graphiques
        plt.style.use('seaborn-v0_8')
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        fig.suptitle('Évaluation des Modèles Soussou', fontsize=16)
        
        # 1. Comparaison de précision
        models = list(self.evaluation_results.keys())
        accuracies = [self.evaluation_results[model]['accuracy'] for model in models]
        
        axes[0, 0].bar(models, accuracies, color='skyblue')
        axes[0, 0].set_title('Précision par Modèle')
        axes[0, 0].set_ylabel('Précision')
        axes[0, 0].set_ylim(0, 1)
        for i, v in enumerate(accuracies):
            axes[0, 0].text(i, v + 0.01, f'{v:.3f}', ha='center')
        
        # 2. Comparaison de vitesse
        speeds = [self.evaluation_results[model]['timing']['avg_time_per_number'] * 1000 
                 for model in models]
        
        axes[0, 1].bar(models, speeds, color='lightcoral')
        axes[0, 1].set_title('Temps de Traitement par Modèle')
        axes[0, 1].set_ylabel('Temps (ms)')
        for i, v in enumerate(speeds):
            axes[0, 1].text(i, v + max(speeds)*0.01, f'{v:.1f}', ha='center')
        
        # 3. Distribution des types d'erreurs (premier modèle)
        if models:
            first_model = models[0]
            error_types = self.evaluation_results[first_model]['detailed_analysis']['error_types']
            if error_types:
                axes[1, 0].pie(error_types.values(), labels=error_types.keys(), autopct='%1.1f%%')
                axes[1, 0].set_title(f'Types d\'Erreurs - {first_model}')
        
        # 4. Performance par catégorie
        categories = ['units', 'teens', 'tens', 'hundreds', 'thousands']
        x = np.arange(len(categories))
        width = 0.35
        
        if len(models) >= 2:
            model1_scores = []
            model2_scores = []
            
            for cat in categories:
                score1 = self.evaluation_results[models[0]]['performance_metrics'].get(cat, {}).get('accuracy', 0)
                score2 = self.evaluation_results[models[1]]['performance_metrics'].get(cat, {}).get('accuracy', 0)
                model1_scores.append(score1)
                model2_scores.append(score2)
            
            axes[1, 1].bar(x - width/2, model1_scores, width, label=models[0], alpha=0.8)
            axes[1, 1].bar(x + width/2, model2_scores, width, label=models[1], alpha=0.8)
            axes[1, 1].set_title('Performance par Catégorie')
            axes[1, 1].set_ylabel('Précision')
            axes[1, 1].set_xticks(x)
            axes[1, 1].set_xticklabels(categories)
            axes[1, 1].legend()
        
        plt.tight_layout()
        
        if save_plots:
            plt.savefig('soussou_evaluation_results.png', dpi=300, bbox_inches='tight')
            print("Graphiques sauvegardés: soussou_evaluation_results.png")
        
        plt.show()

if __name__ == "__main__":
    # Test du framework d'évaluation
    evaluator = SoussouEvaluationFramework("nombres_soussou_1_9999.csv")
    
    # Enregistrer le modèle basé sur les règles
    rule_system = SoussouRuleBasedSystem()
    evaluator.register_model(
        "Rule-Based System",
        rule_system,
        rule_system.number_to_soussou
    )
    
    # Évaluation sur un échantillon
    print("=== ÉVALUATION DU SYSTÈME BASÉ SUR LES RÈGLES ===")
    results = evaluator.evaluate_model("Rule-Based System", sample_size=100)
    
    # Générer le rapport
    report = evaluator.generate_report("soussou_evaluation_report.json")
    
    # Afficher un résumé
    print("\n=== RÉSUMÉ DE L'ÉVALUATION ===")
    print(f"Précision: {results['accuracy']:.4f}")
    print(f"Erreurs: {results['incorrect']}/{results['test_count']}")
    print(f"Temps moyen: {results['timing']['avg_time_per_number']*1000:.2f}ms")
    
    if results['errors']:
        print("\nExemples d'erreurs:")
        for error in results['errors'][:5]:
            print(f"  {error['number']}: '{error['expected']}' → '{error['generated']}' ({error['error_type']})")
    
    # Visualisation (optionnelle)
    # evaluator.visualize_results()