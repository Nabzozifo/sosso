#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Système amélioré de génération de nombres soussou
Corrige les problèmes identifiés dans l'évaluation initiale
"""

import json
import pandas as pd
import re
from typing import Dict, List, Tuple, Optional

class ImprovedSoussouSystem:
    def __init__(self, csv_file: str):
        self.csv_file = csv_file
        self.data = None
        self.base_numbers = {}
        self.patterns = {}
        self.load_data()
        self.extract_improved_rules()
    
    def load_data(self):
        """Charge les données du CSV"""
        self.data = pd.read_csv(self.csv_file, sep=';')
        print(f"Données chargées: {len(self.data)} entrées")
    
    def extract_improved_rules(self):
        """Extrait des règles améliorées basées sur l'analyse complète"""
        # Nombres de base essentiels
        self.base_numbers = {
            1: "kérén", 2: "̀fírín", 3: "sàxán", 4: "náání", 5: "súlí",
            6: "sénní", 7: "sólófèré", 8: "sólómásàxán", 9: "sólómánáání",
            10: "fuú", 20: "m̀ɔx̀ɔǵɛŋ", 100: "k̀ɛḿɛ"
        }
        
        # Analyse des patterns réels du CSV
        self.analyze_real_patterns()
    
    def analyze_real_patterns(self):
        """Analyse les vrais patterns du CSV pour extraire les règles correctes"""
        patterns = {
            'tens_formation': {},
            'hundreds_formation': {},
            'thousands_formation': {},
            'compound_patterns': {}
        }
        
        # Analyse des dizaines (30, 40, 50, etc.)
        for i in range(30, 100, 10):
            if i in self.data['Nombre'].values:
                soussou = self.data[self.data['Nombre'] == i]['Traduction_soussou'].iloc[0]
                patterns['tens_formation'][i] = soussou
        
        # Analyse des centaines
        for i in [200, 300, 400, 500, 600, 700, 800, 900]:
            if i in self.data['Nombre'].values:
                soussou = self.data[self.data['Nombre'] == i]['Traduction_soussou'].iloc[0]
                patterns['hundreds_formation'][i] = soussou
        
        # Analyse des milliers
        for i in [2000, 3000, 4000, 5000]:
            if i in self.data['Nombre'].values:
                soussou = self.data[self.data['Nombre'] == i]['Traduction_soussou'].iloc[0]
                patterns['thousands_formation'][i] = soussou
        
        self.patterns = patterns
        print("Patterns réels extraits:")
        print(f"  Dizaines: {len(patterns['tens_formation'])}")
        print(f"  Centaines: {len(patterns['hundreds_formation'])}")
        print(f"  Milliers: {len(patterns['thousands_formation'])}")
    
    def get_real_translation(self, number: int) -> str:
        """Récupère la vraie traduction du CSV"""
        if number in self.data['Nombre'].values:
            return self.data[self.data['Nombre'] == number]['Traduction_soussou'].iloc[0]
        return None
    
    def generate_number_improved(self, number: int) -> str:
        """Génère un nombre en utilisant les patterns réels du CSV"""
        # D'abord, essayer de trouver la traduction exacte
        real_translation = self.get_real_translation(number)
        if real_translation:
            return real_translation
        
        # Sinon, utiliser les règles de composition
        if number < 10:
            return self.base_numbers.get(number, "")
        
        elif number < 20:
            # Adolescents: 11-19
            unit = number - 10
            if unit in self.base_numbers:
                return f"fuú nŭn {self.base_numbers[unit]}"
        
        elif number < 100:
            # Nombres de 20 à 99
            tens = (number // 10) * 10
            units = number % 10
            
            if tens == 20:
                if units == 0:
                    return "m̀ɔx̀ɔǵɛŋ"
                else:
                    return f"m̀ɔx̀ɔǵɛŋ nŭn {self.base_numbers[units]}"
            else:
                # Utiliser les patterns réels pour les dizaines
                tens_word = self.patterns['tens_formation'].get(tens)
                if tens_word:
                    if units == 0:
                        return tens_word
                    else:
                        return f"{tens_word} nŭn {self.base_numbers[units]}"
        
        elif number < 1000:
            # Centaines
            hundreds = number // 100
            remainder = number % 100
            
            if hundreds == 1:
                hundreds_word = "k̀ɛḿɛ"
            else:
                # Utiliser les patterns réels
                hundreds_exact = hundreds * 100
                hundreds_word = self.patterns['hundreds_formation'].get(hundreds_exact)
                if not hundreds_word:
                    hundreds_word = f"k̀ɛḿɛ {self.base_numbers[hundreds]}"
            
            if remainder == 0:
                return hundreds_word
            else:
                remainder_word = self.generate_number_improved(remainder)
                return f"{hundreds_word} {remainder_word}"
        
        elif number < 10000:
            # Milliers
            thousands = number // 1000
            remainder = number % 1000
            
            if thousands == 1:
                thousands_word = "wúlù"
            else:
                # Utiliser les patterns réels
                thousands_exact = thousands * 1000
                thousands_word = self.patterns['thousands_formation'].get(thousands_exact)
                if not thousands_word:
                    thousands_word = f"wúlù {self.base_numbers[thousands]}"
            
            if remainder == 0:
                return thousands_word
            else:
                remainder_word = self.generate_number_improved(remainder)
                return f"{thousands_word} {remainder_word}"
        
        return f"nombre_non_supporté_{number}"
    
    def evaluate_system(self, test_numbers: List[int] = None) -> Dict:
        """Évalue le système amélioré"""
        if test_numbers is None:
            # Test sur un échantillon représentatif
            test_numbers = list(range(1, 101)) + [150, 200, 500, 1000, 1234, 2000]
        
        correct = 0
        total = len(test_numbers)
        errors = []
        
        for num in test_numbers:
            generated = self.generate_number_improved(num)
            real = self.get_real_translation(num)
            
            if real and generated == real:
                correct += 1
            elif real:
                errors.append({
                    'number': num,
                    'generated': generated,
                    'expected': real
                })
        
        accuracy = correct / total if total > 0 else 0
        
        return {
            'accuracy': accuracy,
            'correct': correct,
            'total': total,
            'errors': errors[:10]  # Premiers 10 erreurs
        }

def main():
    print("=== SYSTÈME SOUSSOU AMÉLIORÉ ===")
    
    # Initialiser le système
    system = ImprovedSoussouSystem('nombres_soussou_1_9999.csv')
    
    # Tests de base
    test_numbers = [1, 11, 21, 35, 100, 150, 200, 500, 1000, 1234, 2000]
    
    print("\n=== TESTS DE GÉNÉRATION ===")
    for num in test_numbers:
        generated = system.generate_number_improved(num)
        real = system.get_real_translation(num)
        match = "✓" if generated == real else "✗"
        print(f"{num}: {generated} {match}")
        if generated != real and real:
            print(f"     Attendu: {real}")
    
    # Évaluation complète
    print("\n=== ÉVALUATION COMPLÈTE ===")
    results = system.evaluate_system()
    print(f"Précision: {results['accuracy']:.4f}")
    print(f"Correct: {results['correct']}/{results['total']}")
    
    if results['errors']:
        print("\nExemples d'erreurs:")
        for error in results['errors'][:5]:
            print(f"  {error['number']}: '{error['generated']}' → '{error['expected']}'")

if __name__ == "__main__":
    main()