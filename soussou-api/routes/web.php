<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return view('welcome');
});

// Ne pas redéfinir la route Sanctum CSRF cookie ici.
// Sanctum fournit déjà /sanctum/csrf-cookie et gère l’émission du cookie XSRF-TOKEN.

// Auth routes (cookie-based via session)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
