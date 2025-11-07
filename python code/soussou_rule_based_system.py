#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Système basé sur les règles pour la génération de nombres soussou
Utilise les règles morphologiques extraites pour générer des traductions
"""

import json
from typing import Dict, List, Tuple, Optional
import re

class SoussouRuleBasedSystem:
    def __init__(self, rules_path: Optional[str] = None):
        self.base_numbers = {}
        self.rules = {}
        
        # Règles de base intégrées (extraites de l'analyse)
        self._initialize_base_rules()
        
        if rules_path:
            self.load_rules(rules_path)
    
    def _initialize_base_rules(self):
        """Initialise les règles de base du système soussou"""
        
        # Nombres de base (1-9)
        self.base_numbers = {
            1: 'kérén',
            2: '̀fírín', 
            3: 'sàxán',
            4: 'náání',
            5: 'súlí',
            6: 'sénní',
            7: 'sólófèré',
            8: 'sólómásàxán',
            9: 'sólómánáání',
            10: 'fuú',
            20: 'm̀ɔx̀ɔǵɛŋ',
            100: 'k̀ɛḿɛ',
            1000: 'wúlù'
        }
        
        # Règles morphologiques
        self.rules = {
            'connectors': {
                'additive': 'nŭn',  # pour ajouter (11 = fuú nŭn kérén)
            },
            'formers': {
                'ten_former': 'tòngó',  # pour former les dizaines (30 = tòngó sàxán)
            },
            'patterns': {
                # Pattern pour 11-19: fuú nŭn + unité
                'teens': lambda unit: f"fuú nŭn {self.base_numbers[unit]}",
                
                # Pattern pour 21-29: m̀ɔx̀ɔǵɛŋ nŭn + unité  
                'twenties': lambda unit: f"m̀ɔx̀ɔǵɛŋ nŭn {self.base_numbers[unit]}",
                
                # Pattern pour 30, 40, 50, etc.: tòngó + multiplicateur
                'tens': lambda mult: f"tòngó {self.base_numbers[mult]}",
                
                # Pattern pour 31-39, 41-49, etc.: tòngó mult nŭn unité
                'compound_tens': lambda mult, unit: f"tòngó {self.base_numbers[mult]} nŭn {self.base_numbers[unit]}",
                
                # Pattern pour 101-109: k̀ɛḿɛ + unité
                'hundred_units': lambda unit: f"k̀ɛḿɛ {self.base_numbers[unit]}",
                
                # Pattern pour 110-119: k̀ɛḿɛ fuú nŭn unité
                'hundred_teens': lambda unit: f"k̀ɛḿɛ fuú nŭn {self.base_numbers[unit]}",
                
                # Pattern pour 120-199: k̀ɛḿɛ + (dizaines)
                'hundred_tens': lambda tens_part: f"k̀ɛḿɛ {tens_part}",
                
                # Pattern pour 200, 300, etc.: k̀ɛḿɛ + multiplicateur
                'hundreds': lambda mult: f"k̀ɛḿɛ {self.base_numbers[mult]}",
                
                # Pattern pour 1000+: wúlù + multiplicateur
                'thousands': lambda mult: f"wúlù {mult}" if mult != 'kérén' else 'wúlù kérén',
            }
        }
    
    def load_rules(self, rules_path: str):
        """Charge les règles depuis un fichier JSON"""
        try:
            with open(rules_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if 'base_numbers' in data:
                    self.base_numbers.update(data['base_numbers'])
                if 'morphological_rules' in data:
                    # Mise à jour des règles avec les données chargées
                    pass
            print(f"Règles chargées depuis: {rules_path}")
        except Exception as e:
            print(f"Erreur lors du chargement des règles: {e}")
    
    def number_to_soussou(self, number: int) -> str:
        """Convertit un nombre en sa représentation soussou"""
        if number < 1:
            return "Nombre invalide"
        
        # Cas de base directs
        if number in self.base_numbers:
            return self.base_numbers[number]
        
        # Décomposition hiérarchique
        return self._decompose_number(number)
    
    def _decompose_number(self, number: int) -> str:
        """Décompose un nombre selon les règles hiérarchiques soussou"""
        parts = []
        
        # Milliers
        if number >= 1000:
            thousands = number // 1000
            remainder = number % 1000
            
            if thousands == 1:
                parts.append('wúlù kérén')
            else:
                thousands_part = self._decompose_number(thousands)
                parts.append(f"wúlù {thousands_part}")
            
            if remainder > 0:
                parts.append(self._decompose_number(remainder))
            
            return ' '.join(parts)
        
        # Centaines
        if number >= 100:
            hundreds = number // 100
            remainder = number % 100
            
            if hundreds == 1:
                parts.append('k̀ɛḿɛ')
            else:
                parts.append(f"k̀ɛḿɛ {self.base_numbers[hundreds]}")
            
            if remainder > 0:
                remainder_part = self._decompose_number(remainder)
                parts.append(remainder_part)
            
            return ' '.join(parts)
        
        # Dizaines
        if number >= 20:
            return self._handle_tens(number)
        
        # Adolescents (11-19)
        if number >= 11:
            unit = number - 10
            return self.rules['patterns']['teens'](unit)
        
        # Unités (1-9) - ne devrait pas arriver ici car géré par les cas de base
        return self.base_numbers.get(number, f"ERREUR: {number}")
    
    def _handle_tens(self, number: int) -> str:
        """Gère les nombres de 20 à 99"""
        tens = number // 10
        units = number % 10
        
        if tens == 2:  # 20-29
            if units == 0:
                return 'm̀ɔx̀ɔǵɛŋ'
            else:
                return self.rules['patterns']['twenties'](units)
        
        else:  # 30-99
            tens_multiplier = tens - 2  # 30->3, 40->4, etc.
            if tens_multiplier > 9:
                # Pour les dizaines > 90, utiliser une approche différente
                tens_multiplier = tens_multiplier % 10 + (tens_multiplier // 10) * 10
            
            if units == 0:
                return self.rules['patterns']['tens'](tens_multiplier)
            else:
                return self.rules['patterns']['compound_tens'](tens_multiplier, units)
    
    def analyze_generation(self, number: int) -> Dict:
        """Analyse le processus de génération d'un nombre"""
        result = {
            'number': number,
            'translation': self.number_to_soussou(number),
            'decomposition': [],
            'rules_applied': []
        }
        
        # Trace la décomposition
        if number >= 1000:
            thousands = number // 1000
            remainder = number % 1000
            result['decomposition'].append(f"Milliers: {thousands}")
            result['rules_applied'].append('thousands_pattern')
            if remainder > 0:
                result['decomposition'].append(f"Reste: {remainder}")
        
        elif number >= 100:
            hundreds = number // 100
            remainder = number % 100
            result['decomposition'].append(f"Centaines: {hundreds}")
            result['rules_applied'].append('hundreds_pattern')
            if remainder > 0:
                result['decomposition'].append(f"Reste: {remainder}")
        
        elif number >= 20:
            tens = number // 10
            units = number % 10
            result['decomposition'].append(f"Dizaines: {tens}")
            result['rules_applied'].append('tens_pattern')
            if units > 0:
                result['decomposition'].append(f"Unités: {units}")
                result['rules_applied'].append('additive_connector')
        
        elif number >= 11:
            result['decomposition'].append(f"Base 10 + {number-10}")
            result['rules_applied'].append('teens_pattern')
        
        return result
    
    def batch_generate(self, numbers: List[int]) -> Dict[int, str]:
        """Génère les traductions pour une liste de nombres"""
        results = {}
        for number in numbers:
            results[number] = self.number_to_soussou(number)
        return results
    
    def validate_against_reference(self, reference_data: Dict[int, str]) -> Dict:
        """Valide les générations contre des données de référence"""
        validation_results = {
            'total_tested': 0,
            'correct': 0,
            'incorrect': 0,
            'accuracy': 0.0,
            'errors': []
        }
        
        for number, expected in reference_data.items():
            generated = self.number_to_soussou(number)
            validation_results['total_tested'] += 1
            
            if generated == expected:
                validation_results['correct'] += 1
            else:
                validation_results['incorrect'] += 1
                validation_results['errors'].append({
                    'number': number,
                    'expected': expected,
                    'generated': generated
                })
        
        if validation_results['total_tested'] > 0:
            validation_results['accuracy'] = validation_results['correct'] / validation_results['total_tested']
        
        return validation_results

