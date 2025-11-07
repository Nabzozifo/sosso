#!/usr/bin/env python3
"""
Module d'Explication Complet pour les Nombres Soussou

Ce module fournit des explications détaillées sur la construction des nombres soussou,
avec des règles en langage naturel, des arbres de décomposition et des illustrations.
Il permet également d'inférer des nombres au-delà de 9999.

Auteur: Assistant IA
Date: 2024
"""

import json
import pandas as pd
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch
import numpy as np

@dataclass
class NumberComponent:
    """Représente un composant d'un nombre avec sa valeur et sa traduction."""
    value: int
    soussou_text: str
    component_type: str  # 'unit', 'ten', 'hundred', 'thousand', 'ten_thousand', etc.
    rule_applied: str
    explanation: str

@dataclass
class DecompositionTree:
    """Représente l'arbre de décomposition d'un nombre."""
    number: int
    soussou_translation: str
    components: List[NumberComponent]
    construction_steps: List[str]
    linguistic_rules: List[str]

class SoussouExplanationModule:
    """Module complet d'explication pour les nombres soussou."""
    
    def __init__(self, csv_path: str = 'nombres_soussou_1_9999.csv'):
        self.csv_path = csv_path
        self.data = self._load_data()
        self.base_numbers = self._extract_base_numbers()
        self.morphological_rules = self._extract_morphological_rules()
        self.linguistic_patterns = self._analyze_linguistic_patterns()
        
    def _load_data(self) -> pd.DataFrame:
        """Charge les données du fichier CSV."""
        try:
            return pd.read_csv(self.csv_path, sep=';')
        except Exception as e:
            print(f"Erreur lors du chargement des données: {e}")
            return pd.DataFrame()
    
    def _extract_base_numbers(self) -> Dict[int, str]:
        """Extrait les nombres de base du système soussou."""
        base_numbers = {}
        
        # Nombres de base identifiés
        key_numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 100, 1000]
        
        for num in key_numbers:
            if num <= len(self.data):
                row = self.data[self.data['Nombre'] == num]
                if not row.empty:
                    base_numbers[num] = row['Traduction_soussou'].iloc[0]
        
        return base_numbers
    
    def _extract_morphological_rules(self) -> Dict[str, Dict]:
        """Extrait les règles morphologiques de formation des nombres."""
        rules = {
            'base_units': {
                'range': (1, 9),
                'pattern': 'Formes lexicales uniques',
                'examples': {i: self.base_numbers.get(i, '') for i in range(1, 10)}
            },
            'ten': {
                'value': 10,
                'soussou': self.base_numbers.get(10, 'fuú'),
                'rule': 'Forme lexicale de base pour 10'
            },
            'teens': {
                'range': (11, 19),
                'pattern': 'fuú nŭn [unité]',
                'rule': '10 + connecteur + unité',
                'connector': 'nŭn'
            },
            'twenty': {
                'value': 20,
                'soussou': self.base_numbers.get(20, 'm̀ɔx̀ɔǵɛŋ'),
                'rule': 'Forme lexicale de base pour 20'
            },
            'twenties': {
                'range': (21, 29),
                'pattern': 'm̀ɔx̀ɔǵɛŋ nŭn [unité]',
                'rule': '20 + connecteur + unité'
            },
            'tens': {
                'range': (30, 90),
                'pattern': 'tòngó [multiplicateur]',
                'rule': 'Formateur de dizaines + multiplicateur',
                'former': 'tòngó'
            },
            'hundred': {
                'value': 100,
                'soussou': self.base_numbers.get(100, 'k̀ɛḿɛ'),
                'rule': 'Forme lexicale de base pour 100'
            },
            'hundreds': {
                'range': (200, 900),
                'pattern': 'k̀ɛḿɛ [multiplicateur]',
                'rule': '100 + multiplicateur'
            },
            'thousand': {
                'value': 1000,
                'soussou': self.base_numbers.get(1000, 'wúlù'),
                'rule': 'Forme lexicale de base pour 1000'
            },
            'thousands': {
                'range': (2000, 9000),
                'pattern': 'wúlù [multiplicateur]',
                'rule': '1000 + multiplicateur'
            }
        }
        return rules
    
    def _analyze_linguistic_patterns(self) -> Dict[str, str]:
        """Analyse les patterns linguistiques du soussou."""
        return {
            'additive_connector': {
                'form': 'nŭn',
                'function': 'Connecteur additif pour joindre les composants',
                'usage': 'Utilisé entre les unités de même niveau ou de niveaux différents'
            },
            'ten_former': {
                'form': 'tòngó',
                'function': 'Formateur de dizaines',
                'usage': 'Transforme les unités (3-9) en dizaines (30-90)'
            },
            'hierarchical_order': {
                'pattern': 'Milliers → Centaines → Dizaines → Unités',
                'rule': 'Construction hiérarchique du plus grand au plus petit'
            },
            'morphological_composition': {
                'type': 'Agglutinante',
                'description': 'Les composants se juxtaposent avec des connecteurs'
            }
        }
    
    def decompose_number(self, number: int) -> DecompositionTree:
        """Décompose un nombre et explique sa construction."""
        if number <= 9999 and number in self.data['Nombre'].values:
            # Utiliser la traduction existante
            row = self.data[self.data['Nombre'] == number]
            soussou_translation = row['Traduction_soussou'].iloc[0]
        else:
            # Générer pour les nombres > 9999
            soussou_translation = self._generate_large_number(number)
        
        components = self._extract_components(number)
        construction_steps = self._generate_construction_steps(number, components)
        linguistic_rules = self._identify_linguistic_rules(components)
        
        return DecompositionTree(
            number=number,
            soussou_translation=soussou_translation,
            components=components,
            construction_steps=construction_steps,
            linguistic_rules=linguistic_rules
        )
    
    def _extract_components(self, number: int) -> List[NumberComponent]:
        """Extrait les composants d'un nombre avec leurs explications."""
        components = []
        remaining = number
        
        # Traiter les milliers
        if remaining >= 1000:
            thousands = remaining // 1000
            remaining = remaining % 1000
            
            if thousands == 1:
                components.append(NumberComponent(
                    value=1000,
                    soussou_text='wúlù',
                    component_type='thousand',
                    rule_applied='Forme lexicale de base',
                    explanation='1000 se dit "wúlù" - forme lexicale unique'
                ))
            else:
                # Décomposer récursivement les milliers
                thousand_components = self._extract_components(thousands)
                for comp in thousand_components:
                    comp.component_type = f'thousand_{comp.component_type}'
                    comp.explanation = f'{comp.explanation} (dans les milliers)'
                components.extend(thousand_components)
                
                components.append(NumberComponent(
                    value=1000,
                    soussou_text='wúlù',
                    component_type='thousand_base',
                    rule_applied='Multiplicateur de milliers',
                    explanation=f'{thousands} milliers = {thousands} × 1000'
                ))
        
        # Traiter les centaines
        if remaining >= 100:
            hundreds = remaining // 100
            remaining = remaining % 100
            
            if hundreds == 1:
                components.append(NumberComponent(
                    value=100,
                    soussou_text='k̀ɛḿɛ',
                    component_type='hundred',
                    rule_applied='Forme lexicale de base',
                    explanation='100 se dit "k̀ɛḿɛ" - forme lexicale unique'
                ))
            else:
                unit_text = self.base_numbers.get(hundreds, str(hundreds))
                components.append(NumberComponent(
                    value=hundreds * 100,
                    soussou_text=f'k̀ɛḿɛ {unit_text}',
                    component_type='hundreds',
                    rule_applied='k̀ɛḿɛ + multiplicateur',
                    explanation=f'{hundreds} centaines = k̀ɛḿɛ + {unit_text}'
                ))
        
        # Traiter les dizaines et unités
        if remaining > 0:
            components.extend(self._extract_tens_and_units(remaining))
        
        return components
    
    def _extract_tens_and_units(self, number: int) -> List[NumberComponent]:
        """Extrait les composants des dizaines et unités."""
        components = []
        
        if number >= 20:
            tens = (number // 10) * 10
            units = number % 10
            
            if tens == 20:
                components.append(NumberComponent(
                    value=20,
                    soussou_text='m̀ɔx̀ɔǵɛŋ',
                    component_type='twenty',
                    rule_applied='Forme lexicale de base',
                    explanation='20 se dit "m̀ɔx̀ɔǵɛŋ" - forme lexicale unique'
                ))
            else:
                multiplier = tens // 10
                multiplier_text = self.base_numbers.get(multiplier, str(multiplier))
                components.append(NumberComponent(
                    value=tens,
                    soussou_text=f'tòngó {multiplier_text}',
                    component_type='tens',
                    rule_applied='tòngó + multiplicateur',
                    explanation=f'{tens} = tòngó + {multiplier_text} (formateur de dizaines)'
                ))
            
            if units > 0:
                unit_text = self.base_numbers.get(units, str(units))
                components.append(NumberComponent(
                    value=units,
                    soussou_text=unit_text,
                    component_type='unit',
                    rule_applied='Forme lexicale de base',
                    explanation=f'{units} se dit "{unit_text}" - forme lexicale unique'
                ))
        
        elif number >= 11:
            units = number - 10
            components.append(NumberComponent(
                value=10,
                soussou_text='fuú',
                component_type='ten',
                rule_applied='Forme lexicale de base',
                explanation='10 se dit "fuú" - forme lexicale unique'
            ))
            
            unit_text = self.base_numbers.get(units, str(units))
            components.append(NumberComponent(
                value=units,
                soussou_text=unit_text,
                component_type='unit',
                rule_applied='fuú nŭn + unité',
                explanation=f'Adolescent: 10 + {units} = fuú nŭn {unit_text}'
            ))
        
        elif number == 10:
            components.append(NumberComponent(
                value=10,
                soussou_text='fuú',
                component_type='ten',
                rule_applied='Forme lexicale de base',
                explanation='10 se dit "fuú" - forme lexicale unique'
            ))
        
        else:  # 1-9
            unit_text = self.base_numbers.get(number, str(number))
            components.append(NumberComponent(
                value=number,
                soussou_text=unit_text,
                component_type='unit',
                rule_applied='Forme lexicale de base',
                explanation=f'{number} se dit "{unit_text}" - forme lexicale unique'
            ))
        
        return components
    
    def _generate_construction_steps(self, number: int, components: List[NumberComponent]) -> List[str]:
        """Génère les étapes de construction du nombre."""
        steps = []
        steps.append(f"Décomposition du nombre {number}:")
        
        # Analyser la structure hiérarchique
        if number >= 1000:
            thousands = number // 1000
            remainder = number % 1000
            steps.append(f"1. Identifier les milliers: {thousands} × 1000 = {thousands * 1000}")
            if remainder > 0:
                steps.append(f"2. Reste à traiter: {remainder}")
        
        if number >= 100:
            hundreds = (number % 1000) // 100
            if hundreds > 0:
                steps.append(f"3. Identifier les centaines: {hundreds} × 100 = {hundreds * 100}")
        
        if number >= 10:
            tens = (number % 100) // 10
            if tens > 0:
                steps.append(f"4. Identifier les dizaines: {tens} × 10 = {tens * 10}")
        
        units = number % 10
        if units > 0:
            steps.append(f"5. Identifier les unités: {units}")
        
        # Étapes de construction linguistique
        steps.append("\nConstruction linguistique:")
        for i, comp in enumerate(components, 1):
            steps.append(f"{i}. {comp.explanation}")
        
        # Assemblage final
        soussou_parts = [comp.soussou_text for comp in components]
        final_translation = ' '.join(soussou_parts)
        steps.append(f"\nAssemblage final: {' + '.join(soussou_parts)} = {final_translation}")
        
        return steps
    
    def _identify_linguistic_rules(self, components: List[NumberComponent]) -> List[str]:
        """Identifie les règles linguistiques appliquées."""
        rules = []
        
        # Analyser les types de composants
        component_types = [comp.component_type for comp in components]
        
        if 'thousand' in str(component_types):
            rules.append("Règle des milliers: wúlù (1000) + multiplicateur pour les milliers multiples")
        
        if 'hundred' in str(component_types):
            rules.append("Règle des centaines: k̀ɛḿɛ (100) + multiplicateur pour les centaines multiples")
        
        if 'tens' in str(component_types):
            rules.append("Règle des dizaines: tòngó + multiplicateur (3-9) pour former 30-90")
        
        if 'twenty' in str(component_types):
            rules.append("Règle spéciale: 20 = m̀ɔx̀ɔǵɛŋ (forme lexicale unique)")
        
        if len(components) > 1:
            rules.append("Règle de composition: Assemblage hiérarchique (milliers → centaines → dizaines → unités)")
            rules.append("Connecteur additif: 'nŭn' pour joindre les composants de même niveau")
        
        return rules
    
    def _generate_large_number(self, number: int) -> str:
        """Génère la traduction pour les nombres > 9999."""
        if number == 0:
            return "sìfírí"  # Zéro en soussou
        
        parts = []
        remaining = number
        
        # Traiter les millions (si nécessaire)
        if remaining >= 1000000:
            millions = remaining // 1000000
            remaining = remaining % 1000000
            if millions == 1:
                parts.append("mìlíɔ̃")
            else:
                million_text = self._generate_large_number(millions)
                parts.append(f"mìlíɔ̃ {million_text}")
        
        # Traiter les milliers
        if remaining >= 1000:
            thousands = remaining // 1000
            remaining = remaining % 1000
            if thousands == 1:
                parts.append("wúlù")
            else:
                thousand_text = self._generate_large_number(thousands)
                parts.append(f"wúlù {thousand_text}")
        
        # Traiter les centaines
        if remaining >= 100:
            hundreds = remaining // 100
            remaining = remaining % 100
            if hundreds == 1:
                parts.append("k̀ɛḿɛ")
            else:
                hundred_text = self.base_numbers.get(hundreds, str(hundreds))
                parts.append(f"k̀ɛḿɛ {hundred_text}")
        
        # Traiter le reste (< 100)
        if remaining > 0:
            if remaining <= 9999 and remaining in self.data['Nombre'].values:
                row = self.data[self.data['Nombre'] == remaining]
                parts.append(row['Traduction_soussou'].iloc[0])
            else:
                # Générer récursivement
                parts.append(self._generate_small_number(remaining))
        
        return ' '.join(parts)
    
    def _generate_small_number(self, number: int) -> str:
        """Génère les nombres < 100."""
        if number in self.base_numbers:
            return self.base_numbers[number]
        
        if number < 10:
            return str(number)  # Fallback
        
        if 11 <= number <= 19:
            unit = number - 10
            unit_text = self.base_numbers.get(unit, str(unit))
            return f"fuú nŭn {unit_text}"
        
        if 21 <= number <= 29:
            unit = number - 20
            unit_text = self.base_numbers.get(unit, str(unit))
            return f"m̀ɔx̀ɔǵɛŋ nŭn {unit_text}"
        
        if number >= 30:
            tens = (number // 10)
            units = number % 10
            tens_text = self.base_numbers.get(tens, str(tens))
            
            if units == 0:
                return f"tòngó {tens_text}"
            else:
                unit_text = self.base_numbers.get(units, str(units))
                return f"tòngó {tens_text} nŭn {unit_text}"
        
        return str(number)  # Fallback
    
    def create_visual_tree(self, decomposition: DecompositionTree, save_path: str = None) -> None:
        """Crée une visualisation en arbre de la décomposition."""
        fig, ax = plt.subplots(1, 1, figsize=(14, 10))
        ax.set_xlim(0, 10)
        ax.set_ylim(0, 8)
        ax.axis('off')
        
        # Titre
        ax.text(5, 7.5, f'Décomposition du nombre {decomposition.number}', 
                ha='center', va='center', fontsize=16, fontweight='bold')
        ax.text(5, 7.2, f'Traduction: {decomposition.soussou_translation}', 
                ha='center', va='center', fontsize=12, style='italic')
        
        # Dessiner l'arbre hiérarchique
        self._draw_hierarchical_tree(ax, decomposition)
        
        # Ajouter les règles linguistiques
        self._add_linguistic_rules_box(ax, decomposition.linguistic_rules)
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
            print(f"Arbre de décomposition sauvegardé: {save_path}")
        
        plt.show()
    
    def _draw_hierarchical_tree(self, ax, decomposition: DecompositionTree) -> None:
        """Dessine l'arbre hiérarchique de décomposition."""
        components = decomposition.components
        
        # Organiser les composants par niveau hiérarchique
        levels = {
            'thousand': [],
            'hundred': [],
            'ten': [],
            'unit': []
        }
        
        for comp in components:
            if 'thousand' in comp.component_type:
                levels['thousand'].append(comp)
            elif 'hundred' in comp.component_type:
                levels['hundred'].append(comp)
            elif 'ten' in comp.component_type or comp.component_type == 'twenty':
                levels['ten'].append(comp)
            else:
                levels['unit'].append(comp)
        
        # Dessiner chaque niveau
        y_positions = {'thousand': 6, 'hundred': 5, 'ten': 4, 'unit': 3}
        colors = {'thousand': '#FF6B6B', 'hundred': '#4ECDC4', 'ten': '#45B7D1', 'unit': '#96CEB4'}
        
        for level_name, level_components in levels.items():
            if level_components:
                y = y_positions[level_name]
                x_start = 2
                x_spacing = 6 / max(len(level_components), 1)
                
                for i, comp in enumerate(level_components):
                    x = x_start + i * x_spacing
                    
                    # Dessiner la boîte du composant
                    box = FancyBboxPatch(
                        (x-0.8, y-0.3), 1.6, 0.6,
                        boxstyle="round,pad=0.1",
                        facecolor=colors[level_name],
                        edgecolor='black',
                        alpha=0.7
                    )
                    ax.add_patch(box)
                    
                    # Texte du composant
                    ax.text(x, y+0.1, f'{comp.value}', ha='center', va='center', 
                           fontweight='bold', fontsize=10)
                    ax.text(x, y-0.1, comp.soussou_text, ha='center', va='center', 
                           fontsize=8, style='italic')
                    
                    # Connecter au niveau supérieur
                    if level_name != 'thousand' and i == 0:
                        ax.plot([5, x], [y_positions[level_name]+0.7, y+0.3], 
                               'k-', alpha=0.5, linewidth=1)
        
        # Ajouter la racine
        root_box = FancyBboxPatch(
            (4.2, 6.7), 1.6, 0.6,
            boxstyle="round,pad=0.1",
            facecolor='#FFD93D',
            edgecolor='black',
            alpha=0.8
        )
        ax.add_patch(root_box)
        ax.text(5, 7, f'{decomposition.number}', ha='center', va='center', 
               fontweight='bold', fontsize=12)
    
    def _add_linguistic_rules_box(self, ax, rules: List[str]) -> None:
        """Ajoute une boîte avec les règles linguistiques."""
        # Boîte pour les règles
        rules_box = FancyBboxPatch(
            (0.2, 0.5), 9.6, 2,
            boxstyle="round,pad=0.2",
            facecolor='#F8F9FA',
            edgecolor='#6C757D',
            alpha=0.9
        )
        ax.add_patch(rules_box)
        
        # Titre des règles
        ax.text(5, 2.3, 'Règles Linguistiques Appliquées', 
               ha='center', va='center', fontsize=12, fontweight='bold')
        
        # Lister les règles
        for i, rule in enumerate(rules[:4]):  # Limiter à 4 règles pour l'affichage
            ax.text(0.5, 2 - i*0.3, f"• {rule}", 
                   ha='left', va='center', fontsize=9)
    
    def generate_explanation_report(self, number: int, save_path: str = None) -> Dict:
        """Génère un rapport complet d'explication pour un nombre."""
        decomposition = self.decompose_number(number)
        
        report = {
            'number': number,
            'soussou_translation': decomposition.soussou_translation,
            'decomposition': {
                'components': [
                    {
                        'value': comp.value,
                        'soussou_text': comp.soussou_text,
                        'type': comp.component_type,
                        'rule': comp.rule_applied,
                        'explanation': comp.explanation
                    } for comp in decomposition.components
                ],
                'construction_steps': decomposition.construction_steps,
                'linguistic_rules': decomposition.linguistic_rules
            },
            'morphological_analysis': {
                'base_numbers_used': [comp.value for comp in decomposition.components 
                                    if comp.component_type in ['unit', 'ten', 'hundred', 'thousand']],
                'connectors_used': ['nŭn' if len(decomposition.components) > 1 else None],
                'formers_used': ['tòngó' if any('tens' in comp.component_type for comp in decomposition.components) else None]
            },
            'inference_capability': {
                'can_generate_beyond_9999': number > 9999,
                'generation_method': 'Règles morphologiques + patterns hiérarchiques' if number > 9999 else 'Données CSV + validation'
            }
        }
        
        if save_path:
            with open(save_path, 'w', encoding='utf-8') as f:
                json.dump(report, f, ensure_ascii=False, indent=2)
            print(f"Rapport d'explication sauvegardé: {save_path}")
        
        return report
    
    def interactive_explanation(self) -> None:
        """Mode interactif pour explorer les explications."""
        print("=== Module d'Explication Interactif des Nombres Soussou ===")
        print("Tapez un nombre pour voir son explication complète.")
        print("Tapez 'quit' pour quitter.\n")
        
        while True:
            try:
                user_input = input("Entrez un nombre: ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'q']:
                    print("Au revoir!")
                    break
                
                number = int(user_input)
                
                if number < 0:
                    print("Veuillez entrer un nombre positif.")
                    continue
                
                print(f"\n{'='*60}")
                print(f"EXPLICATION COMPLÈTE DU NOMBRE {number}")
                print(f"{'='*60}")
                
                # Générer la décomposition
                decomposition = self.decompose_number(number)
                
                print(f"\n🔤 Traduction soussou: {decomposition.soussou_translation}")
                
                print("\n📊 Composants:")
                for i, comp in enumerate(decomposition.components, 1):
                    print(f"  {i}. {comp.value} → '{comp.soussou_text}' ({comp.component_type})")
                    print(f"     Règle: {comp.rule_applied}")
                    print(f"     Explication: {comp.explanation}")
                
                print("\n🔧 Étapes de construction:")
                for step in decomposition.construction_steps:
                    print(f"  {step}")
                
                print("\n📚 Règles linguistiques:")
                for rule in decomposition.linguistic_rules:
                    print(f"  • {rule}")
                
                # Proposer de créer une visualisation
                create_viz = input("\nVoulez-vous créer une visualisation? (o/n): ").strip().lower()
                if create_viz in ['o', 'oui', 'y', 'yes']:
                    viz_path = f"soussou_explanation_{number}.png"
                    self.create_visual_tree(decomposition, viz_path)
                
                print("\n" + "="*60 + "\n")
                
            except ValueError:
                print("Veuillez entrer un nombre valide.")
            except KeyboardInterrupt:
                print("\nAu revoir!")
                break
            except Exception as e:
                print(f"Erreur: {e}")

def main():
    """Fonction principale pour tester le module."""
    print("Initialisation du Module d'Explication Soussou...")
    
    # Créer le module
    explainer = SoussouExplanationModule()
    
    # Tester avec quelques nombres
    test_numbers = [42, 1234, 5678, 12345]
    
    print("\nTest des explications pour quelques nombres:")
    for num in test_numbers:
        print(f"\n--- Nombre {num} ---")
        decomposition = explainer.decompose_number(num)
        print(f"Traduction: {decomposition.soussou_translation}")
        print(f"Composants: {len(decomposition.components)}")
        print(f"Règles appliquées: {len(decomposition.linguistic_rules)}")
    
    # Générer un rapport complet
    print("\nGénération d'un rapport complet pour 1234...")
    report = explainer.generate_explanation_report(1234, 'explanation_report_1234.json')
    
    # Mode interactif
    print("\nLancement du mode interactif...")
    explainer.interactive_explanation()

if __name__ == "__main__":
    main()