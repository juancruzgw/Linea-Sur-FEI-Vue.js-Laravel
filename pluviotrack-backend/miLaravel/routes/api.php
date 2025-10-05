<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LluviaController;
use App\Http\Controllers\NieveController;

Route::post('/login', [UserController::class, 'login']);

Route::get('/precipitaciones', [PrecipitacionController::class, 'index']);


// Lluvia
Route::get('/lluvia', [LluviaController::class, 'index']);
Route::post('/lluvia', [LluviaController::class, 'store']);

// Nieve
Route::get('/nieve', [NieveController::class, 'index']);
Route::post('/nieve', [NieveController::class, 'store']);