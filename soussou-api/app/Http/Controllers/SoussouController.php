<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SoussouDataService;
use Illuminate\Http\JsonResponse;

class SoussouController extends Controller
{
    private $soussouService;

    public function __construct(SoussouDataService $soussouService)
    {
        $this->soussouService = $soussouService;
    }

    /**
     * Informations générales de l'API
     */
    public function getApiInfo(): JsonResponse
    {
        return response()->json([
            'name' => 'API Soussou Numbers',
            'version' => '1.0.0',
            'description' => 'API pour la conversion et l\'analyse des nombres en langue Soussou',
            'endpoints' => [
                'GET /' => 'Informations de l\'API',
                'POST /convert' => 'Convertir un nombre (POST)',
                'GET /convert/{number}' => 'Convertir un nombre (GET)',
                'GET /random' => 'Obtenir un nombre aléatoire',
                'GET /generate/{difficulty}' => 'Générer un nombre par difficulté',
                'GET /analyze/{number}' => 'Analyser un nombre en détail',
                'GET /explanation/{number}' => 'Obtenir l\'explication d\'un nombre',
                'GET /stats' => 'Statistiques des données',
                'POST /validate' => 'Valider une traduction'
            ],
            'difficulties' => ['easy', 'medium', 'hard', 'very_hard'],
            'data_source' => 'nombres_soussou_1_9999.csv',
            'range' => '1-9999'
        ]);
    }

    /**
     * Convertir un nombre (POST)
     */
    public function convertNumber(Request $request): JsonResponse
    {
        $request->validate([
            'number' => 'required|integer|min:1|max:9999',
            'format_type' => 'sometimes|string|in:csv_data,detailed,simple'
        ]);

        $number = $request->input('number');
        $formatType = $request->input('format_type', 'csv_data');
        
        $translation = $this->soussouService->getTranslation($number);
        
        if (!$translation) {
            return response()->json([
                'error' => 'Nombre non trouvé dans la base de données',
                'number' => $number
            ], 404);
        }

        $response = [
            'number' => $number,
            'translation' => $translation,
            'format_type' => $formatType
        ];

        if ($formatType === 'detailed') {
            $response['analysis'] = $this->soussouService->analyzeNumber($number);
        }

        return response()->json($response);
    }

    /**
     * Convertir un nombre (GET)
     */
    public function convertNumberGet($number, Request $request): JsonResponse
    {
        $number = intval($number);
        
        if ($number < 1 || $number > 9999) {
            return response()->json([
                'error' => 'Le nombre doit être entre 1 et 9999',
                'number' => $number
            ], 400);
        }

        $formatType = $request->query('format_type', 'csv_data');
        $translation = $this->soussouService->getTranslation($number);
        
        if (!$translation) {
            return response()->json([
                'error' => 'Nombre non trouvé dans la base de données',
                'number' => $number
            ], 404);
        }

        $response = [
            'number' => $number,
            'translation' => $translation,
            'format_type' => $formatType
        ];

        if ($formatType === 'detailed') {
            $response['analysis'] = $this->soussouService->analyzeNumber($number);
        }

        return response()->json($response);
    }

    /**
     * Obtenir un nombre aléatoire
     */
    public function getRandomNumber(): JsonResponse
    {
        $randomData = $this->soussouService->getRandomNumber();
        
        return response()->json([
            'success' => true,
            'data' => $randomData,
            'timestamp' => now()->toISOString()
        ]);
    }

    /**
     * Générer un nombre par difficulté
     */
    public function generateNumberByDifficulty($difficulty, Request $request): JsonResponse
    {
        $validDifficulties = ['easy', 'medium', 'hard', 'very_hard'];
        
        if (!in_array($difficulty, $validDifficulties)) {
            return response()->json([
                'error' => 'Difficulté invalide. Utilisez: ' . implode(', ', $validDifficulties),
                'valid_difficulties' => $validDifficulties
            ], 400);
        }

        $formatType = $request->query('format_type', 'csv_data');
        $numberData = $this->soussouService->generateNumberByDifficulty($difficulty);
        
        $response = [
            'success' => true,
            'data' => $numberData,
            'format_type' => $formatType
        ];

        if ($formatType === 'detailed') {
            $response['data']['analysis'] = $this->soussouService->analyzeNumber($numberData['number']);
        }

        return response()->json($response);
    }

    /**
     * Analyser un nombre en détail
     */
    public function analyzeNumber($number): JsonResponse
    {
        $number = intval($number);
        
        if ($number < 1 || $number > 9999) {
            return response()->json([
                'error' => 'Le nombre doit être entre 1 et 9999',
                'number' => $number
            ], 400);
        }

        $analysis = $this->soussouService->analyzeNumber($number);
        
        if (!$analysis) {
            return response()->json([
                'error' => 'Nombre non trouvé dans la base de données',
                'number' => $number
            ], 404);
        }

        return response()->json([
            'success' => true,
            'analysis' => $analysis,
            'timestamp' => now()->toISOString()
        ]);
    }

    /**
     * Obtenir l'explication d'un nombre (alias pour analyzeNumber)
     */
    public function getExplanation($number): JsonResponse
    {
        return $this->analyzeNumber($number);
    }

    /**
     * Obtenir des statistiques
     */
    public function getStats(): JsonResponse
    {
        $stats = $this->soussouService->getStats();
        
        return response()->json([
            'success' => true,
            'stats' => $stats,
            'timestamp' => now()->toISOString()
        ]);
    }

    /**
     * Valider une traduction
     */
    public function validateTranslation(Request $request): JsonResponse
    {
        $request->validate([
            'number' => 'required|integer|min:1|max:9999',
            'translation' => 'required|string|max:255'
        ]);

        $number = $request->input('number');
        $proposedTranslation = $request->input('translation');
        
        $validation = $this->soussouService->validateTranslation($number, $proposedTranslation);
        
        return response()->json([
            'success' => true,
            'validation' => $validation,
            'timestamp' => now()->toISOString()
        ]);
    }
}
