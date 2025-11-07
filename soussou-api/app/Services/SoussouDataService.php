<?php

namespace App\Services;
use App\Models\Translation;

class SoussouDataService
{
    private $data = [];
    private $csvPath;

    public function __construct()
    {
        $this->csvPath = storage_path('app/nombres_soussou_1_9999.csv');
        $this->loadData();
    }

    /**
     * Charger les données du fichier CSV avec mise en cache
     */
    private function loadData()
    {
        if (!file_exists($this->csvPath)) {
            throw new \Exception("Fichier CSV non trouvé : " . $this->csvPath);
        }

        $this->data = [];
        
        if (($handle = fopen($this->csvPath, "r")) !== FALSE) {
            // Ignorer la première ligne (en-têtes)
            fgetcsv($handle, 1000, ";");
            
            while (($data = fgetcsv($handle, 1000, ";")) !== FALSE) {
                if (count($data) >= 2 && is_numeric($data[0])) {
                    $number = intval($data[0]);
                    $translation = trim($data[1]);
                    $this->data[$number] = $translation;
                }
            }
            fclose($handle);
        }
    }

    /**
     * Obtenir la traduction d'un nombre
     */
    public function getTranslation($number)
    {
        // Priorité à la base de données
        $row = Translation::where('number', $number)->first();
        if ($row) {
            return $row->translation;
        }
        // Fallback CSV en mémoire
        return $this->data[$number] ?? null;
    }

    /**
     * Obtenir un nombre aléatoire avec sa traduction
     */
    public function getRandomNumber()
    {
        // Essayer via DB si disponible
        $row = Translation::inRandomOrder()->first();
        if ($row) {
            return [
                'number' => $row->number,
                'translation' => $row->translation,
            ];
        }
        // Fallback CSV
        $numbers = array_keys($this->data);
        $randomNumber = $numbers[array_rand($numbers)];
        return [
            'number' => $randomNumber,
            'translation' => $this->data[$randomNumber]
        ];
    }

    /**
     * Générer un nombre selon la difficulté
     */
    public function generateNumberByDifficulty($difficulty = 'medium')
    {
        $ranges = [
            'easy' => [1, 20],
            'medium' => [21, 100],
            'hard' => [101, 1000],
            'very_hard' => [1001, 9999]
        ];

        $range = $ranges[$difficulty] ?? $ranges['medium'];
        $number = rand($range[0], $range[1]);
        
        return [
            'number' => $number,
            'translation' => $this->getTranslation($number),
            'difficulty' => $difficulty,
            'range' => $range
        ];
    }

    /**
     * Analyser un nombre et fournir des explications détaillées
     */
    public function analyzeNumber($number)
    {
        $translation = $this->getTranslation($number);
        
        if (!$translation) {
            return null;
        }

        $analysis = [
            'number' => $number,
            'translation' => $translation,
            'difficulty' => $this->getDifficulty($number),
            'components' => $this->getComponents($number),
            'morphological_analysis' => $this->getMorphologicalAnalysis($number, $translation),
            'construction_steps' => $this->getConstructionSteps($number),
            'linguistic_patterns' => $this->getLinguisticPatterns($number, $translation)
        ];

        return $analysis;
    }

    /**
     * Déterminer la difficulté d'un nombre
     */
    private function getDifficulty($number)
    {
        if ($number <= 20) return 'easy';
        if ($number <= 100) return 'medium';
        if ($number <= 1000) return 'hard';
        return 'very_hard';
    }

    /**
     * Décomposer un nombre en composants
     */
    private function getComponents($number)
    {
        $components = [];
        
        if ($number >= 1000) {
            $thousands = intval($number / 1000);
            $components['thousands'] = $thousands;
            $number %= 1000;
        }
        
        if ($number >= 100) {
            $hundreds = intval($number / 100);
            $components['hundreds'] = $hundreds;
            $number %= 100;
        }
        
        if ($number >= 10) {
            $tens = intval($number / 10);
            $components['tens'] = $tens;
            $number %= 10;
        }
        
        if ($number > 0) {
            $components['units'] = $number;
        }
        
        return $components;
    }

