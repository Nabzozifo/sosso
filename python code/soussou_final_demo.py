#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Démonstration finale du système de traduction de nombres soussou
Comparaison des différentes approches développées
"""

import time
import json
import pandas as pd
from soussou_improved_system import ImprovedSoussouSystem
from soussou_rule_based_system import SoussouRuleBasedSystem, SoussouSemanticTokenizer
from soussou_morphological_analyzer import SoussouMorphologicalAnalyzer

class SoussouFinalDemo:
    def __init__(self):
        self.csv_file = 'nombres_soussou_1_9999.csv'
        self.systems = {}
        self.initialize_systems()
    
    def initialize_systems(self):
        """Initialise tous les systèmes"""
        print("=== INITIALISATION DES SYSTÈMES ===")
        
        # Système amélioré (le meilleur)
        print("Chargement du système amélioré...")
        self.systems['improved'] = ImprovedSoussouSystem(self.csv_file)
        
        # Système basé sur les règles original
        print("Chargement du système de règles original...")
        self.systems['rule_based'] = SoussouRuleBasedSystem('soussou_morphological_rules.json')
        
        # Tokeniseur sémantique
        print("Chargement du tokeniseur sémantique...")
        self.systems['tokenizer'] = SoussouSemanticTokenizer()
        
        print("Tous les systèmes initialisés!\n")
    
    def benchmark_systems(self, test_numbers=None):
        """Compare les performances des différents systèmes"""
        if test_numbers is None:
            test_numbers = [1, 5, 11, 21, 35, 67, 100, 150, 234, 500, 789, 1000, 1234, 1999, 2500, 3456, 5000, 7890, 9999]
        
        print("=== BENCHMARK DES SYSTÈMES ===")
        print(f"Test sur {len(test_numbers)} nombres\n")
        
        results = {}
        
        for system_name, system in self.systems.items():
            print(f"Test du système: {system_name}")
            start_time = time.time()
            
            correct = 0
            total = len(test_numbers)
            errors = []
            
            for num in test_numbers:
                try:
                    if system_name == 'improved':
                        generated = system.generate_number_improved(num)
                        expected = system.get_real_translation(num)
                    elif system_name == 'rule_based':
                        generated = system.generate_number(num)
                        expected = system.get_reference_translation(num)
                    elif system_name == 'tokenizer':
                        # Pour le tokenizer, on teste la reconstruction
                        expected = system.rule_system.get_reference_translation(num)
                        if expected:
                            tokens = system.tokenize(expected)
                            generated = system.detokenize(tokens)
                        else:
                            generated = None
                    
                    if generated and expected and generated.strip() == expected.strip():
                        correct += 1
                    else:
                        errors.append({
                            'number': num,
                            'generated': generated,
                            'expected': expected
                        })
                
                except Exception as e:
                    errors.append({
                        'number': num,
                        'error': str(e)
                    })
            
            end_time = time.time()
            
            accuracy = correct / total if total > 0 else 0
            avg_time = (end_time - start_time) / total * 1000  # ms par nombre
            
            results[system_name] = {
                'accuracy': accuracy,
                'correct': correct,
                'total': total,
                'avg_time_ms': avg_time,
                'errors': errors[:3]  # Premiers 3 erreurs
            }
            
            print(f"  Précision: {accuracy:.4f} ({correct}/{total})")
            print(f"  Temps moyen: {avg_time:.2f}ms/nombre")
            print()
        
        return results
    
    def demonstrate_features(self):
        """Démontre les fonctionnalités de chaque système"""
        print("=== DÉMONSTRATION DES FONCTIONNALITÉS ===")
        
        test_numbers = [1, 11, 21, 100, 1234, 5678]
        
        for num in test_numbers:
            print(f"\nNombre: {num}")
            
            # Système amélioré
            improved_result = self.systems['improved'].generate_number_improved(num)
            print(f"  Système amélioré: {improved_result}")
            
            # Analyse morphologique
            if hasattr(self.systems['improved'], 'get_real_translation'):
                real = self.systems['improved'].get_real_translation(num)
                if real:
                    # Tokenisation sémantique
                    tokens = self.systems['tokenizer'].tokenize(real)
                    print(f"  Tokens sémantiques: {tokens}")
                    
                    # Reconstruction
                    reconstructed = self.systems['tokenizer'].detokenize(tokens)
                    print(f"  Reconstruction: {reconstructed}")
    
    def generate_report(self, results):
        """Génère un rapport de comparaison"""
        print("=== RAPPORT DE COMPARAISON ===")
        
        # Classement par précision
        sorted_systems = sorted(results.items(), key=lambda x: x[1]['accuracy'], reverse=True)
        
        print("\nClassement par précision:")
        for i, (name, result) in enumerate(sorted_systems, 1):
            print(f"{i}. {name}: {result['accuracy']:.4f} ({result['correct']}/{result['total']})")
        
        # Classement par vitesse
        sorted_by_speed = sorted(results.items(), key=lambda x: x[1]['avg_time_ms'])
        
        print("\nClassement par vitesse:")
        for i, (name, result) in enumerate(sorted_by_speed, 1):
            print(f"{i}. {name}: {result['avg_time_ms']:.2f}ms/nombre")
        
        # Recommandation
        best_system = sorted_systems[0]
        print(f"\n🏆 SYSTÈME RECOMMANDÉ: {best_system[0]}")
        print(f"   Précision: {best_system[1]['accuracy']:.4f}")
        print(f"   Vitesse: {best_system[1]['avg_time_ms']:.2f}ms/nombre")
        
        # Sauvegarde du rapport
        report_data = {
            'timestamp': time.time(),
            'results': results,
            'recommendation': best_system[0]
        }
        
        with open('soussou_final_report.json', 'w', encoding='utf-8') as f:
            json.dump(report_data, f, ensure_ascii=False, indent=2)
        
        print("\nRapport sauvegardé: soussou_final_report.json")
    
    def interactive_demo(self):
        """Démonstration interactive"""
        print("=== DÉMONSTRATION INTERACTIVE ===")
        print("Entrez des nombres pour voir leur traduction (ou 'quit' pour quitter)")
        
        while True:
            try:
                user_input = input("\nNombre: ").strip()
                if user_input.lower() in ['quit', 'exit', 'q']:
                    break
                
                number = int(user_input)
                if 1 <= number <= 9999:
                    result = self.systems['improved'].generate_number_improved(number)
                    real = self.systems['improved'].get_real_translation(number)
                    
                    print(f"Traduction: {result}")
                    if real and result != real:
                        print(f"Référence:  {real}")
                    
                    # Tokenisation
                    if real:
                        tokens = self.systems['tokenizer'].tokenize(real)
                        print(f"Tokens: {[token[0] for token in tokens]}")
                else:
                    print("Veuillez entrer un nombre entre 1 et 9999")
            
            except ValueError:
                print("Veuillez entrer un nombre valide")
            except KeyboardInterrupt:
                break
        
        print("\nAu revoir!")

def main():
    print("🔢 SYSTÈME DE TRADUCTION DE NOMBRES SOUSSOU 🔢")
    print("=" * 50)
    
    demo = SoussouFinalDemo()
    
    # Benchmark complet
    results = demo.benchmark_systems()
    
    # Démonstration des fonctionnalités
    demo.demonstrate_features()
    
    # Génération du rapport
    demo.generate_report(results)
    
    # Démonstration interactive (optionnelle)
    print("\nVoulez-vous essayer la démonstration interactive? (y/n)")
    if input().lower().startswith('y'):
        demo.interactive_demo()

if __name__ == "__main__":
    main()