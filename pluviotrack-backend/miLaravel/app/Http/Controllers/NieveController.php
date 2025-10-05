<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Nieve;

class NieveController extends Controller
{
    // Obtener todos los registros de nieve
    public function index()
    {
        $nieves = Nieve::orderBy('fecha', 'desc')->get();

        return response()->json($nieves, 200);
    }

    // Guardar un nuevo registro de nieve
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fecha' => 'required|date',
            'cantidad' => 'required|numeric|min:0',
            'observacion' => 'nullable|string|max:255',
        ]);

        try {
            $nieve = Nieve::create($validated);
            return response()->json([
                'message' => 'Registro de nieve creado correctamente',
                'data' => $nieve
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al guardar la nieve',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}