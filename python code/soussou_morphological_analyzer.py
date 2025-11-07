#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Analyseur morphologique des nombres soussou
Extrait les règles de formation des nombres à partir du dataset CSV
"""

import pandas as pd
import re
from typing import Dict, List, Tuple, Optional
from collections import defaultdict
import json

class SoussouMorphologicalAnalyzer:
    def __init__(self, csv_path: str):
        self.csv_path = csv_path
        self.data = None
        self.base_numbers = {}
        self.morphological_rules = {}
        self.load_data()
        self.extract_base_numbers()
        self.extract_morphological_rules()
    
    def load_data(self):
        """Charge les données du fichier CSV"""
        try:
            self.data = pd.read_csv(self.csv_path, sep=';', encoding='utf-8')
            print(f"Données chargées: {len(self.data)} entrées")
        except Exception as e:
            print(f"Erreur lors du chargement: {e}")
    
    def extract_base_numbers(self):
        """Extrait les nombres de base (1-9, 10, 20, 100, 1000)"""
        # Nombres de base 1-9
        for i in range(1, 10):
            if i <= len(self.data):
                self.base_numbers[i] = self.data.iloc[i-1]['Traduction_soussou']
        
        # Nombres spéciaux
        special_numbers = {10: 'fuú', 20: 'm̀ɔx̀ɔǵɛŋ', 100: 'k̀ɛḿɛ', 1000: 'wúlù'}
        for num, word in special_numbers.items():
            if num <= len(self.data):
                self.base_numbers[num] = self.data.iloc[num-1]['Traduction_soussou']
        
        print("Nombres de base extraits:")
        for num, word in sorted(self.base_numbers.items()):
            print(f"  {num}: {word}")
    
    def extract_morphological_rules(self):
        """Extrait les règles morphologiques de formation"""
        rules = {
            'units': {},  # 1-9
            'teens': {},  # 11-19
            'tens': {},   # 20, 30, 40, etc.
            'hundreds': {},  # 100, 200, 300, etc.
            'thousands': {}, # 1000, 2000, etc.
            'connectors': set(),
            'patterns': {}
        }
        
        # Analyse des unités (1-9)
        for i in range(1, 10):
            if i in self.base_numbers:
                rules['units'][i] = self.base_numbers[i]
        
        # Analyse des nombres 11-19 (fuú nŭn X)
        for i in range(11, 20):
            if i <= len(self.data):
                translation = self.data.iloc[i-1]['Traduction_soussou']
                if 'fuú nŭn' in translation:
                    unit_part = translation.replace('fuú nŭn ', '')
                    rules['teens'][i] = {'pattern': 'fuú nŭn {unit}', 'unit': unit_part}
                    rules['connectors'].add('nŭn')
        
        # Analyse des dizaines (20, 30, 40, etc.)
        # 20 = m̀ɔx̀ɔǵɛŋ, 30 = tòngó sàxán, 40 = tòngó náání
        for i in [20, 30, 40, 50, 60, 70, 80, 90]:
            if i <= len(self.data):
                translation = self.data.iloc[i-1]['Traduction_soussou']
                if i == 20:
                    rules['tens'][i] = {'base': 'm̀ɔx̀ɔǵɛŋ', 'pattern': 'm̀ɔx̀ɔǵɛŋ'}
                elif 'tòngó' in translation:
                    multiplier = translation.replace('tòngó ', '')
                    rules['tens'][i] = {'base': 'tòngó', 'multiplier': multiplier, 'pattern': 'tòngó {multiplier}'}
        
        # Analyse des centaines
        for i in [100, 200, 300, 400, 500, 600, 700, 800, 900]:
            if i <= len(self.data):
                translation = self.data.iloc[i-1]['Traduction_soussou']
                if i == 100:
                    rules['hundreds'][i] = {'base': 'k̀ɛḿɛ', 'pattern': 'k̀ɛḿɛ'}
                elif 'k̀ɛḿɛ' in translation:
                    multiplier = translation.replace('k̀ɛḿɛ ', '')
                    rules['hundreds'][i] = {'base': 'k̀ɛḿɛ', 'multiplier': multiplier, 'pattern': 'k̀ɛḿɛ {multiplier}'}
        
        # Analyse des milliers
        for i in [1000, 2000, 3000, 4000, 5000]:
            if i <= len(self.data):
                translation = self.data.iloc[i-1]['Traduction_soussou']
                if i == 1000:
                    rules['thousands'][i] = {'base': 'wúlù kérén', 'pattern': 'wúlù kérén'}
                elif 'wúlù' in translation:
                    multiplier = translation.replace('wúlù ', '')
                    rules['thousands'][i] = {'base': 'wúlù', 'multiplier': multiplier, 'pattern': 'wúlù {multiplier}'}
        
        # Patterns de composition
        rules['patterns'] = {
            'compound_addition': 'nŭn',  # pour ajouter des unités
            'ten_formation': 'tòngó',    # pour former les dizaines
            'hundred_base': 'k̀ɛḿɛ',     # base des centaines
            'thousand_base': 'wúlù',     # base des milliers
        }
        
        self.morphological_rules = rules
        print("\nRègles morphologiques extraites:")
        print(f"  Unités: {len(rules['units'])} règles")
        print(f"  Adolescents: {len(rules['teens'])} règles")
        print(f"  Dizaines: {len(rules['tens'])} règles")
        print(f"  Centaines: {len(rules['hundreds'])} règles")
        print(f"  Milliers: {len(rules['thousands'])} règles")
        print(f"  Connecteurs: {rules['connectors']}")
    
    def analyze_number_structure(self, number: int) -> Dict:
        """Analyse la structure d'un nombre donné"""
        if number > len(self.data):
            return {'error': 'Nombre hors de portée'}
        
        translation = self.data.iloc[number-1]['Traduction_soussou']
        
        structure = {
            'number': number,
            'translation': translation,
            'components': [],
            'pattern_type': self._identify_pattern_type(number),
            'morphemes': self._extract_morphemes(translation)
        }
        
        return structure
    
    def _identify_pattern_type(self, number: int) -> str:
        """Identifie le type de pattern pour un nombre"""
        if 1 <= number <= 9:
            return 'unit'
        elif 11 <= number <= 19:
            return 'teen'
        elif number == 10 or number == 20:
            return 'base_ten'
        elif 21 <= number <= 99:
            return 'compound_ten'
        elif number == 100:
            return 'base_hundred'
        elif 101 <= number <= 999:
            return 'compound_hundred'
        elif number == 1000:
            return 'base_thousand'
        elif number > 1000:
            return 'compound_thousand'
        else:
            return 'unknown'
    
    def _extract_morphemes(self, translation: str) -> List[str]:
        """Extrait les morphèmes d'une traduction"""
        # Sépare par les espaces et identifie les morphèmes
        morphemes = []
        parts = translation.split()
        
        for part in parts:
            if part in self.base_numbers.values():
                morphemes.append(('base', part))
            elif part == 'nŭn':
                morphemes.append(('connector', part))
            elif part == 'tòngó':
                morphemes.append(('ten_former', part))
            elif part == 'k̀ɛḿɛ':
                morphemes.append(('hundred_base', part))
            elif part == 'wúlù':
                morphemes.append(('thousand_base', part))
            else:
                morphemes.append(('unknown', part))
        
        return morphemes
    
    def save_rules(self, output_path: str):
        """Sauvegarde les règles extraites"""
        # Convertir les sets en listes pour la sérialisation JSON
        rules_serializable = self.morphological_rules.copy()
        rules_serializable['connectors'] = list(rules_serializable['connectors'])
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump({
                'base_numbers': self.base_numbers,
                'morphological_rules': rules_serializable
            }, f, ensure_ascii=False, indent=2)
        
        print(f"Règles sauvegardées dans: {output_path}")
    
    def generate_rule_summary(self) -> str:
        """Génère un résumé des règles découvertes"""
        summary = []
        summary.append("=== RÈGLES MORPHOLOGIQUES SOUSSOU ===")
        summary.append("")
        
        summary.append("1. NOMBRES DE BASE:")
        for num in sorted(self.base_numbers.keys()):
            summary.append(f"   {num} → {self.base_numbers[num]}")
        summary.append("")
        
        summary.append("2. RÈGLES DE FORMATION:")
        summary.append("   • Unités (1-9): Formes de base")
        summary.append("   • Adolescents (11-19): fuú nŭn + unité")
        summary.append("   • Vingtaine (20): m̀ɔx̀ɔǵɛŋ")
        summary.append("   • Dizaines (30-90): tòngó + multiplicateur")
        summary.append("   • Centaine (100): k̀ɛḿɛ")
        summary.append("   • Centaines (200+): k̀ɛḿɛ + multiplicateur")
        summary.append("   • Millier (1000): wúlù kérén")
        summary.append("   • Milliers (2000+): wúlù + multiplicateur")
        summary.append("")
        
        summary.append("3. CONNECTEURS:")
        summary.append(f"   • nŭn: connecteur additif")
        summary.append(f"   • tòngó: formateur de dizaines")
        summary.append("")
        
        summary.append("4. PATTERNS COMPOSITIONNELS:")
        summary.append("   • Addition: [base] nŭn [unité]")
        summary.append("   • Multiplication: [base] [multiplicateur]")
        summary.append("   • Hiérarchie: milliers > centaines > dizaines > unités")
        
        return "\n".join(summary)

if __name__ == "__main__":
    # Test de l'analyseur
    analyzer = SoussouMorphologicalAnalyzer("nombres_soussou_1_9999.csv")
    
    # Génère le résumé des règles
    print("\n" + analyzer.generate_rule_summary())
    
    # Sauvegarde les règles
    analyzer.save_rules("soussou_morphological_rules.json")
    
    # Test sur quelques nombres
    test_numbers = [1, 11, 21, 100, 101, 1000, 1001]
    print("\n=== ANALYSE DE STRUCTURE ===")
    for num in test_numbers:
        structure = analyzer.analyze_number_structure(num)
        print(f"\n{num}: {structure['translation']}")
        print(f"  Type: {structure['pattern_type']}")
        print(f"  Morphèmes: {structure['morphemes']}")