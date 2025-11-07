<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SoussouController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProgressController;

// Route de test simple
Route::get('/test', function () {
    return response()->json(['message' => 'API fonctionne !']);
});

// Routes principales de l'API Soussou
Route::get('/', [SoussouController::class, 'getApiInfo']);
Route::post('/convert', [SoussouController::class, 'convertNumber']);
Route::get('/convert/{number}', [SoussouController::class, 'convertNumberGet']);
Route::get('/random', [SoussouController::class, 'getRandomNumber']);
Route::get('/generate/{difficulty}', [SoussouController::class, 'generateNumberByDifficulty']);
Route::get('/analyze/{number}', [SoussouController::class, 'analyzeNumber']);
Route::get('/explanation/{number}', [SoussouController::class, 'getExplanation']);
Route::get('/stats', [SoussouController::class, 'getStats']);
Route::post('/validate', [SoussouController::class, 'validateTranslation']);

// Authenticated user info (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateProfile']);
});

// Progress endpoints
Route::middleware('auth:sanctum')->group(function() {
    Route::get('/progress', [ProgressController::class, 'get']);
    Route::post('/progress', [ProgressController::class, 'update']);
});