class SoussouSemanticTokenizer:
    """Tokeniseur sémantique pour les nombres soussou"""
    
    def __init__(self):
        self.semantic_tokens = {
            # Tokens de base
            'UNIT_1': 'kérén',
            'UNIT_2': '̀fírín',
            'UNIT_3': 'sàxán', 
            'UNIT_4': 'náání',
            'UNIT_5': 'súlí',
            'UNIT_6': 'sénní',
            'UNIT_7': 'sólófèré',
            'UNIT_8': 'sólómásàxán',
            'UNIT_9': 'sólómánáání',
            
            # Tokens structurels
            'BASE_10': 'fuú',
            'BASE_20': 'm̀ɔx̀ɔǵɛŋ',
            'BASE_100': 'k̀ɛḿɛ',
            'BASE_1000': 'wúlù',
            
            # Tokens fonctionnels
            'CONNECTOR': 'nŭn',
            'TEN_FORMER': 'tòngó',
        }
        
        # Mapping inverse
        self.token_to_semantic = {v: k for k, v in self.semantic_tokens.items()}
    
    def tokenize_soussou_number(self, soussou_text: str) -> List[Tuple[str, str]]:
        """Tokenise un nombre soussou en tokens sémantiques"""
        tokens = []
        words = soussou_text.split()
        
        for word in words:
            if word in self.token_to_semantic:
                semantic_type = self.token_to_semantic[word]
                tokens.append((semantic_type, word))
            else:
                tokens.append(('UNKNOWN', word))
        
        return tokens
    
    def detokenize_to_number(self, tokens: List[Tuple[str, str]]) -> Optional[int]:
        """Convertit des tokens sémantiques en nombre"""
        # Implémentation simplifiée - à étendre
        number = 0
        current_value = 0
        
        i = 0
        while i < len(tokens):
            token_type, token_value = tokens[i]
            
            if token_type.startswith('UNIT_'):
                unit_value = int(token_type.split('_')[1])
                current_value += unit_value
            elif token_type == 'BASE_10':
                current_value += 10
            elif token_type == 'BASE_20':
                current_value += 20
            elif token_type == 'BASE_100':
                if current_value > 0:
                    number += current_value * 100
                    current_value = 0
                else:
                    number += 100
            elif token_type == 'BASE_1000':
                if current_value > 0:
                    number += current_value * 1000
                    current_value = 0
                else:
                    number += 1000
            elif token_type == 'CONNECTOR':
                # Le connecteur indique une addition
                pass
            
            i += 1
        
        number += current_value
        return number if number > 0 else None