    /**
     * Analyse morphologique de la traduction
     */
    private function getMorphologicalAnalysis($number, $translation)
    {
        $analysis = [
            'base_elements' => [],
            'connectors' => [],
            'patterns' => []
        ];

        // Identifier les connecteurs "nŭn"
        if (strpos($translation, 'nŭn') !== false) {
            $analysis['connectors'][] = 'nŭn (connecteur additif)';
        }

        // Identifier les éléments de base
        $baseNumbers = [
            'kérén' => 1, 'fírín' => 2, 'sàxán' => 3, 'náání' => 4, 'súlí' => 5,
            'sénní' => 6, 'sólófèré' => 7, 'sólómásàxán' => 8, 'sólómánáání' => 9,
            'fuú' => 10, 'm̀ɔx̀ɔǵɛŋ' => 20, 'k̀ɛḿɛ' => 100
        ];

        foreach ($baseNumbers as $word => $value) {
            if (strpos($translation, $word) !== false) {
                $analysis['base_elements'][] = "$word ($value)";
            }
        }

        return $analysis;
    }

    /**
     * Étapes de construction du nombre
     */
    private function getConstructionSteps($number)
    {
        $steps = [];
        $components = $this->getComponents($number);
        
        foreach ($components as $type => $value) {
            switch ($type) {
                case 'thousands':
                    $steps[] = "Milliers: $value × 1000";
                    break;
                case 'hundreds':
                    $steps[] = "Centaines: $value × 100";
                    break;
                case 'tens':
                    $steps[] = "Dizaines: $value × 10";
                    break;
                case 'units':
                    $steps[] = "Unités: $value";
                    break;
            }
        }
        
        return $steps;
    }

    /**
     * Patterns linguistiques identifiés
     */
    private function getLinguisticPatterns($number, $translation)
    {
        $patterns = [];
        
        if ($number <= 10) {
            $patterns[] = 'Nombre de base (système décimal)';
        } elseif ($number <= 19) {
            $patterns[] = 'Formation additive: 10 + unité';
        } elseif ($number % 10 == 0 && $number <= 90) {
            $patterns[] = 'Multiple de 10 (système vigésimal partiel)';
        } elseif ($number >= 100) {
            $patterns[] = 'Système centésimal avec décomposition';
        }
        
        if (strpos($translation, 'nŭn') !== false) {
            $patterns[] = 'Utilisation du connecteur additif "nŭn"';
        }
        
        return $patterns;
    }

    /**
     * Valider une traduction proposée
     */
    public function validateTranslation($number, $proposedTranslation)
    {
        $correctTranslation = $this->getTranslation($number);
        
        if (!$correctTranslation) {
            return [
                'valid' => false,
                'error' => 'Nombre non trouvé dans la base de données'
            ];
        }
        
        $isCorrect = trim(strtolower($proposedTranslation)) === trim(strtolower($correctTranslation));
        
        return [
            'valid' => $isCorrect,
            'correct_translation' => $correctTranslation,
            'proposed_translation' => $proposedTranslation,
            'similarity' => $this->calculateSimilarity($proposedTranslation, $correctTranslation)
        ];
    }

    /**
     * Calculer la similarité entre deux chaînes
     */
    private function calculateSimilarity($str1, $str2)
    {
        return similar_text(strtolower($str1), strtolower($str2), $percent);
    }

    /**
     * Obtenir des statistiques sur les données
     */
    public function getStats()
    {
        return [
            'total_numbers' => count($this->data),
            'range' => [
                'min' => min(array_keys($this->data)),
                'max' => max(array_keys($this->data))
            ],
            'difficulty_distribution' => [
                'easy' => count(array_filter(array_keys($this->data), fn($n) => $n <= 20)),
                'medium' => count(array_filter(array_keys($this->data), fn($n) => $n > 20 && $n <= 100)),
                'hard' => count(array_filter(array_keys($this->data), fn($n) => $n > 100 && $n <= 1000)),
                'very_hard' => count(array_filter(array_keys($this->data), fn($n) => $n > 1000))
            ]
        ];
    }
}
