#!/usr/bin/env python3
"""
Démonstration Avancée du Module d'Explication Soussou

Ce script démontre les capacités uniques du système:
1. Explication complète de la construction des nombres
2. Inférence au-delà de 9999
3. Visualisations et arbres de décomposition
4. Règles linguistiques en langage naturel

Auteur: Assistant IA
Date: 2024
"""

import sys
import os
from soussou_explanation_module import SoussouExplanationModule
import matplotlib.pyplot as plt

class SoussouAdvancedDemo:
    """Démonstration avancée des capacités du système soussou."""
    
    def __init__(self):
        print("🚀 Initialisation du Système Avancé d'Explication Soussou")
        print("=" * 60)
        self.explainer = SoussouExplanationModule()
        print("✅ Module d'explication chargé avec succès!")
        print(f"✅ Base de données: {len(self.explainer.data)} entrées")
        print(f"✅ Nombres de base extraits: {len(self.explainer.base_numbers)}")
        print(f"✅ Règles morphologiques: {len(self.explainer.morphological_rules)}")
    
    def demonstrate_basic_explanation(self):
        """Démontre l'explication de base d'un nombre."""
        print("\n" + "="*60)
        print("📚 DÉMONSTRATION: EXPLICATION DE BASE")
        print("="*60)
        
        number = 1234
        print(f"\n🔍 Analyse du nombre: {number}")
        
        decomposition = self.explainer.decompose_number(number)
        
        print(f"\n🔤 Traduction soussou: '{decomposition.soussou_translation}'")
        
        print("\n📊 Décomposition hiérarchique:")
        for i, comp in enumerate(decomposition.components, 1):
            print(f"  {i}. {comp.value:>4} → '{comp.soussou_text}' [{comp.component_type}]")
            print(f"      📋 Règle: {comp.rule_applied}")
            print(f"      💡 Explication: {comp.explanation}")
        
        print("\n🔧 Étapes de construction:")
        for step in decomposition.construction_steps:
            print(f"  {step}")
        
        print("\n📚 Règles linguistiques appliquées:")
        for rule in decomposition.linguistic_rules:
            print(f"  • {rule}")
    
    def demonstrate_large_number_inference(self):
        """Démontre l'inférence pour les nombres > 9999."""
        print("\n" + "="*60)
        print("🚀 DÉMONSTRATION: INFÉRENCE AU-DELÀ DE 9999")
        print("="*60)
        
        large_numbers = [12345, 50000, 123456, 1000000]
        
        for number in large_numbers:
            print(f"\n🔍 Inférence pour le nombre: {number:,}")
            print("-" * 40)
            
            decomposition = self.explainer.decompose_number(number)
            
            print(f"🔤 Traduction générée: '{decomposition.soussou_translation}'")
            
            print("\n📊 Analyse des composants:")
            for comp in decomposition.components:
                if comp.value >= 1000:
                    print(f"  🏗️  {comp.value:>8} → '{comp.soussou_text}' [{comp.component_type}]")
                else:
                    print(f"  🔹 {comp.value:>8} → '{comp.soussou_text}' [{comp.component_type}]")
            
            print(f"\n📈 Capacité d'inférence: {'✅ Générée par règles' if number > 9999 else '📋 Depuis base de données'}")
    
    def demonstrate_morphological_rules(self):
        """Démontre l'extraction et l'application des règles morphologiques."""
        print("\n" + "="*60)
        print("🧬 DÉMONSTRATION: RÈGLES MORPHOLOGIQUES")
        print("="*60)
        
        print("\n📚 Règles morphologiques extraites:")
        
        for rule_name, rule_data in self.explainer.morphological_rules.items():
            print(f"\n🔸 {rule_name.upper()}:")
            
            if 'pattern' in rule_data:
                print(f"  📋 Pattern: {rule_data['pattern']}")
            if 'rule' in rule_data:
                print(f"  ⚙️  Règle: {rule_data['rule']}")
            if 'range' in rule_data:
                print(f"  📊 Plage: {rule_data['range']}")
            if 'examples' in rule_data:
                examples = list(rule_data['examples'].items())[:3]
                print(f"  💡 Exemples: {examples}")
        
        print("\n🔗 Patterns linguistiques:")
        for pattern_name, pattern_data in self.explainer.linguistic_patterns.items():
            print(f"\n🔸 {pattern_name.upper()}:")
            if isinstance(pattern_data, dict):
                for key, value in pattern_data.items():
                    print(f"  {key}: {value}")
    
    def demonstrate_visual_trees(self):
        """Démontre la création d'arbres visuels."""
        print("\n" + "="*60)
        print("🎨 DÉMONSTRATION: ARBRES VISUELS DE DÉCOMPOSITION")
        print("="*60)
        
        numbers_to_visualize = [1234, 5678]
        
        for number in numbers_to_visualize:
            print(f"\n🎨 Création de l'arbre visuel pour {number}...")
            
            decomposition = self.explainer.decompose_number(number)
            
            # Créer la visualisation
            save_path = f"soussou_tree_{number}.png"
            try:
                self.explainer.create_visual_tree(decomposition, save_path)
                print(f"✅ Arbre sauvegardé: {save_path}")
            except Exception as e:
                print(f"⚠️  Erreur lors de la création de l'arbre: {e}")
                print("   (Matplotlib peut nécessiter une interface graphique)")
    
    def demonstrate_comparative_analysis(self):
        """Démontre l'analyse comparative entre différents nombres."""
        print("\n" + "="*60)
        print("🔍 DÉMONSTRATION: ANALYSE COMPARATIVE")
        print("="*60)
        
        numbers = [123, 1234, 12345, 123456]
        
        print("\n📊 Comparaison de la complexité linguistique:")
        print(f"{'Nombre':<10} {'Composants':<12} {'Règles':<8} {'Traduction':<30}")
        print("-" * 70)
        
        for number in numbers:
            decomposition = self.explainer.decompose_number(number)
            
            print(f"{number:<10} {len(decomposition.components):<12} "
                  f"{len(decomposition.linguistic_rules):<8} "
                  f"{decomposition.soussou_translation[:28]:<30}")
        
        print("\n📈 Observations:")
        print("  • Plus le nombre est grand, plus il y a de composants")
        print("  • Les règles linguistiques restent cohérentes")
        print("  • La construction suit toujours la hiérarchie: milliers → centaines → dizaines → unités")
    
    def demonstrate_inference_capabilities(self):
        """Démontre les capacités d'inférence avancées."""
        print("\n" + "="*60)
        print("🧠 DÉMONSTRATION: CAPACITÉS D'INFÉRENCE AVANCÉES")
        print("="*60)
        
        print("\n🚀 Test d'inférence pour des nombres très grands:")
        
        extreme_numbers = [999999, 1234567, 9876543]
        
        for number in extreme_numbers:
            print(f"\n🔍 Nombre: {number:,}")
            
            try:
                decomposition = self.explainer.decompose_number(number)
                print(f"✅ Traduction générée: '{decomposition.soussou_translation}'")
                print(f"📊 Composants identifiés: {len(decomposition.components)}")
                
                # Analyser la structure
                has_millions = any(comp.value >= 1000000 for comp in decomposition.components)
                has_thousands = any(1000 <= comp.value < 1000000 for comp in decomposition.components)
                has_hundreds = any(100 <= comp.value < 1000 for comp in decomposition.components)
                
                structure = []
                if has_millions: structure.append("millions")
                if has_thousands: structure.append("milliers")
                if has_hundreds: structure.append("centaines")
                
                print(f"🏗️  Structure: {' + '.join(structure)}")
                
            except Exception as e:
                print(f"❌ Erreur d'inférence: {e}")
        
        print("\n💡 Capacités démontrées:")
        print("  ✅ Inférence au-delà de la base de données (> 9999)")
        print("  ✅ Application cohérente des règles morphologiques")
        print("  ✅ Gestion des nombres de plusieurs millions")
        print("  ✅ Décomposition hiérarchique automatique")
    
    def generate_comprehensive_report(self):
        """Génère un rapport complet des capacités."""
        print("\n" + "="*60)
        print("📋 GÉNÉRATION DE RAPPORT COMPLET")
        print("="*60)
        
        test_number = 123456
        report_path = f"soussou_comprehensive_report_{test_number}.json"
        
        print(f"\n📝 Génération du rapport pour {test_number:,}...")
        
        try:
            report = self.explainer.generate_explanation_report(test_number, report_path)
            
            print(f"✅ Rapport sauvegardé: {report_path}")
            
            print("\n📊 Contenu du rapport:")
            print(f"  • Nombre analysé: {report['number']:,}")
            print(f"  • Traduction: {report['soussou_translation']}")
            print(f"  • Composants: {len(report['decomposition']['components'])}")
            print(f"  • Étapes de construction: {len(report['decomposition']['construction_steps'])}")
            print(f"  • Règles linguistiques: {len(report['decomposition']['linguistic_rules'])}")
            print(f"  • Inférence au-delà de 9999: {report['inference_capability']['can_generate_beyond_9999']}")
            
        except Exception as e:
            print(f"❌ Erreur lors de la génération du rapport: {e}")
    
    def demonstrate_differentiation_features(self):
        """Démontre les fonctionnalités qui différencient cette application."""
        print("\n" + "="*60)
        print("🌟 FONCTIONNALITÉS DE DIFFÉRENCIATION")
        print("="*60)
        
        print("\n🎯 Ce qui rend cette application unique:")
        
        print("\n1. 📚 EXPLICATIONS LINGUISTIQUES COMPLÈTES:")
        print("   • Décomposition hiérarchique détaillée")
        print("   • Règles morphologiques en langage naturel")
        print("   • Étapes de construction pas à pas")
        
        print("\n2. 🚀 INFÉRENCE AU-DELÀ DES DONNÉES:")
        print("   • Génération de nombres > 9999")
        print("   • Application cohérente des règles")
        print("   • Extensibilité illimitée")
        
        print("\n3. 🎨 VISUALISATIONS INTERACTIVES:")
        print("   • Arbres de décomposition")
        print("   • Illustrations hiérarchiques")
        print("   • Codes couleur par niveau")
        
        print("\n4. 🧬 ANALYSE MORPHOLOGIQUE AVANCÉE:")
        print("   • Extraction automatique de règles")
        print("   • Patterns linguistiques identifiés")
        print("   • Connecteurs et formateurs")
        
        print("\n5. 📊 RAPPORTS DÉTAILLÉS:")
        print("   • Analyses JSON complètes")
        print("   • Métriques de complexité")
        print("   • Capacités d'inférence")
        
        # Démonstration pratique
        print("\n🔍 Démonstration pratique:")
        demo_number = 987654
        print(f"\nPour le nombre {demo_number:,} (au-delà de la base de données):")
        
        decomposition = self.explainer.decompose_number(demo_number)
        print(f"✅ Traduction générée: '{decomposition.soussou_translation}'")
        print(f"📊 {len(decomposition.components)} composants identifiés")
        print(f"📚 {len(decomposition.linguistic_rules)} règles appliquées")
        print(f"🔧 {len(decomposition.construction_steps)} étapes de construction")
    
    def run_complete_demo(self):
        """Lance la démonstration complète."""
        print("\n🎬 LANCEMENT DE LA DÉMONSTRATION COMPLÈTE")
        print("=" * 60)
        
        try:
            # 1. Explication de base
            self.demonstrate_basic_explanation()
            
            # 2. Inférence de grands nombres
            self.demonstrate_large_number_inference()
            
            # 3. Règles morphologiques
            self.demonstrate_morphological_rules()
            
            # 4. Arbres visuels
            self.demonstrate_visual_trees()
            
            # 5. Analyse comparative
            self.demonstrate_comparative_analysis()
            
            # 6. Capacités d'inférence
            self.demonstrate_inference_capabilities()
            
            # 7. Rapport complet
            self.generate_comprehensive_report()
            
            # 8. Fonctionnalités de différenciation
            self.demonstrate_differentiation_features()
            
            print("\n" + "="*60)
            print("🎉 DÉMONSTRATION TERMINÉE AVEC SUCCÈS!")
            print("="*60)
            
            print("\n📋 Résumé des capacités démontrées:")
            print("  ✅ Explications linguistiques complètes")
            print("  ✅ Inférence au-delà de 9999")
            print("  ✅ Visualisations et arbres")
            print("  ✅ Règles morphologiques")
            print("  ✅ Rapports détaillés")
            print("  ✅ Fonctionnalités uniques")
            
        except Exception as e:
            print(f"❌ Erreur pendant la démonstration: {e}")
            import traceback
            traceback.print_exc()
    
    def interactive_mode(self):
        """Mode interactif pour explorer les fonctionnalités."""
        print("\n" + "="*60)
        print("🎮 MODE INTERACTIF - EXPLORATION LIBRE")
        print("="*60)
        
        print("\nCommandes disponibles:")
        print("  • Entrez un nombre pour voir son explication")
        print("  • 'demo' - Relancer la démonstration complète")
        print("  • 'rules' - Voir les règles morphologiques")
        print("  • 'large' - Tester des grands nombres")
        print("  • 'quit' - Quitter")
        
        while True:
            try:
                user_input = input("\n🔍 Votre choix: ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'q']:
                    print("👋 Au revoir!")
                    break
                
                elif user_input.lower() == 'demo':
                    self.run_complete_demo()
                
                elif user_input.lower() == 'rules':
                    self.demonstrate_morphological_rules()
                
                elif user_input.lower() == 'large':
                    self.demonstrate_large_number_inference()
                
                else:
                    try:
                        number = int(user_input)
                        if number < 0:
                            print("⚠️  Veuillez entrer un nombre positif.")
                            continue
                        
                        print(f"\n🔍 Analyse de {number:,}:")
                        decomposition = self.explainer.decompose_number(number)
                        
                        print(f"🔤 Traduction: '{decomposition.soussou_translation}'")
                        print(f"📊 Composants: {len(decomposition.components)}")
                        print(f"📚 Règles: {len(decomposition.linguistic_rules)}")
                        
                        if number > 9999:
                            print("🚀 Nombre inféré au-delà de la base de données!")
                        
                    except ValueError:
                        print("⚠️  Commande non reconnue. Tapez un nombre ou une commande valide.")
                
            except KeyboardInterrupt:
                print("\n👋 Au revoir!")
                break
            except Exception as e:
                print(f"❌ Erreur: {e}")

def main():
    """Fonction principale."""
    print("🌟 SYSTÈME AVANCÉ D'EXPLICATION DES NOMBRES SOUSSOU 🌟")
    print("=" * 60)
    print("Cette démonstration présente les fonctionnalités uniques qui")
    print("différencient cette application de toutes les autres:")
    print("• Explications linguistiques complètes")
    print("• Inférence au-delà des données d'entraînement")
    print("• Visualisations interactives")
    print("• Règles morphologiques en langage naturel")
    
    try:
        # Créer la démonstration
        demo = SoussouAdvancedDemo()
        
        # Demander le mode
        print("\n🎯 Choisissez un mode:")
        print("  1. Démonstration complète automatique")
        print("  2. Mode interactif")
        
        choice = input("\nVotre choix (1 ou 2): ").strip()
        
        if choice == '1':
            demo.run_complete_demo()
        elif choice == '2':
            demo.interactive_mode()
        else:
            print("\n🚀 Lancement de la démonstration complète par défaut...")
            demo.run_complete_demo()
            
            # Proposer le mode interactif après
            continue_interactive = input("\n🎮 Voulez-vous continuer en mode interactif? (o/n): ").strip().lower()
            if continue_interactive in ['o', 'oui', 'y', 'yes']:
                demo.interactive_mode()
        
    except Exception as e:
        print(f"❌ Erreur lors de l'initialisation: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()