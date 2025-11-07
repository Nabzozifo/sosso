from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
import csv
from typing import Dict, List, Optional, Tuple
import re

app = FastAPI(title="Soussou Number API", description="API pour la conversion de nombres en Soussou avec deux formats d'écriture")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SoussouNumberConverter:
    def __init__(self):
        # Charger les données du fichier CSV
        self.soussou_data = self.load_csv_data()
    
    def load_csv_data(self):
        """Charge les données du fichier CSV nombres_soussou_1_9999.csv"""
        data = {}
        try:
            csv_path = os.path.join(os.path.dirname(__file__), 'nombres_soussou_1_9999.csv')
            with open(csv_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file, delimiter=';')
                for row in reader:
                    number = int(row['Nombre'])
                    soussou = row['Traduction_soussou']
                    data[number] = soussou
            print(f"Chargé {len(data)} traductions depuis le fichier CSV")
        except Exception as e:
            print(f"Erreur lors du chargement du CSV: {e}")
        return data
    
    def convert_to_soussou(self, number: int, format_type: str = "csv_data") -> Dict:
        """Convertit un nombre en Soussou en utilisant directement les données CSV"""
        if number < 1 or number > 9999:
            raise ValueError("Le nombre doit être entre 1 et 9999 (selon les données disponibles)")
        
        # Vérifier si on a la traduction dans les données CSV
        if number in self.soussou_data:
            soussou_text = self.soussou_data[number]
            
            # Générer une explication logique basée sur la structure du nombre
            explanation = self._generate_explanation(number, soussou_text)
            
            # Générer une structure d'arbre basée sur la décomposition du nombre
            tree_structure = self._generate_tree_structure(number, soussou_text)
            
            return {
                "number": number,
                "soussou": soussou_text,
                "format": "csv_data",
                "source": "nombres_soussou_1_9999.csv",
                "explanation": explanation,
                "tree_structure": tree_structure
            }
        else:
            raise ValueError(f"Aucune traduction trouvée pour le nombre {number} dans les données CSV")
    
    def _generate_explanation(self, number: int, soussou_text: str) -> str:
        """Génère une explication logique pour la traduction du nombre"""
        explanations = []
        
        if number <= 10:
            explanations.append(f"Nombre de base: {number} se traduit directement par '{soussou_text}'")
        elif number <= 20:
            explanations.append(f"Nombre composé: {number} = 10 + {number-10}, traduit par '{soussou_text}'")
        elif number <= 99:
            tens = number // 10
            units = number % 10
            if units == 0:
                explanations.append(f"Dizaine: {number} = {tens} × 10, traduit par '{soussou_text}'")
            else:
                explanations.append(f"Nombre composé: {number} = {tens}0 + {units}, traduit par '{soussou_text}'")
        elif number <= 999:
            hundreds = number // 100
            remainder = number % 100
            if remainder == 0:
                explanations.append(f"Centaine: {number} = {hundreds} × 100, traduit par '{soussou_text}'")
            else:
                explanations.append(f"Nombre composé: {number} = {hundreds}00 + {remainder}, traduit par '{soussou_text}'")
        else:
            thousands = number // 1000
            remainder = number % 1000
            if remainder == 0:
                explanations.append(f"Millier: {number} = {thousands} × 1000, traduit par '{soussou_text}'")
            else:
                explanations.append(f"Nombre composé: {number} = {thousands}000 + {remainder}, traduit par '{soussou_text}'")
        
        explanations.append("Traduction obtenue depuis les données CSV authentiques")
        return " → ".join(explanations)
    
    def _generate_tree_structure(self, number: int, soussou_text: str) -> dict:
        """Génère une structure d'arbre pour la décomposition du nombre"""
        if number <= 10:
            return {
                "type": "base",
                "value": number,
                "soussou": soussou_text,
                "components": []
            }
        elif number <= 99:
            tens = number // 10
            units = number % 10
            components = [{"type": "tens", "value": tens * 10}]
            if units > 0:
                components.append({"type": "units", "value": units})
            return {
                "type": "compound",
                "value": number,
                "soussou": soussou_text,
                "components": components
            }
        elif number <= 999:
            hundreds = number // 100
            remainder = number % 100
            components = [{"type": "hundreds", "value": hundreds * 100}]
            if remainder > 0:
                components.append({"type": "remainder", "value": remainder})
            return {
                "type": "compound",
                "value": number,
                "soussou": soussou_text,
                "components": components
            }
        else:
            thousands = number // 1000
            remainder = number % 1000
            components = [{"type": "thousands", "value": thousands * 1000}]
            if remainder > 0:
                components.append({"type": "remainder", "value": remainder})
            return {
                "type": "compound",
                "value": number,
                "soussou": soussou_text,
                "components": components
            }

    
    def _generate_by_rules(self, number: int, format_type: str) -> Dict:
        """Génère la traduction en utilisant les règles morphologiques"""
        parts = []
        explanation_steps = []
        tree_structure = {"type": "compound", "parts": []}
        
        # Décomposition du nombre
        if number >= 1000000000:
            billions = number // 1000000000
            remainder = number % 1000000000
            billion_part = self._convert_basic_number(billions, format_type)
            parts.append(billion_part)
            parts.append(self.structural_markers["billion"][format_type])
            explanation_steps.append(f"{billions} milliard(s) = {billion_part} {self.structural_markers['billion'][format_type]}")
            tree_structure["parts"].append({"type": "billion", "value": billions, "text": billion_part})
            
            if remainder > 0:
                parts.append(self.connector[format_type])
                remainder_result = self._generate_by_rules(remainder, format_type)
                parts.append(remainder_result["soussou"])
                explanation_steps.extend(remainder_result["explanation_steps"])
                tree_structure["parts"].append(remainder_result["tree_structure"])
        
        elif number >= 1000000:
            millions = number // 1000000
            remainder = number % 1000000
            million_part = self._convert_basic_number(millions, format_type)
            parts.append(million_part)
            parts.append(self.structural_markers["million"][format_type])
            explanation_steps.append(f"{millions} million(s) = {million_part} {self.structural_markers['million'][format_type]}")
            tree_structure["parts"].append({"type": "million", "value": millions, "text": million_part})
            
            if remainder > 0:
                parts.append(self.connector[format_type])
                remainder_result = self._generate_by_rules(remainder, format_type)
                parts.append(remainder_result["soussou"])
                explanation_steps.extend(remainder_result["explanation_steps"])
                tree_structure["parts"].append(remainder_result["tree_structure"])
        
        elif number >= 1000:
            thousands = number // 1000
            remainder = number % 1000
            
            if thousands >= 100:
                hundred_thousands = thousands // 100
                thousand_remainder = thousands % 100
                
                hundred_part = self._convert_basic_number(hundred_thousands, format_type)
                parts.append(hundred_part)
                parts.append(self.structural_markers["hundred_thousand"][format_type])
                explanation_steps.append(f"{hundred_thousands} centaine(s) de milliers = {hundred_part} {self.structural_markers['hundred_thousand'][format_type]}")
                tree_structure["parts"].append({"type": "hundred_thousand", "value": hundred_thousands, "text": hundred_part})
                
                if thousand_remainder > 0:
                    parts.append(self.connector[format_type])
                    thousand_part = self._convert_basic_number(thousand_remainder, format_type)
                    parts.append(thousand_part)
                    parts.append(self.structural_markers["thousand"][format_type])
                    explanation_steps.append(f"{thousand_remainder} millier(s) = {thousand_part} {self.structural_markers['thousand'][format_type]}")
                    tree_structure["parts"].append({"type": "thousand", "value": thousand_remainder, "text": thousand_part})
            
            elif thousands >= 10:
                ten_thousands = thousands // 10
                thousand_remainder = thousands % 10
                
                ten_part = self._convert_basic_number(ten_thousands, format_type)
                parts.append(ten_part)
                parts.append(self.structural_markers["ten_thousand"][format_type])
                explanation_steps.append(f"{ten_thousands} dizaine(s) de milliers = {ten_part} {self.structural_markers['ten_thousand'][format_type]}")
                tree_structure["parts"].append({"type": "ten_thousand", "value": ten_thousands, "text": ten_part})
                
                if thousand_remainder > 0:
                    parts.append(self.connector[format_type])
                    thousand_part = self._convert_basic_number(thousand_remainder, format_type)
                    parts.append(thousand_part)
                    parts.append(self.structural_markers["thousand"][format_type])
                    explanation_steps.append(f"{thousand_remainder} millier(s) = {thousand_part} {self.structural_markers['thousand'][format_type]}")
                    tree_structure["parts"].append({"type": "thousand", "value": thousand_remainder, "text": thousand_part})
            
            else:
                thousand_part = self._convert_basic_number(thousands, format_type)
                parts.append(thousand_part)
                parts.append(self.structural_markers["thousand"][format_type])
                explanation_steps.append(f"{thousands} millier(s) = {thousand_part} {self.structural_markers['thousand'][format_type]}")
                tree_structure["parts"].append({"type": "thousand", "value": thousands, "text": thousand_part})
            
            if remainder > 0:
                parts.append(self.connector[format_type])
                remainder_result = self._convert_basic_number(remainder, format_type)
                parts.append(remainder_result)
                explanation_steps.append(f"Reste {remainder} = {remainder_result}")
                tree_structure["parts"].append({"type": "remainder", "value": remainder, "text": remainder_result})
        
        else:
            # Nombres < 1000
            result = self._convert_basic_number(number, format_type)
            parts.append(result)
            explanation_steps.append(f"Nombre de base {number} = {result}")
            tree_structure = {"type": "basic", "value": number, "text": result}
        
        soussou_text = " ".join(parts)
        
        return {
            "number": number,
            "soussou": soussou_text,
            "format": format_type,
            "source": "morphological_rules",
            "explanation": " → ".join(explanation_steps),
            "explanation_steps": explanation_steps,
            "tree_structure": tree_structure
        }
    
    def _convert_basic_number(self, number: int, format_type: str) -> str:
        """Convertit les nombres de base (1-999)"""
        if number == 0:
            return ""
        
        morphemes = self.base_morphemes if format_type == "linguistic" else self.dataset_format
        connector = self.connector[format_type]
        
        if number <= 9:
            return morphemes[number]
        
        elif number <= 99:
            if number == 10:
                return self.structural_markers["ten"][format_type]
            elif number < 20:
                return f"{self.structural_markers['ten'][format_type]} {connector} {morphemes[number - 10]}"
            else:
                tens = number // 10
                units = number % 10
                if units == 0:
                    return f"{morphemes[tens]} {self.structural_markers['ten'][format_type]}"
                else:
                    return f"{morphemes[tens]} {self.structural_markers['ten'][format_type]} {connector} {morphemes[units]}"
        
        else:  # 100-999
            hundreds = number // 100
            remainder = number % 100
            
            if remainder == 0:
                return f"{morphemes[hundreds]} {self.structural_markers['hundred'][format_type]}"
            else:
                remainder_text = self._convert_basic_number(remainder, format_type)
                return f"{morphemes[hundreds]} {self.structural_markers['hundred'][format_type]} {connector} {remainder_text}"

