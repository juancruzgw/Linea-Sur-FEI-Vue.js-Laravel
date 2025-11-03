<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lluvia;

class LluviaController extends Controller
{
    // Obtener todos los registros de lluvia
    public function index()
    {
        $lluvias = Lluvia::orderBy('fecha', 'desc')->get();

        return response()->json($lluvias, 200);
    }

    // Guardar un nuevo registro de lluvia
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fecha' => 'required|date',
            'cantidad' => 'required|numeric|min:0',
            'observacion' => 'nullable|string|max:255',
        ]);

        try {
            $lluvia = Lluvia::create($validated);
            return response()->json([
                'message' => 'Registro de lluvia creado correctamente',
                'data' => $lluvia
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al guardar la lluvia',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}