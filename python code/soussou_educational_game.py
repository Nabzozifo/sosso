#!/usr/bin/env python3
"""
Jeu Éducatif Interactif pour l'Apprentissage des Nombres Soussou

Ce module crée un jeu éducatif qui utilise le module d'explication
pour enseigner la construction des nombres soussou de manière interactive.

Fonctionnalités:
- Quiz sur les nombres soussou
- Mode apprentissage avec explications
- Défis de construction de nombres
- Système de progression
- Statistiques d'apprentissage

Auteur: Assistant IA
Date: 2024
"""

import random
import json
import time
from datetime import datetime
from typing import Dict, List, Tuple
from soussou_explanation_module import SoussouExplanationModule

class SoussouEducationalGame:
    """Jeu éducatif pour apprendre les nombres soussou."""
    
    def __init__(self):
        print("🎮 Initialisation du Jeu Éducatif Soussou...")
        self.explainer = SoussouExplanationModule()
        self.player_stats = {
            'games_played': 0,
            'correct_answers': 0,
            'total_questions': 0,
            'best_streak': 0,
            'current_streak': 0,
            'levels_completed': [],
            'time_played': 0,
            'favorite_numbers': [],
            'learning_progress': {
                'basic_numbers': 0,  # 1-20
                'medium_numbers': 0,  # 21-100
                'large_numbers': 0,   # 101-1000
                'huge_numbers': 0,    # 1001-9999
                'inference_numbers': 0  # >9999
            }
        }
        self.current_level = 1
        self.session_start = time.time()
        print("✅ Jeu initialisé avec succès!")
    
    def display_welcome(self):
        """Affiche l'écran d'accueil du jeu."""
        print("\n" + "="*70)
        print("🎮 BIENVENUE DANS LE JEU ÉDUCATIF SOUSSOU! 🎮")
        print("="*70)
        print("\n🎯 Objectif: Apprendre les nombres soussou de manière interactive")
        print("\n🌟 Fonctionnalités:")
        print("  📚 Mode Apprentissage - Explications détaillées")
        print("  🎯 Quiz Interactif - Testez vos connaissances")
        print("  🏗️  Défi Construction - Construisez des nombres")
        print("  📊 Statistiques - Suivez votre progression")
        print("  🚀 Inférence - Explorez au-delà de 9999")
        
        print("\n🎮 Modes de jeu disponibles:")
        print("  1. 📖 Mode Apprentissage")
        print("  2. 🎯 Quiz Rapide")
        print("  3. 🏗️  Défi Construction")
        print("  4. 🚀 Exploration Libre")
        print("  5. 📊 Voir Statistiques")
        print("  6. ❓ Aide")
        print("  0. 🚪 Quitter")
    
    def learning_mode(self):
        """Mode apprentissage avec explications détaillées."""
        print("\n" + "="*60)
        print("📖 MODE APPRENTISSAGE")
        print("="*60)
        
        print("\n🎯 Choisissez votre niveau:")
        print("  1. 🔢 Nombres de base (1-20)")
        print("  2. 📈 Nombres moyens (21-100)")
        print("  3. 🏢 Grands nombres (101-1000)")
        print("  4. 🏗️  Très grands nombres (1001-9999)")
        print("  5. 🚀 Inférence (>9999)")
        
        try:
            choice = int(input("\nVotre choix (1-5): "))
            
            if choice == 1:
                self._learn_basic_numbers()
            elif choice == 2:
                self._learn_medium_numbers()
            elif choice == 3:
                self._learn_large_numbers()
            elif choice == 4:
                self._learn_huge_numbers()
            elif choice == 5:
                self._learn_inference_numbers()
            else:
                print("❌ Choix invalide!")
                
        except ValueError:
            print("❌ Veuillez entrer un nombre valide!")
    
    def _learn_basic_numbers(self):
        """Apprentissage des nombres de base."""
        print("\n📚 APPRENTISSAGE: Nombres de Base (1-20)")
        print("-" * 50)
        
        basic_numbers = [1, 2, 3, 4, 5, 10, 11, 15, 20]
        
        for number in basic_numbers:
            print(f"\n🔍 Nombre: {number}")
            
            decomposition = self.explainer.decompose_number(number)
            print(f"🔤 Soussou: '{decomposition.soussou_translation}'")
            
            print("\n💡 Explication:")
            for comp in decomposition.components:
                print(f"  • {comp.explanation}")
            
            if decomposition.linguistic_rules:
                print("\n📚 Règles appliquées:")
                for rule in decomposition.linguistic_rules[:2]:  # Limiter à 2 règles
                    print(f"  • {rule}")
            
            input("\n⏸️  Appuyez sur Entrée pour continuer...")
        
        self.player_stats['learning_progress']['basic_numbers'] += len(basic_numbers)
        print("\n✅ Apprentissage des nombres de base terminé!")
    
    def _learn_medium_numbers(self):
        """Apprentissage des nombres moyens."""
        print("\n📚 APPRENTISSAGE: Nombres Moyens (21-100)")
        print("-" * 50)
        
        medium_numbers = [25, 30, 45, 67, 80, 99]
        
        for number in medium_numbers:
            print(f"\n🔍 Nombre: {number}")
            
            decomposition = self.explainer.decompose_number(number)
            print(f"🔤 Soussou: '{decomposition.soussou_translation}'")
            
            print("\n🔧 Construction:")
            for step in decomposition.construction_steps[:3]:  # Limiter à 3 étapes
                print(f"  {step}")
            
            input("\n⏸️  Appuyez sur Entrée pour continuer...")
        
        self.player_stats['learning_progress']['medium_numbers'] += len(medium_numbers)
        print("\n✅ Apprentissage des nombres moyens terminé!")
    
    def _learn_large_numbers(self):
        """Apprentissage des grands nombres."""
        print("\n📚 APPRENTISSAGE: Grands Nombres (101-1000)")
        print("-" * 50)
        
        large_numbers = [123, 456, 789, 999]
        
        for number in large_numbers:
            print(f"\n🔍 Nombre: {number}")
            
            decomposition = self.explainer.decompose_number(number)
            print(f"🔤 Soussou: '{decomposition.soussou_translation}'")
            
            print("\n📊 Composants:")
            for comp in decomposition.components:
                print(f"  • {comp.value} → '{comp.soussou_text}' [{comp.component_type}]")
            
            input("\n⏸️  Appuyez sur Entrée pour continuer...")
        
        self.player_stats['learning_progress']['large_numbers'] += len(large_numbers)
        print("\n✅ Apprentissage des grands nombres terminé!")
    
    def _learn_huge_numbers(self):
        """Apprentissage des très grands nombres."""
        print("\n📚 APPRENTISSAGE: Très Grands Nombres (1001-9999)")
        print("-" * 50)
        
        huge_numbers = [1234, 5678, 9999]
        
        for number in huge_numbers:
            print(f"\n🔍 Nombre: {number}")
            
            decomposition = self.explainer.decompose_number(number)
            print(f"🔤 Soussou: '{decomposition.soussou_translation}'")
            
            print("\n🏗️  Structure hiérarchique:")
            for comp in decomposition.components:
                if comp.component_type in ['thousand', 'hundred', 'tens', 'unit']:
                    print(f"  🔹 {comp.component_type.upper()}: {comp.value} → '{comp.soussou_text}'")
            
            input("\n⏸️  Appuyez sur Entrée pour continuer...")
        
        self.player_stats['learning_progress']['huge_numbers'] += len(huge_numbers)
        print("\n✅ Apprentissage des très grands nombres terminé!")
    
    def _learn_inference_numbers(self):
        """Apprentissage de l'inférence pour nombres >9999."""
        print("\n📚 APPRENTISSAGE: Inférence (>9999)")
        print("-" * 50)
        print("\n🚀 Ici, nous explorons des nombres au-delà de la base de données!")
        
        inference_numbers = [12345, 50000, 123456]
        
        for number in inference_numbers:
            print(f"\n🔍 Nombre: {number:,} (INFÉRÉ)")
            
            decomposition = self.explainer.decompose_number(number)
            print(f"🔤 Soussou généré: '{decomposition.soussou_translation}'")
            
            print("\n🧠 Processus d'inférence:")
            print("  1. Décomposition hiérarchique automatique")
            print("  2. Application des règles morphologiques")
            print("  3. Assemblage selon les patterns soussou")
            
            print(f"\n📊 Composants générés: {len(decomposition.components)}")
            
            input("\n⏸️  Appuyez sur Entrée pour continuer...")
        
        self.player_stats['learning_progress']['inference_numbers'] += len(inference_numbers)
        print("\n✅ Apprentissage de l'inférence terminé!")
    
    def quiz_mode(self):
        """Mode quiz interactif."""
        print("\n" + "="*60)
        print("🎯 MODE QUIZ")
        print("="*60)
        
        print("\n🎮 Choisissez la difficulté:")
        print("  1. 🟢 Facile (1-50)")
        print("  2. 🟡 Moyen (51-500)")
        print("  3. 🔴 Difficile (501-5000)")
        print("  4. 🚀 Expert (>5000)")
        
        try:
            difficulty = int(input("\nVotre choix (1-4): "))
            num_questions = int(input("Nombre de questions (5-20): "))
            
            if not 5 <= num_questions <= 20:
                num_questions = 10
                print(f"📝 Nombre de questions ajusté à {num_questions}")
            
            self._run_quiz(difficulty, num_questions)
            
        except ValueError:
            print("❌ Entrée invalide! Lancement d'un quiz facile par défaut.")
            self._run_quiz(1, 10)
    
    def _run_quiz(self, difficulty: int, num_questions: int):
        """Lance un quiz avec la difficulté spécifiée."""
        # Définir les plages selon la difficulté
        ranges = {
            1: (1, 50),
            2: (51, 500),
            3: (501, 5000),
            4: (5001, 50000)
        }
        
        min_num, max_num = ranges.get(difficulty, (1, 50))
        
        print(f"\n🎯 Quiz: {num_questions} questions (nombres {min_num}-{max_num:,})")
        print("="*50)
        
        correct = 0
        start_time = time.time()
        
        for i in range(num_questions):
            number = random.randint(min_num, max_num)
            
            print(f"\n❓ Question {i+1}/{num_questions}")
            print(f"🔢 Traduisez en soussou: {number:,}")
            
            # Obtenir la bonne réponse
            decomposition = self.explainer.decompose_number(number)
            correct_answer = decomposition.soussou_translation
            
            # Demander la réponse du joueur
            user_answer = input("🔤 Votre réponse: ").strip()
            
            if user_answer.lower() == correct_answer.lower():
                print("✅ Correct!")
                correct += 1
                self.player_stats['current_streak'] += 1
                if self.player_stats['current_streak'] > self.player_stats['best_streak']:
                    self.player_stats['best_streak'] = self.player_stats['current_streak']
            else:
                print(f"❌ Incorrect. La bonne réponse est: '{correct_answer}'")
                self.player_stats['current_streak'] = 0
                
                # Offrir une explication
                show_explanation = input("💡 Voulez-vous une explication? (o/n): ").strip().lower()
                if show_explanation in ['o', 'oui', 'y', 'yes']:
                    print("\n📚 Explication:")
                    for comp in decomposition.components:
                        print(f"  • {comp.explanation}")
        
        # Résultats du quiz
        end_time = time.time()
        duration = end_time - start_time
        score = (correct / num_questions) * 100
        
        print(f"\n" + "="*50)
        print("🏆 RÉSULTATS DU QUIZ")
        print("="*50)
        print(f"📊 Score: {correct}/{num_questions} ({score:.1f}%)")
        print(f"⏱️  Temps: {duration:.1f} secondes")
        print(f"🔥 Série actuelle: {self.player_stats['current_streak']}")
        print(f"🏅 Meilleure série: {self.player_stats['best_streak']}")
        
        # Mettre à jour les statistiques
        self.player_stats['games_played'] += 1
        self.player_stats['correct_answers'] += correct
        self.player_stats['total_questions'] += num_questions
        
        # Évaluation de la performance
        if score >= 90:
            print("🌟 Excellent! Vous maîtrisez très bien les nombres soussou!")
        elif score >= 70:
            print("👍 Bien joué! Continuez à vous entraîner!")
        elif score >= 50:
            print("📚 Pas mal, mais il y a de la place pour l'amélioration!")
        else:
            print("💪 Continuez à apprendre, vous allez y arriver!")
    
    def construction_challenge(self):
        """Défi de construction de nombres."""
        print("\n" + "="*60)
        print("🏗️  DÉFI CONSTRUCTION")
        print("="*60)
        
        print("\n🎯 Dans ce défi, vous devez construire un nombre soussou")
        print("   en assemblant ses composants!")
        
        # Choisir un nombre aléatoire
        number = random.randint(100, 9999)
        decomposition = self.explainer.decompose_number(number)
        
        print(f"\n🔢 Nombre cible: {number}")
        print(f"🔤 Traduction complète: '{decomposition.soussou_translation}'")
        
        print("\n🧩 Composants disponibles (dans le désordre):")
        
        # Mélanger les composants
        components = decomposition.components.copy()
        random.shuffle(components)
        
        for i, comp in enumerate(components, 1):
            print(f"  {i}. '{comp.soussou_text}' (valeur: {comp.value})")
        
        print("\n🎯 Votre mission: Remettez les composants dans le bon ordre!")
        print("   Entrez les numéros séparés par des espaces (ex: 3 1 4 2)")
        
        try:
            user_order = input("\n🔢 Votre ordre: ").strip().split()
            user_indices = [int(x) - 1 for x in user_order]
            
            # Vérifier l'ordre
            user_components = [components[i] for i in user_indices]
            user_translation = ' '.join([comp.soussou_text for comp in user_components])
            
            print(f"\n🔤 Votre construction: '{user_translation}'")
            print(f"🎯 Construction correcte: '{decomposition.soussou_translation}'")
            
            if user_translation == decomposition.soussou_translation:
                print("\n🎉 BRAVO! Construction parfaite!")
                self.player_stats['correct_answers'] += 1
            else:
                print("\n❌ Pas tout à fait... Voici l'explication:")
                print("\n📚 Ordre hiérarchique correct:")
                for i, comp in enumerate(decomposition.components, 1):
                    print(f"  {i}. '{comp.soussou_text}' - {comp.explanation}")
            
            self.player_stats['total_questions'] += 1
            
        except (ValueError, IndexError):
            print("❌ Format invalide! Utilisez des numéros séparés par des espaces.")
    
    def free_exploration(self):
        """Mode exploration libre."""
        print("\n" + "="*60)
        print("🚀 MODE EXPLORATION LIBRE")
        print("="*60)
        
        print("\n🌟 Explorez librement les nombres soussou!")
        print("   Entrez n'importe quel nombre pour voir sa décomposition complète.")
        print("   Tapez 'quit' pour revenir au menu principal.")
        
        while True:
            try:
                user_input = input("\n🔍 Entrez un nombre: ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'q']:
                    break
                
                number = int(user_input)
                
                if number < 0:
                    print("⚠️  Veuillez entrer un nombre positif.")
                    continue
                
                print(f"\n🔍 Exploration du nombre {number:,}")
                print("-" * 40)
                
                decomposition = self.explainer.decompose_number(number)
                
                print(f"🔤 Traduction: '{decomposition.soussou_translation}'")
                
                if number > 9999:
                    print("🚀 Nombre inféré au-delà de la base de données!")
                
                print("\n📊 Analyse des composants:")
                for comp in decomposition.components:
                    print(f"  • {comp.value:>6} → '{comp.soussou_text}' [{comp.component_type}]")
                
                print("\n📚 Règles linguistiques:")
                for rule in decomposition.linguistic_rules:
                    print(f"  • {rule}")
                
                # Ajouter aux favoris
                if number not in self.player_stats['favorite_numbers']:
                    add_favorite = input("\n⭐ Ajouter aux favoris? (o/n): ").strip().lower()
                    if add_favorite in ['o', 'oui', 'y', 'yes']:
                        self.player_stats['favorite_numbers'].append(number)
                        print("✅ Ajouté aux favoris!")
                
            except ValueError:
                print("❌ Veuillez entrer un nombre valide.")
            except KeyboardInterrupt:
                break
            except Exception as e:
                print(f"❌ Erreur: {e}")
    
    def show_statistics(self):
        """Affiche les statistiques du joueur."""
        print("\n" + "="*60)
        print("📊 VOS STATISTIQUES")
        print("="*60)
        
        # Calculer le temps de jeu
        session_time = time.time() - self.session_start
        total_time = self.player_stats['time_played'] + session_time
        
        # Statistiques générales
        print("\n🎮 Statistiques Générales:")
        print(f"  🎯 Parties jouées: {self.player_stats['games_played']}")
        print(f"  ✅ Bonnes réponses: {self.player_stats['correct_answers']}")
        print(f"  📝 Questions totales: {self.player_stats['total_questions']}")
        
        if self.player_stats['total_questions'] > 0:
            accuracy = (self.player_stats['correct_answers'] / self.player_stats['total_questions']) * 100
            print(f"  🎯 Précision: {accuracy:.1f}%")
        
        print(f"  🔥 Série actuelle: {self.player_stats['current_streak']}")
        print(f"  🏅 Meilleure série: {self.player_stats['best_streak']}")
        print(f"  ⏱️  Temps de jeu: {total_time/60:.1f} minutes")
        
        # Progression d'apprentissage
        print("\n📚 Progression d'Apprentissage:")
        progress = self.player_stats['learning_progress']
        print(f"  🔢 Nombres de base: {progress['basic_numbers']} étudiés")
        print(f"  📈 Nombres moyens: {progress['medium_numbers']} étudiés")
        print(f"  🏢 Grands nombres: {progress['large_numbers']} étudiés")
        print(f"  🏗️  Très grands nombres: {progress['huge_numbers']} étudiés")
        print(f"  🚀 Nombres inférés: {progress['inference_numbers']} étudiés")
        
        # Nombres favoris
        if self.player_stats['favorite_numbers']:
            print("\n⭐ Vos Nombres Favoris:")
            for num in self.player_stats['favorite_numbers'][-5:]:  # Derniers 5
                decomposition = self.explainer.decompose_number(num)
                print(f"  • {num:,} → '{decomposition.soussou_translation}'")
        
        # Recommandations
        print("\n💡 Recommandations:")
        if accuracy < 70:
            print("  📚 Passez plus de temps en mode apprentissage")
        if progress['inference_numbers'] == 0:
            print("  🚀 Essayez l'exploration de nombres >9999")
        if self.player_stats['games_played'] < 5:
            print("  🎯 Jouez plus de quiz pour améliorer vos compétences")
    
    def show_help(self):
        """Affiche l'aide du jeu."""
        print("\n" + "="*60)
        print("❓ AIDE DU JEU")
        print("="*60)
        
        print("\n🎮 Modes de Jeu:")
        print("\n📖 MODE APPRENTISSAGE:")
        print("  • Apprenez les nombres par niveaux de difficulté")
        print("  • Explications détaillées pour chaque nombre")
        print("  • Règles morphologiques en langage naturel")
        
        print("\n🎯 MODE QUIZ:")
        print("  • Testez vos connaissances")
        print("  • Différents niveaux de difficulté")
        print("  • Système de score et de séries")
        
        print("\n🏗️  DÉFI CONSTRUCTION:")
        print("  • Assemblez les composants d'un nombre")
        print("  • Comprenez la structure hiérarchique")
        print("  • Défi de logique linguistique")
        
        print("\n🚀 EXPLORATION LIBRE:")
        print("  • Explorez n'importe quel nombre")
        print("  • Inférence au-delà de 9999")
        print("  • Ajoutez des nombres aux favoris")
        
        print("\n🌟 Fonctionnalités Uniques:")
        print("  ✅ Explications linguistiques complètes")
        print("  ✅ Inférence au-delà des données d'entraînement")
        print("  ✅ Règles morphologiques automatiques")
        print("  ✅ Système de progression personnalisé")
        
        print("\n💡 Conseils:")
        print("  • Commencez par le mode apprentissage")
        print("  • Utilisez les explications en cas d'erreur")
        print("  • Explorez les grands nombres pour voir l'inférence")
        print("  • Suivez vos statistiques pour mesurer vos progrès")
    
    def save_stats(self):
        """Sauvegarde les statistiques."""
        self.player_stats['time_played'] += time.time() - self.session_start
        
        try:
            with open('soussou_game_stats.json', 'w', encoding='utf-8') as f:
                json.dump(self.player_stats, f, ensure_ascii=False, indent=2)
            print("💾 Statistiques sauvegardées!")
        except Exception as e:
            print(f"⚠️  Erreur lors de la sauvegarde: {e}")
    
    def load_stats(self):
        """Charge les statistiques sauvegardées."""
        try:
            with open('soussou_game_stats.json', 'r', encoding='utf-8') as f:
                self.player_stats = json.load(f)
            print("📂 Statistiques chargées!")
        except FileNotFoundError:
            print("📝 Nouveau joueur détecté - création d'un nouveau profil")
        except Exception as e:
            print(f"⚠️  Erreur lors du chargement: {e}")
    
    def run_game(self):
        """Lance le jeu principal."""
        # Charger les statistiques
        self.load_stats()
        
        # Afficher l'accueil
        self.display_welcome()
        
        while True:
            try:
                choice = input("\n🎮 Votre choix: ").strip()
                
                if choice == '1':
                    self.learning_mode()
                elif choice == '2':
                    self.quiz_mode()
                elif choice == '3':
                    self.construction_challenge()
                elif choice == '4':
                    self.free_exploration()
                elif choice == '5':
                    self.show_statistics()
                elif choice == '6':
                    self.show_help()
                elif choice == '0':
                    print("\n👋 Merci d'avoir joué! À bientôt!")
                    self.save_stats()
                    break
                else:
                    print("❌ Choix invalide! Tapez un nombre entre 0 et 6.")
                
            except KeyboardInterrupt:
                print("\n\n👋 Au revoir!")
                self.save_stats()
                break
            except Exception as e:
                print(f"❌ Erreur: {e}")

def main():
    """Fonction principale."""
    print("🎮 LANCEMENT DU JEU ÉDUCATIF SOUSSOU 🎮")
    
    try:
        game = SoussouEducationalGame()
        game.run_game()
    except Exception as e:
        print(f"❌ Erreur lors du lancement: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()