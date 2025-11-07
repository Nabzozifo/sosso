#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Modèle hybride pour la génération de nombres soussou
Combine règles morphologiques et réseau de neurones
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional, Union
import json
import re
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from soussou_rule_based_system import SoussouRuleBasedSystem, SoussouSemanticTokenizer

class SoussouDataset(Dataset):
    """Dataset pour l'entraînement du modèle hybride"""
    
    def __init__(self, numbers: List[int], translations: List[str], 
                 rule_features: List[Dict], max_length: int = 50):
        self.numbers = numbers
        self.translations = translations
        self.rule_features = rule_features
        self.max_length = max_length
        
        # Créer un vocabulaire des caractères
        all_chars = set()
        for translation in translations:
            all_chars.update(translation)
        
        self.char_to_idx = {char: idx for idx, char in enumerate(sorted(all_chars))}
        self.char_to_idx['<PAD>'] = len(self.char_to_idx)
        self.char_to_idx['<START>'] = len(self.char_to_idx)
        self.char_to_idx['<END>'] = len(self.char_to_idx)
        
        self.idx_to_char = {idx: char for char, idx in self.char_to_idx.items()}
        self.vocab_size = len(self.char_to_idx)
    
    def __len__(self):
        return len(self.numbers)
    
    def __getitem__(self, idx):
        number = self.numbers[idx]
        translation = self.translations[idx]
        rule_features = self.rule_features[idx]
        
        # Encoder le nombre (features numériques)
        number_features = self._encode_number_features(number)
        
        # Encoder les features des règles
        rule_vector = self._encode_rule_features(rule_features)
        
        # Encoder la traduction (target)
        target_sequence = self._encode_translation(translation)
        
        return {
            'number_features': torch.FloatTensor(number_features),
            'rule_features': torch.FloatTensor(rule_vector),
            'target_sequence': torch.LongTensor(target_sequence),
            'target_length': len(target_sequence)
        }
    
    def _encode_number_features(self, number: int) -> List[float]:
        """Encode les features numériques d'un nombre"""
        features = []
        
        # Décomposition positionnelle
        features.append(number % 10)  # unités
        features.append((number // 10) % 10)  # dizaines
        features.append((number // 100) % 10)  # centaines
        features.append((number // 1000) % 10)  # milliers
        
        # Features logarithmiques
        features.append(np.log10(max(1, number)))
        
        # Features binaires pour les seuils
        features.append(1.0 if number >= 10 else 0.0)
        features.append(1.0 if number >= 20 else 0.0)
        features.append(1.0 if number >= 100 else 0.0)
        features.append(1.0 if number >= 1000 else 0.0)
        
        return features
    
    def _encode_rule_features(self, rule_features: Dict) -> List[float]:
        """Encode les features des règles morphologiques"""
        features = [0.0] * 20  # Vecteur de features fixe
        
        # Type de pattern
        pattern_types = ['unit', 'teen', 'base_ten', 'compound_ten', 
                        'base_hundred', 'compound_hundred', 'base_thousand', 'compound_thousand']
        
        pattern_type = rule_features.get('pattern_type', 'unknown')
        if pattern_type in pattern_types:
            features[pattern_types.index(pattern_type)] = 1.0
        
        # Présence de connecteurs
        if 'has_connector' in rule_features:
            features[8] = 1.0 if rule_features['has_connector'] else 0.0
        
        # Nombre de composants
        if 'num_components' in rule_features:
            features[9] = min(rule_features['num_components'] / 5.0, 1.0)
        
        # Complexité morphologique
        if 'morphological_complexity' in rule_features:
            features[10] = min(rule_features['morphological_complexity'] / 10.0, 1.0)
        
        return features
    
    def _encode_translation(self, translation: str) -> List[int]:
        """Encode une traduction en séquence d'indices"""
        sequence = [self.char_to_idx['<START>']]
        for char in translation:
            if char in self.char_to_idx:
                sequence.append(self.char_to_idx[char])
        sequence.append(self.char_to_idx['<END>'])
        
        # Padding
        while len(sequence) < self.max_length:
            sequence.append(self.char_to_idx['<PAD>'])
        
        return sequence[:self.max_length]

class SoussouHybridModel(nn.Module):
    """Modèle hybride règles + réseau de neurones"""
    
    def __init__(self, vocab_size: int, embedding_dim: int = 128, 
                 hidden_dim: int = 256, num_rule_features: int = 20,
                 num_number_features: int = 9):
        super(SoussouHybridModel, self).__init__()
        
        self.vocab_size = vocab_size
        self.embedding_dim = embedding_dim
        self.hidden_dim = hidden_dim
        
        # Encodeur pour les features numériques
        self.number_encoder = nn.Sequential(
            nn.Linear(num_number_features, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU()
        )
        
        # Encodeur pour les features des règles
        self.rule_encoder = nn.Sequential(
            nn.Linear(num_rule_features, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU()
        )
        
        # Combinaison des features
        self.feature_combiner = nn.Sequential(
            nn.Linear(32 + 32, hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.2)
        )
        
        # Décodeur LSTM pour la génération de séquence
        self.embedding = nn.Embedding(vocab_size, embedding_dim)
        self.lstm = nn.LSTM(embedding_dim + hidden_dim, hidden_dim, 
                           batch_first=True, num_layers=2, dropout=0.2)
        self.output_projection = nn.Linear(hidden_dim, vocab_size)
        
    def forward(self, number_features, rule_features, target_sequence=None):
        batch_size = number_features.size(0)
        
        # Encoder les features
        number_encoded = self.number_encoder(number_features)
        rule_encoded = self.rule_encoder(rule_features)
        
        # Combiner les features
        combined_features = torch.cat([number_encoded, rule_encoded], dim=1)
        context_vector = self.feature_combiner(combined_features)
        
        if target_sequence is not None:
            # Mode entraînement - teacher forcing
            seq_length = target_sequence.size(1)
            embedded = self.embedding(target_sequence)
            
            # Répéter le context vector pour chaque position de la séquence
            context_expanded = context_vector.unsqueeze(1).repeat(1, seq_length, 1)
            
            # Concaténer embedding et context
            lstm_input = torch.cat([embedded, context_expanded], dim=2)
            
            # LSTM
            lstm_output, _ = self.lstm(lstm_input)
            
            # Projection vers le vocabulaire
            output = self.output_projection(lstm_output)
            
            return output
        else:
            # Mode inférence - génération auto-régressive
            return self._generate_sequence(context_vector, max_length=50)
    
    def _generate_sequence(self, context_vector, max_length=50):
        """Génère une séquence de manière auto-régressive"""
        batch_size = context_vector.size(0)
        device = context_vector.device
        
        # Initialiser avec le token START
        current_token = torch.full((batch_size, 1), 1, dtype=torch.long, device=device)  # <START>
        generated_sequence = []
        
        hidden = None
        
        for _ in range(max_length):
            # Embedding du token courant
            embedded = self.embedding(current_token)
            
            # Concaténer avec le context vector
            context_expanded = context_vector.unsqueeze(1)
            lstm_input = torch.cat([embedded, context_expanded], dim=2)
            
            # LSTM step
            lstm_output, hidden = self.lstm(lstm_input, hidden)
            
            # Projection et prédiction
            logits = self.output_projection(lstm_output)
            predicted_token = torch.argmax(logits, dim=-1)
            
            generated_sequence.append(predicted_token)
            current_token = predicted_token
            
            # Arrêter si on génère le token END
            if (predicted_token == 2).all():  # <END>
                break
        
        return torch.cat(generated_sequence, dim=1)

class SoussouHybridTrainer:
    """Entraîneur pour le modèle hybride"""
    
    def __init__(self, csv_path: str):
        self.csv_path = csv_path
        self.rule_system = SoussouRuleBasedSystem()
        self.tokenizer = SoussouSemanticTokenizer()
        self.model = None
        self.dataset = None
        
    def prepare_data(self):
        """Prépare les données d'entraînement"""
        # Charger les données
        data = pd.read_csv(self.csv_path, sep=';', encoding='utf-8')
        
        numbers = []
        translations = []
        rule_features = []
        
        print("Préparation des données...")
        for idx, row in data.iterrows():
            if idx % 1000 == 0:
                print(f"  Traité: {idx}/{len(data)}")
            
            number = row['Nombre']
            translation = row['Traduction_soussou']
            
            # Générer les features des règles
            rule_analysis = self.rule_system.analyze_generation(number)
            
            # Extraire les features
            features = {
                'pattern_type': self._classify_pattern(number),
                'has_connector': 'nŭn' in translation,
                'num_components': len(translation.split()),
                'morphological_complexity': self._calculate_complexity(translation)
            }
            
            numbers.append(number)
            translations.append(translation)
            rule_features.append(features)
        
        # Créer le dataset
        self.dataset = SoussouDataset(numbers, translations, rule_features)
        print(f"Dataset créé avec {len(self.dataset)} exemples")
        print(f"Taille du vocabulaire: {self.dataset.vocab_size}")
        
        return self.dataset
    
    def _classify_pattern(self, number: int) -> str:
        """Classifie le pattern d'un nombre"""
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
    
    def _calculate_complexity(self, translation: str) -> int:
        """Calcule la complexité morphologique d'une traduction"""
        # Nombre de mots
        word_count = len(translation.split())
        
        # Nombre de connecteurs
        connector_count = translation.count('nŭn')
        
        # Longueur totale
        char_count = len(translation)
        
        # Score de complexité simple
        complexity = word_count + connector_count * 2 + char_count // 10
        
        return complexity
    
    def train_model(self, epochs: int = 50, batch_size: int = 32, learning_rate: float = 0.001):
        """Entraîne le modèle hybride"""
        if self.dataset is None:
            self.prepare_data()
        
        # Diviser les données
        train_size = int(0.8 * len(self.dataset))
        val_size = len(self.dataset) - train_size
        train_dataset, val_dataset = torch.utils.data.random_split(
            self.dataset, [train_size, val_size]
        )
        
        # DataLoaders
        train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
        val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
        
        # Modèle
        self.model = SoussouHybridModel(
            vocab_size=self.dataset.vocab_size,
            embedding_dim=128,
            hidden_dim=256
        )
        
        # Optimiseur et loss
        optimizer = optim.Adam(self.model.parameters(), lr=learning_rate)
        criterion = nn.CrossEntropyLoss(ignore_index=self.dataset.char_to_idx['<PAD>'])
        
        print(f"Début de l'entraînement - {epochs} époques")
        
        for epoch in range(epochs):
            # Entraînement
            self.model.train()
            train_loss = 0.0
            
            for batch in train_loader:
                optimizer.zero_grad()
                
                # Forward pass
                output = self.model(
                    batch['number_features'],
                    batch['rule_features'],
                    batch['target_sequence'][:, :-1]  # Exclure le dernier token
                )
                
                # Calculer la loss
                target = batch['target_sequence'][:, 1:]  # Exclure le premier token
                loss = criterion(output.reshape(-1, output.size(-1)), target.reshape(-1))
                
                # Backward pass
                loss.backward()
                optimizer.step()
                
                train_loss += loss.item()
            
            # Validation
            self.model.eval()
            val_loss = 0.0
            
            with torch.no_grad():
                for batch in val_loader:
                    output = self.model(
                        batch['number_features'],
                        batch['rule_features'],
                        batch['target_sequence'][:, :-1]
                    )
                    
                    target = batch['target_sequence'][:, 1:]
                    loss = criterion(output.reshape(-1, output.size(-1)), target.reshape(-1))
                    val_loss += loss.item()
            
            avg_train_loss = train_loss / len(train_loader)
            avg_val_loss = val_loss / len(val_loader)
            
            print(f"Époque {epoch+1}/{epochs} - Train Loss: {avg_train_loss:.4f}, Val Loss: {avg_val_loss:.4f}")
        
        print("Entraînement terminé!")
    
    def generate_translation(self, number: int) -> str:
        """Génère la traduction d'un nombre"""
        if self.model is None:
            return "Modèle non entraîné"
        
        self.model.eval()
        
        # Préparer les features
        number_features = torch.FloatTensor([self.dataset._encode_number_features(number)])
        
        rule_analysis = self.rule_system.analyze_generation(number)
        rule_features_dict = {
            'pattern_type': self._classify_pattern(number),
            'has_connector': False,  # Sera déterminé par le modèle
            'num_components': 1,
            'morphological_complexity': 1
        }
        rule_features = torch.FloatTensor([self.dataset._encode_rule_features(rule_features_dict)])
        
        # Génération
        with torch.no_grad():
            generated_sequence = self.model(number_features, rule_features)
        
        # Décoder la séquence
        translation = self._decode_sequence(generated_sequence[0])
        
        return translation
    
    def _decode_sequence(self, sequence: torch.Tensor) -> str:
        """Décode une séquence d'indices en texte"""
        chars = []
        for idx in sequence:
            idx_val = idx.item()
            if idx_val in self.dataset.idx_to_char:
                char = self.dataset.idx_to_char[idx_val]
                if char == '<END>':
                    break
                elif char not in ['<START>', '<PAD>']:
                    chars.append(char)
        
        return ''.join(chars)
    
    def save_model(self, path: str):
        """Sauvegarde le modèle"""
        if self.model is not None:
            torch.save({
                'model_state_dict': self.model.state_dict(),
                'vocab_size': self.dataset.vocab_size,
                'char_to_idx': self.dataset.char_to_idx,
                'idx_to_char': self.dataset.idx_to_char
            }, path)
            print(f"Modèle sauvegardé: {path}")
    
    def load_model(self, path: str):
        """Charge un modèle sauvegardé"""
        checkpoint = torch.load(path)
        
        self.model = SoussouHybridModel(vocab_size=checkpoint['vocab_size'])
        self.model.load_state_dict(checkpoint['model_state_dict'])
        
        # Recréer le dataset minimal pour le décodage
        class MinimalDataset:
            def __init__(self, char_to_idx, idx_to_char, vocab_size):
                self.char_to_idx = char_to_idx
                self.idx_to_char = idx_to_char
                self.vocab_size = vocab_size
            
            def _encode_number_features(self, number):
                return SoussouDataset([], [], [], 50)._encode_number_features(number)
            
            def _encode_rule_features(self, rule_features):
                return SoussouDataset([], [], [], 50)._encode_rule_features(rule_features)
        
        self.dataset = MinimalDataset(
            checkpoint['char_to_idx'],
            checkpoint['idx_to_char'],
            checkpoint['vocab_size']
        )
        
        print(f"Modèle chargé: {path}")

if __name__ == "__main__":
    # Test du modèle hybride
    trainer = SoussouHybridTrainer("nombres_soussou_1_9999.csv")
    
    print("=== ENTRAÎNEMENT DU MODÈLE HYBRIDE ===")
    # trainer.train_model(epochs=10, batch_size=16)  # Entraînement rapide pour test
    
    # Pour le moment, test avec le système de règles uniquement
    print("\n=== TEST AVEC LE SYSTÈME DE RÈGLES ===")
    rule_system = SoussouRuleBasedSystem()
    
    test_numbers = [1, 11, 21, 35, 100, 150, 1000, 1234]
    for number in test_numbers:
        translation = rule_system.number_to_soussou(number)
        print(f"{number}: {translation}")