if __name__ == "__main__":
    # Test du système basé sur les règles
    system = SoussouRuleBasedSystem()
    
    # Test de génération
    test_numbers = [1, 11, 21, 35, 100, 101, 150, 1000, 1001, 1234]
    
    print("=== TEST DU SYSTÈME BASÉ SUR LES RÈGLES ===")
    for num in test_numbers:
        translation = system.number_to_soussou(num)
        analysis = system.analyze_generation(num)
        print(f"\n{num}: {translation}")
        print(f"  Décomposition: {' → '.join(analysis['decomposition'])}")
        print(f"  Règles: {', '.join(analysis['rules_applied'])}")
    
    # Test du tokeniseur sémantique
    print("\n=== TEST DU TOKENISEUR SÉMANTIQUE ===")
    tokenizer = SoussouSemanticTokenizer()
    
    test_phrases = [
        "kérén",
        "fuú nŭn kérén", 
        "m̀ɔx̀ɔǵɛŋ nŭn sàxán",
        "k̀ɛḿɛ fuú nŭn súlí"
    ]
    
    for phrase in test_phrases:
        tokens = tokenizer.tokenize_soussou_number(phrase)
        reconstructed = tokenizer.detokenize_to_number(tokens)
        print(f"\n'{phrase}'")
        print(f"  Tokens: {tokens}")
        print(f"  Nombre reconstruit: {reconstructed}")