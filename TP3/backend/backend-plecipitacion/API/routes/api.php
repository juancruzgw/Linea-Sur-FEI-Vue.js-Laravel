<?php

use App\Http\Controllers\breakageInstrumentController;
use App\Http\Controllers\InstrumentUserController;
use App\Http\Controllers\PrecipitationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\reportRegularController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ZonaController;
use App\Http\Controllers\SiteController;
use App\Http\Controllers\UnitedMeasureController;
use App\Http\Controllers\TemperatureController;
use App\Http\Controllers\ClimateDataController;
use App\Http\Controllers\GeocodingController;
use App\Http\Controllers\WeatherController;

// ============================================
// SITIOS
// ============================================
Route::get("/sitios", [SiteController::class, "index"]);
Route::post("/site/register", [SiteController::class, "register"]);

// ============================================
// ZONAS
// ============================================
Route::get("/zonas", [ZonaController::class, "index"]);
Route::get("/zona/locality/{locality}", [ZonaController::class, "getZonaByLocality"]);
Route::post("/zona/register", [ZonaController::class, "register"]);
Route::get("/zonas/all-data", [ZonaController::class, "getAllZonaData"]);
Route::get("/zonas/total-acumulado", [ZonaController::class, "getTotalAcumuladoPorZona"]);
Route::get("/zona/{id}/total-acumulado", [ZonaController::class, "getTotalAcumuladoByZona"]);

// ============================================
// OTROS
// ============================================
Route::get("/unidades-medidas", [UnitedMeasureController::class, "index"]);
Route::get("/instrumentos-rotos", [breakageInstrumentController::class, "index"]);
Route::get("/precipitations", [PrecipitationController::class, "index"]);
Route::get("/reportes-regular", [reportRegularController::class, "index"]);

// ============================================
// REPORTES
// ============================================
Route::get("/reportes", [ReportController::class, "index"]);
Route::post("/report", [ReportController::class, "store"]);
Route::put('/reportes/{id}', [ReportController::class, 'update']);
Route::post('/upload-image', [ReportController::class, 'uploadImage']);
Route::post('/upload-audio', [ReportController::class, 'uploadAudio']);

// Histograma
Route::get('/histograma', [ReportController::class, 'histograma']);

// Reportes regulares
Route::get('/reporte/{type}', [reportRegularController::class, 'getReportData']);
Route::get('/reportes/regular/user/{idUser}', [reportRegularController::class, 'reportsUser']);
Route::get('/reportes/regular/site/{idSite}/{year?}', [reportRegularController::class, 'reportsSite']);
Route::get('/reportes/available-years', [reportRegularController::class, 'getAvailableYears']);

// Reportes de roturas
Route::get('/reportes/rotos/user/{idUser}', [breakageInstrumentController::class, 'reportsUser']);
Route::get('/reportes/rotos/site/{idSite}', [breakageInstrumentController::class, 'reportsSite']);

// ============================================
// USUARIOS
// ============================================
Route::post("/auth/login", [UserController::class, "login"]);
Route::post("/user/register", [UserController::class, "register"]);
Route::get("/usuarios", [UserController::class, "index"]);
Route::get("/usuario", [UserController::class, "searchWord"]);
Route::put("/usuario/{id}", [UserController::class, "modifyUserById"]);
Route::delete("/usuario/{id}", [UserController::class, "deleteUser"]);

// Token validation
Route::middleware(['jwt'])->group(function () {
    Route::get('/tokenValid', function () {
        return response()->json(['message' => 'Token válido ✅']);
    });
});

// ============================================
// INSTRUMENTOS (Mobile)
// ============================================
Route::get("/instrumentoUsuarios", [InstrumentUserController::class, "index"]);
Route::post("/instruments/{id}", [InstrumentUserController::class, "search"]);

// ============================================
// TEMPERATURE CONVERTER (SOAP Wrapper)
// ============================================
Route::get("/temperature/convert", [TemperatureController::class, "convert"]);
Route::post("/temperature/batch-convert", [TemperatureController::class, "batchConvert"]);
Route::get("/temperature/soap/info", [TemperatureController::class, "getSoapInfo"]);

// ============================================
// CLIMATE DATA (Open-Meteo API)
// ============================================
Route::get("/climate/historical", [ClimateDataController::class, "getHistoricalData"]);

// ============================================
// GEOCODING (Nominatim/OpenStreetMap API)
// ============================================
Route::get("/geocoding/reverse", [GeocodingController::class, "reverseGeocode"]);

// ============================================
// WEATHER (OpenWeatherMap API)
// ============================================
Route::get("/weather/current", [WeatherController::class, "getCurrentWeather"]);