# Instance globale du convertisseur
converter = SoussouNumberConverter()

class NumberRequest(BaseModel):
    number: int
    format_type: str = "csv_data"

class NumberResponse(BaseModel):
    number: int
    soussou: str
    source: str = "CSV Data"
    explanation: str
    tree_structure: dict

@app.get("/")
async def root():
    return {
        "message": "API Soussou Number Converter",
        "source": "CSV Data (nombres_soussou_1_9999.csv)",
        "range": "1 à 9999"
    }

@app.post("/convert", response_model=NumberResponse)
async def convert_number(request: NumberRequest):
    """Convertit un nombre en Soussou en utilisant les données CSV"""
    try:
        result = converter.convert_to_soussou(request.number, request.format_type)
        return NumberResponse(**result)
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur interne: {str(e)}")

@app.get("/convert/{number}")
async def convert_number_get(number: int, format_type: str = "csv_data"):
    """Convertit un nombre en Soussou (GET) en utilisant les données CSV"""
    try:
        result = converter.convert_to_soussou(number, format_type)
        return result
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur interne: {str(e)}")

@app.get("/random")
async def get_random_number():
    """Génère un nombre aléatoire avec sa traduction depuis les données CSV"""
    import random
    
    # Utiliser les nombres disponibles dans les données CSV
    available_numbers = list(converter.soussou_data.keys())
    if not available_numbers:
        raise HTTPException(status_code=500, detail="Aucune donnée CSV disponible")
    
    # Différentes gammes de nombres pour varier la difficulté
    ranges = [
        (1, 20),      # Facile
        (21, 100),    # Moyen
        (101, 1000),  # Difficile
        (1001, 9999), # Très difficile
    ]
    
    # Choisir une gamme et un nombre dans cette gamme
    range_choice = random.choice(ranges)
    available_in_range = [n for n in available_numbers if range_choice[0] <= n <= range_choice[1]]
    
    if not available_in_range:
        # Si aucun nombre dans la gamme, prendre un nombre aléatoire
        number = random.choice(available_numbers)
        difficulty_level = "Aléatoire"
    else:
        number = random.choice(available_in_range)
        difficulty_level = ["Facile", "Moyen", "Difficile", "Très difficile"][ranges.index(range_choice)]
    
    # Générer la traduction avec explication et structure d'arbre
    result = converter.convert_to_soussou(number)
    
    return {
        "number": number,
        "soussou": result["soussou"],
        "source": "CSV Data",
        "explanation": result["explanation"],
        "tree_structure": result["tree_structure"],
        "difficulty": {
            "level": difficulty_level,
            "range": f"{range_choice[0] if 'available_in_range' in locals() and available_in_range else 1}-{range_choice[1] if 'available_in_range' in locals() and available_in_range else 9999}"
        }
    }

@app.get("/info")
async def get_info():
    """Informations sur l'API et les données disponibles"""
    return {
        "api_version": "2.0",
        "data_source": "CSV File (nombres_soussou_1_9999.csv)",
        "available_numbers": f"1 à {max(converter.soussou_data.keys()) if converter.soussou_data else 0}",
        "total_entries": len(converter.soussou_data),
        "endpoints": {
            "convert": "Conversion de nombres en soussou",
            "random": "Génération de nombres aléatoires",
            "info": "Informations sur l'API"
        }
    }

class ExplainRequest(BaseModel):
    number: int



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)