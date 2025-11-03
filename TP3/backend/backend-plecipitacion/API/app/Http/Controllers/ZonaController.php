<?php

namespace App\Http\Controllers;

use App\Models\Zona;
use Illuminate\Http\Request;

class ZonaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    
    // Schema::create('zonas', function (Blueprint $table) {
    //         $table->id();
    //         $table->string('locality')->nullable();
    //         $table->timestamps();
    //     });




    public function register(Request $request)
    {
        $validated = $request->validate([
            'locality' => 'required|string|max:255',
        ]);

        

        $zona = Zona::create($validated);

        return response()->json($zona, 201);
    }

    public function index()
    {
        $zonas = Zona::all(); // trae todos

        return response()->json($zonas, 200);
    }

    public function test(){
        return response()->json(['message' => 'Test desde ZonaController'], 200);
    }

    public function getZonaByLocality($locality)
    {

        $zona = Zona::where('locality', $locality)->first();

        if ($zona) {
            return response()->json($zona, 200);
        } else {
            return response()->json(['message' => 'Zona no encontrada'], 404);
        }
    }

    public function getAllZonaData()
    {
        $zonas = Zona::with('sites')->get(); // Carga las zonas con sus sitios relacionados

        return response()->json($zonas, 200);
    }

    /**
     * Obtiene el total acumulado de reportes por zona
     */
    public function getTotalAcumuladoPorZona()
    {
        $zonas = Zona::with(['sites.reports.reportRegular'])->get();

        $resultado = $zonas->map(function ($zona) {
            $totalAcumulado = 0;

            // Recorrer todos los sitios de la zona
            foreach ($zona->sites as $site) {
                // Recorrer todos los reportes del sitio
                foreach ($site->reports as $report) {
                    // Sumar el amount del reportRegular si existe
                    if ($report->reportRegular) {
                        $totalAcumulado += $report->reportRegular->amount;
                    }
                }
            }

            return [
                'id' => $zona->id,
                'locality' => $zona->locality,
                'total_acumulado' => $totalAcumulado,
                'sitios_count' => $zona->sites->count(),
            ];
        });

        return response()->json($resultado, 200);
    }

    /**
     * Obtiene el total acumulado de una zona específica por ID
     */
    public function getTotalAcumuladoByZona($id)
    {
        $zona = Zona::with(['sites.reports.reportRegular'])->find($id);

        if (!$zona) {
            return response()->json(['message' => 'Zona no encontrada'], 404);
        }

        $totalAcumulado = 0;

        // Recorrer todos los sitios de la zona
        foreach ($zona->sites as $site) {
            // Recorrer todos los reportes del sitio
            foreach ($site->reports as $report) {
                // Sumar el amount del reportRegular si existe
                if ($report->reportRegular) {
                    $totalAcumulado += $report->reportRegular->amount;
                }
            }
        }

        return response()->json([
            'id' => $zona->id,
            'locality' => $zona->locality,
            'total_acumulado' => $totalAcumulado,
            'sitios' => $zona->sites->map(function ($site) {
                $totalSitio = 0;
                foreach ($site->reports as $report) {
                    if ($report->reportRegular) {
                        $totalSitio += $report->reportRegular->amount;
                    }
                }
                return [
                    'id' => $site->id,
                    'latitude' => $site->latitude,
                    'longitude' => $site->longitude,
                    'total_reportes' => $totalSitio,
                    'cantidad_reportes' => $site->reports->count(),
                ];
            }),
        ], 200);
    }
    
    
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}