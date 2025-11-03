<?php

namespace App\Http\Controllers;

use App\Models\Site;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class SiteController extends Controller
{
    public function index()
    {
        $sites = Site::with(['zona', 'precipitation'])->get();
        return response()->json($sites, 200);
    }

    public function register(Request $request)
    {
        \Log::info('Datos recibidos para crear sitio:', $request->all());

        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'zona_id' => 'required|exists:zonas,id',
            'precipitation_id' => 'required|exists:precipitations,id'
        ]);

        if ($validator->fails()) {
            \Log::error('Errores de validación sitio:', $validator->errors()->toArray());
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $existingSite = Site::where('latitude', $request->latitude)
                           ->where('longitude', $request->longitude)
                           ->first();

        if ($existingSite) {
            return response()->json([
                'error' => 'Ya existe un sitio con estas coordenadas'
            ], 422);
        }

        $site = Site::create([
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'zona_id' => $request->zona_id,
            'precipitation_id' => $request->precipitation_id
        ]);

        $site->load(['zona', 'precipitation']);

        \Log::info('Sitio creado exitosamente:', $site->toArray());

        return response()->json([
            'message' => 'Sitio registrado correctamente',
            'site' => $site
        ], 201);
    }
}