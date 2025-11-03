<?php
/*
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lluvia;
use App\Models\Nieve;

class PrecipitacionController extends Controller
{
    public function index()
    {
        // Adaptamos lluvia
        $lluvias = Lluvia::all()->map(function ($l) {
            return [
                'type' => 'lluvia',
                'date' => $l->fecha,
                'amount' => $l->cantidad,
                'notes' => $l->observacion,
            ];
        });

        // Adaptamos nieve
        $nieves = Nieve::all()->map(function ($n) {
            return [
                'type' => 'nieve',
                'date' => $n->fecha,
                'depth' => $n->cantidad, // asumimos que guardás "cantidad" como espesor en cm
                'typeSnow' => $n->observacion, // si observacion es el tipo de nieve
            ];
        });

        // Combinamos y ordenamos por fecha descendente
        $records = $lluvias->merge($nieves)->sortByDesc('date')->values();

        return response()->json($records);
    }
}*/