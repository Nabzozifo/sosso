#!/usr/bin/env python3
"""
Module d'Explication Amélioré pour les Nombres Soussou

Ce module génère des explications détaillées avec des arbres morphologiques
visuels et des règles adaptées aux enfants.

Auteur: Assistant IA
Date: 2024
"""

import json
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict, field
import re

@dataclass
class MorphologicalNode:
    """Représente un nœud dans l'arbre morphologique."""
    value: int
    soussou_text: str
    morpheme_type: str  # 'root', 'prefix', 'suffix', 'compound'
    position: str  # 'left', 'right', 'center'
    level: int  # niveau dans l'arbre (0 = racine)
    rule_id: str
    explanation: str
    children: List['MorphologicalNode'] = field(default_factory=list)
    
    def __post_init__(self):
        if self.children is None:
            self.children = []

@dataclass
class MorphologicalRule:
    """Représente une règle morphologique."""
    rule_id: str
    name: str
    description: str
    pattern: str
    examples: List[str]
    child_friendly_explanation: str
    visual_representation: str

@dataclass
class ConstructionStep:
    """Représente une étape de construction."""
    step_number: int
    action: str
    component: str
    value: str
    result: str
    rule_applied: str
    child_explanation: str
    visual_icon: str

class EnhancedSoussouExplanation:
    """Module d'explication amélioré pour les nombres soussou."""
    
    def __init__(self):
        self.morphological_rules = self._initialize_morphological_rules()
        self.base_morphemes = self._initialize_base_morphemes()
        self.construction_patterns = self._initialize_construction_patterns()
        
    def _initialize_morphological_rules(self) -> Dict[str, MorphologicalRule]:
        """Initialise les règles morphologiques détaillées."""
        return {
            'UNIT_BASE': MorphologicalRule(
                rule_id='UNIT_BASE',
                name='Nombres de Base (1-9)',
                description='Les nombres de 1 à 9 sont des morphèmes de base uniques',
                pattern='[morphème_base]',
                examples=['kérén (1)', 'fírín (2)', 'sàxán (3)'],
                child_friendly_explanation='Ces nombres sont comme des mots magiques spéciaux ! Chaque nombre a son propre mot unique.',
                visual_representation='🌟'
            ),
            'TEN_FORMATION': MorphologicalRule(
                rule_id='TEN_FORMATION',
                name='Formation des Dizaines',
                description='Formation des nombres 10, 20, 30, etc.',
                pattern='[base] + [marqueur_dizaine]',
                examples=['fuú (10)', 'm̀ɔx̀ɔǵɛŋ (20)', 'tòngó sàxán (30)'],
                child_friendly_explanation='Pour faire les dizaines, on utilise des mots spéciaux comme "fuú" pour 10 !',
                visual_representation='🔟'
            ),
            'ADDITIVE_COMPOSITION': MorphologicalRule(
                rule_id='ADDITIVE_COMPOSITION',
                name='Composition Additive',
                description='Addition de composants avec le connecteur "nŭn"',
                pattern='[composant1] + nŭn + [composant2]',
                examples=['fuú nŭn kérén (11)', 'm̀ɔx̀ɔǵɛŋ nŭn fírín (22)'],
                child_friendly_explanation='Le mot "nŭn" est comme un pont qui relie deux nombres ensemble !',
                visual_representation='🌉'
            ),
            'HUNDRED_FORMATION': MorphologicalRule(
                rule_id='HUNDRED_FORMATION',
                name='Formation des Centaines',
                description='Formation avec le morphème "k̀ɛḿɛ" (cent)',
                pattern='k̀ɛḿɛ + [nombre] + [reste]',
                examples=['k̀ɛḿɛ (100)', 'k̀ɛḿɛ fírín (200)'],
                child_friendly_explanation='"k̀ɛḿɛ" veut dire cent ! C\'est comme avoir 100 bonbons dans un grand sac !',
                visual_representation='💯'
            ),
            'THOUSAND_FORMATION': MorphologicalRule(
                rule_id='THOUSAND_FORMATION',
                name='Formation des Milliers',
                description='Formation avec le morphème "wúlù" (mille)',
                pattern='wúlù + [nombre] + [reste]',
                examples=['wúlù (1000)', 'wúlù fírín (2000)'],
                child_friendly_explanation='"wúlù" veut dire mille ! C\'est énorme, comme 1000 étoiles dans le ciel !',
                visual_representation='⭐'
            )
        }
    
    def _initialize_base_morphemes(self) -> Dict[int, Dict[str, str]]:
        """Initialise les morphèmes de base avec leurs propriétés."""
        return {
            1: {'text': 'kérén', 'type': 'root', 'meaning': 'un', 'icon': '1️⃣'},
            2: {'text': 'fírín', 'type': 'root', 'meaning': 'deux', 'icon': '2️⃣'},
            3: {'text': 'sàxán', 'type': 'root', 'meaning': 'trois', 'icon': '3️⃣'},
            4: {'text': 'náání', 'type': 'root', 'meaning': 'quatre', 'icon': '4️⃣'},
            5: {'text': 'súlí', 'type': 'root', 'meaning': 'cinq', 'icon': '5️⃣'},
            6: {'text': 'sénní', 'type': 'root', 'meaning': 'six', 'icon': '6️⃣'},
            7: {'text': 'sólómá', 'type': 'root', 'meaning': 'sept', 'icon': '7️⃣'},
            8: {'text': 'sólómánáání', 'type': 'compound', 'meaning': 'huit', 'icon': '8️⃣'},
            9: {'text': 'sólómásúlí', 'type': 'compound', 'meaning': 'neuf', 'icon': '9️⃣'},
            10: {'text': 'fuú', 'type': 'root', 'meaning': 'dix', 'icon': '🔟'},
            20: {'text': 'm̀ɔx̀ɔǵɛŋ', 'type': 'root', 'meaning': 'vingt', 'icon': '2️⃣0️⃣'},
            100: {'text': 'k̀ɛḿɛ', 'type': 'classifier', 'meaning': 'cent', 'icon': '💯'},
            1000: {'text': 'wúlù', 'type': 'classifier', 'meaning': 'mille', 'icon': '⭐'}
        }
    
    def _get_number_text(self, number: int) -> str:
        """Obtient le texte soussou pour un nombre, gérant les nombres composés."""
        if number in self.base_morphemes:
            return self.base_morphemes[number]['text']
        
        # Pour les nombres composés, on utilise la logique de décomposition
        components = self._decompose_number(number)
        parts = []
        
        for component in components:
            if component['type'] in ['unit', 'ten', 'twenty']:
                parts.append(component['morpheme'])
            elif component['type'] == 'hundred':
                if component['base_value'] == 1:
                    parts.append('k̀ɛḿɛ')
                else:
                    base_text = self._get_number_text(component['base_value']) if component['base_value'] <= 9 else str(component['base_value'])
                    parts.append(f"{base_text} k̀ɛḿɛ")
            elif component['type'] == 'thousand':
                if component['base_value'] == 1:
                    parts.append('wúlù')
                else:
                    base_text = self._get_number_text(component['base_value']) if component['base_value'] <= 9 else str(component['base_value'])
                    parts.append(f"{base_text} wúlù")
        
        return ' nŭn '.join(parts) if len(parts) > 1 else parts[0] if parts else str(number)
    
    def _initialize_construction_patterns(self) -> Dict[str, Dict]:
        """Initialise les patterns de construction."""
        return {
            'simple': {'range': (1, 9), 'pattern': 'morphème_base'},
            'teens': {'range': (11, 19), 'pattern': 'fuú + nŭn + unité'},
            'twenties': {'range': (21, 29), 'pattern': 'm̀ɔx̀ɔǵɛŋ + nŭn + unité'},
            'tens': {'range': (30, 99), 'pattern': 'tòngó + dizaine + [nŭn + unité]'},
            'hundreds': {'range': (100, 999), 'pattern': ' k̀ɛḿɛ + [unité +] [reste]'},
            'thousands': {'range': (1000, 9999), 'pattern': 'wúlù + [unité +] [reste]'}
        }
    
    def generate_morphological_tree(self, number: int) -> MorphologicalNode:
        """Génère un arbre morphologique détaillé pour un nombre."""
        root = MorphologicalNode(
            value=number,
            soussou_text=self._convert_number_to_soussou(number),
            morpheme_type='root',
            position='center',
            level=0,
            rule_id='ROOT',
            explanation=f'Nombre complet: {number}'
        )
        
        # Décomposer le nombre en composants
        components = self._decompose_number(number)
        
        # Construire l'arbre récursivement
        for i, component in enumerate(components):
            child_node = self._create_component_node(component, i + 1)
            root.children.append(child_node)
        
        return root
    
    def _decompose_number(self, number: int) -> List[Dict]:
        """Décompose un nombre en ses composants morphologiques."""
        components = []
        remaining = number
        
        # Milliers
        if remaining >= 1000:
            thousands = remaining // 1000
            remaining = remaining % 1000
            
            components.append({
                'value': thousands * 1000,
                'base_value': thousands,
                'type': 'thousand',
                'morpheme': 'wúlù',
                'rule': 'THOUSAND_FORMATION'
            })
        
        # Centaines
        if remaining >= 100:
            hundreds = remaining // 100
            remaining = remaining % 100
            
            components.append({
                'value': hundreds * 100,
                'base_value': hundreds,
                'type': 'hundred',
                'morpheme': 'k̀ɛḿɛ',
                'rule': 'HUNDRED_FORMATION'
            })
        
        # Dizaines et unités
        if remaining > 0:
            if remaining >= 20:
                tens = remaining // 10
                units = remaining % 10
                if tens == 2:
                    components.append({
                        'value': 20,
                        'base_value': 20,
                        'type': 'twenty',
                        'morpheme': 'm̀ɔx̀ɔǵɛŋ',
                        'rule': 'TEN_FORMATION'
                    })
                else:
                    components.append({
                        'value': tens * 10,
                        'base_value': tens,
                        'type': 'ten',
                        'morpheme': 'tòngó',
                        'rule': 'TEN_FORMATION'
                    })
                
                if units > 0:
                    components.append({
                        'value': units,
                        'base_value': units,
                        'type': 'unit',
                        'morpheme': self.base_morphemes[units]['text'],
                        'rule': 'ADDITIVE_COMPOSITION'
                    })
            
            elif remaining >= 10:
                if remaining == 10:
                    components.append({
                        'value': 10,
                        'base_value': 10,
                        'type': 'ten',
                        'morpheme': 'fuú',
                        'rule': 'TEN_FORMATION'
                    })
                else:  # 11-19
                    components.append({
                        'value': 10,
                        'base_value': 10,
                        'type': 'ten',
                        'morpheme': 'fuú',
                        'rule': 'TEN_FORMATION'
                    })
                    units = remaining - 10
                    components.append({
                        'value': units,
                        'base_value': units,
                        'type': 'unit',
                        'morpheme': self.base_morphemes[units]['text'],
                        'rule': 'ADDITIVE_COMPOSITION'
                    })
            else:  # 1-9
                components.append({
                    'value': remaining,
                    'base_value': remaining,
                    'type': 'unit',
                    'morpheme': self.base_morphemes[remaining]['text'],
                    'rule': 'UNIT_BASE'
                })
        
        return components
    
    def _create_component_node(self, component: Dict, level: int) -> MorphologicalNode:
        """Crée un nœud pour un composant."""
        rule = self.morphological_rules.get(component['rule'])
        
        return MorphologicalNode(
            value=component['value'],
            soussou_text=component['morpheme'],
            morpheme_type=component['type'],
            position='left' if level % 2 == 1 else 'right',
            level=level,
            rule_id=component['rule'],
            explanation=rule.child_friendly_explanation if rule else f"Composant: {component['morpheme']}"
        )
    
    def generate_construction_steps(self, number: int) -> List[ConstructionStep]:
        """Génère les étapes de construction détaillées."""
        steps = []
        components = self._decompose_number(number)
        
        step_number = 1
        result_parts = []
        
        for component in components:
            rule = self.morphological_rules.get(component['rule'])
            
            if component['type'] == 'thousand':
                if component['base_value'] == 1:
                    action = "Ajouter le morphème des milliers"
                    component_text = "wúlù"
                    child_explanation = "On dit juste 'wúlù' pour 1000 !"
                else:
                    action = f"Combiner {component['base_value']} avec le morphème des milliers"
                    base_text = self._get_number_text(component['base_value'])
                    component_text = f"{base_text} wúlù"
                    child_explanation = f"On dit '{base_text}' puis 'wúlù' pour {component['base_value']} mille !"
                
                result_parts.append(component_text)
                
            elif component['type'] == 'hundred':
                if component['base_value'] == 1:
                    action = "Ajouter le morphème des centaines"
                    component_text = "k̀ɛḿɛ"
                    child_explanation = "On dit juste 'k̀ɛḿɛ' pour 100 !"
                else:
                    action = f"Combiner {component['base_value']} avec le morphème des centaines"
                    base_text = self._get_number_text(component['base_value'])
                    component_text = f"{base_text} k̀ɛḿɛ"
                    child_explanation = f"On dit '{base_text}' puis 'k̀ɛḿɛ' pour {component['base_value']} cent !"
                
                result_parts.append(component_text)
                
            elif component['type'] in ['ten', 'twenty']:
                action = f"Ajouter la dizaine {component['value']}"
                component_text = component['morpheme']
                child_explanation = f"'{component_text}' est le mot magique pour {component['value']} !"
                result_parts.append(component_text)
                
            elif component['type'] == 'unit':
                if len(result_parts) > 0:  # Il y a déjà des composants
                    action = f"Connecter l'unité {component['value']} avec 'nŭn'"
                    component_text = f"nŭn {component['morpheme']}"
                    child_explanation = f"On utilise 'nŭn' comme un pont pour ajouter '{component['morpheme']}' !"
                else:
                    action = f"Utiliser le morphème de base pour {component['value']}"
                    component_text = component['morpheme']
                    child_explanation = f"'{component['morpheme']}' est le mot magique pour {component['value']} !"
                
                result_parts.append(component_text)
            
            steps.append(ConstructionStep(
                step_number=step_number,
                action=action,
                component=component['morpheme'],
                value=str(component['value']),
                result=' '.join(result_parts),
                rule_applied=rule.name if rule else component['rule'],
                child_explanation=child_explanation,
                visual_icon=self.base_morphemes.get(component.get('base_value', component['value']), {}).get('icon', '🔢')
            ))
            
            step_number += 1
        
        return steps
    
    def _convert_number_to_soussou(self, number: int) -> str:
        """Convertit un nombre en soussou (version simplifiée)."""
        # Cette fonction devrait utiliser la logique de conversion existante
        # Pour l'instant, on utilise une version simplifiée
        components = self._decompose_number(number)
        parts = []
        
        for i, component in enumerate(components):
            if component['type'] == 'thousand':
                if component['base_value'] == 1:
                    parts.append('wúlù')
                else:
                    base_text = self._get_number_text(component['base_value'])
                    parts.append(f'{base_text} wúlù')
            elif component['type'] == 'hundred':
                if component['base_value'] == 1:
                    parts.append('k̀ɛḿɛ')
                else:
                    base_text = self._get_number_text(component['base_value'])
                    parts.append(f'{base_text} k̀ɛḿɛ')
            elif component['type'] in ['ten', 'twenty']:
                parts.append(component['morpheme'])
            elif component['type'] == 'unit':
                if len(parts) > 0:
                    parts.append(f"nŭn {component['morpheme']}")
                else:
                    parts.append(component['morpheme'])
        
        return ' '.join(parts)
    
    def generate_complete_explanation(self, number: int) -> Dict[str, Any]:
        """Génère une explication complète avec arbre morphologique et étapes."""
        # Générer l'arbre morphologique
        morphological_tree = self.generate_morphological_tree(number)
        
        # Générer les étapes de construction
        construction_steps = self.generate_construction_steps(number)
        
        # Identifier les règles appliquées
        components = self._decompose_number(number)
        rules_applied = []
        for component in components:
            rule = self.morphological_rules.get(component['rule'])
            if rule and rule not in rules_applied:
                rules_applied.append({
                    'rule_name': rule.name,
                    'description': rule.child_friendly_explanation,
                    'pattern': rule.pattern,
                    'visual_representation': rule.visual_representation
                })
        
        # Convertir l'arbre en format sérialisable
        def serialize_node(node: MorphologicalNode) -> Dict:
            return {
                'value': node.value,
                'soussou_text': node.soussou_text,
                'morpheme_type': node.morpheme_type,
                'position': node.position,
                'level': node.level,
                'rule_id': node.rule_id,
                'explanation': node.explanation,
                'children': [serialize_node(child) for child in node.children]
            }
        
        return {
            'number': number,
            'soussou_translation': morphological_tree.soussou_text,
            'morphological_tree': serialize_node(morphological_tree),
            'morphological_decomposition': {
                comp['type']: {
                    'value': comp['value'],
                    'morpheme': comp['morpheme'],
                    'rule': comp['rule']
                } for comp in components
            },
            'morphological_rules_applied': rules_applied,
            'construction_steps': [asdict(step) for step in construction_steps],
            'linguistic_components': {
                'root_morphemes': [comp['morpheme'] for comp in components if comp['type'] == 'unit'],
                'classifiers': [comp['morpheme'] for comp in components if comp['type'] in ['hundred', 'thousand']],
                'connectors': ['nŭn'] if len(components) > 1 else [],
                'compound_structure': self._analyze_compound_structure(components)
            },
            'detailed_explanation': self._generate_detailed_explanation(number, components)
        }
    
    def _analyze_compound_structure(self, components: List[Dict]) -> Dict[str, Any]:
        """Analyse la structure compositionnelle du nombre."""
        structure = {
            'type': 'simple' if len(components) == 1 else 'compound',
            'composition_method': 'additive',
            'hierarchy_levels': len(set(comp['type'] for comp in components)),
            'morpheme_count': len(components)
        }
        
        if len(components) > 1:
            structure['connection_pattern'] = ' + nŭn + '.join([comp['type'] for comp in components])
        
        return structure
    
    def _generate_detailed_explanation(self, number: int, components: List[Dict]) -> str:
        """Génère une explication détaillée adaptée aux enfants."""
        explanations = []
        
        explanations.append(f"🎯 Le nombre {number} en soussou se dit '{self._convert_number_to_soussou(number)}'.")
        
        if len(components) == 1:
            comp = components[0]
            if comp['type'] == 'unit':
                explanations.append(f"✨ C'est un nombre simple ! On utilise juste le mot magique '{comp['morpheme']}'.")
        else:
            explanations.append(f"🧩 Ce nombre est composé de {len(components)} parties qui se combinent ensemble :")
            
            for i, comp in enumerate(components, 1):
                if comp['type'] == 'thousand':
                    explanations.append(f"   {i}. 🌟 '{comp['morpheme']}' pour les milliers")
                elif comp['type'] == 'hundred':
                    explanations.append(f"   {i}. 💯 '{comp['morpheme']}' pour les centaines")
                elif comp['type'] in ['ten', 'twenty']:
                    explanations.append(f"   {i}. 🔟 '{comp['morpheme']}' pour les dizaines")
                elif comp['type'] == 'unit':
                    explanations.append(f"   {i}. 🎯 '{comp['morpheme']}' pour les unités")
            
            explanations.append("🌉 Le mot 'nŭn' sert de pont pour connecter les différentes parties !")
        
        return ' '.join(explanations)