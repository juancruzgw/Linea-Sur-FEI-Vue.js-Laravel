<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\ReportRegular;
use App\Models\BreakageInstrument;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index()
    {
        $reportes = Report::with(['reportRegular', 'breakageInstrument', "site", "site.zona", "reportRegular.united_measure"])->get();

        $reportes->makeHidden(["created_at", "updated_at"]);

        return response()->json($reportes);
    }


    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {

            // 1) Crear el Report principal
            $report = Report::create([
                'date'             => $request->date,
                'note'             => $request->note,
                'image'            => $request->image,
                'audio'            => $request->audio,
                'type'             => $request->type,
                'user_id'          => $request->user_id,
                'instrument_id'    => $request->instrument_id,
                'precipitation_id' => $request->precipitation_id,
                'site_id'          => $request->site_id,
            ]);

            // 2) Decidir si es Regular o Breakage
            if ($request->type == "regular") {
                ReportRegular::create([
                    'amount'            => $request->amount,
                    'sample_id'         => $request->sample_id,
                    'united_measure_id' => $request->united_measure_id,

                    'report_id'         => $report->id,
                ]);
            } elseif ($request->type == "rotura") {
                BreakageInstrument::create([
                    'damage'      => $request->damage,
                    'report_id'   => $report->id, // corregido
                ]);
            } else {
                throw new \Exception("El request no tiene datos válidos para ReportRegular ni BreakageInstrument");
            }

            return response()->json([
                'message' => 'Reporte creado correctamente',
                'report'  => $report->load(['reportRegular', 'breakageInstrument'])
            ], 201);
        });
    }



  public function update(Request $request, $id)
{
    $validated = $request->validate([
        'note' => 'nullable|string',
        'site_id' => 'nullable|exists:sites,id',
        'report_regular.amount' => 'nullable|numeric',
    ]);

    $reporte = Report::findOrFail($id);
    $reporte->note = $validated['note'] ?? $reporte->note;

    if (isset($validated['site_id'])) {
        $reporte->site_id = $validated['site_id'];
    }
    
    $reporte->save();

    if ($request->has('report_regular') && $reporte->reportRegular) {
        $reporte->reportRegular()->update([
            'amount' => $validated['report_regular']['amount']
        ]);
    }

    return response()->json([
        'message' => 'Reporte actualizado correctamente',
        'report' => $reporte->load('reportRegular', 'site.zona')
    ], 200);
}

    public function histograma(Request $request)
    {
        $type = $request->input('type'); // dia | mes | año
        $precipitation = $request->input('precipitation'); // lluvia | nieve | caudalimetro
        $year = $request->input('year');
        $month = $request->input('month');

        if (!$type || !$precipitation) {
            return response()->json([
                'error' => 'Parámetros requeridos: type (dia|mes|año) y precipitation (lluvia|nieve|...)'
            ], 400);
        }

        $query = DB::table('reports')
            ->join('precipitations', 'reports.precipitation_id', '=', 'precipitations.id')
            ->join('report_regulars', 'reports.id', '=', 'report_regulars.report_id')
            ->where('precipitations.type', $precipitation);

        // Aplicar filtros opcionales
        if ($year) {
            $query->whereYear('reports.date', $year);
        }

        if ($month) {
            $query->whereMonth('reports.date', $month);
        }

        // Agrupaciones según el tipo
        switch ($type) {
            case 'dia':
                $data = $query
                    ->select(
                        DB::raw('DATE(reports.date) as date'),
                        DB::raw('SUM(report_regulars.amount) as amount')
                    )
                    ->groupBy(DB::raw('DATE(reports.date)'))
                    ->orderBy('date')
                    ->get();
                break;

            case 'mes':
                $data = $query
                    ->select(
                        DB::raw('YEAR(reports.date) as year'),
                        DB::raw('MONTH(reports.date) as month'),
                        DB::raw('SUM(report_regulars.amount) as amount')
                    )
                    ->groupBy(DB::raw('YEAR(reports.date), MONTH(reports.date)'))
                    ->orderBy('year')
                    ->orderBy('month')
                    ->get();
                break;

            case 'año':
                $data = $query
                    ->select(
                        DB::raw('YEAR(reports.date) as year'),
                        DB::raw('SUM(report_regulars.amount) as amount')
                    )
                    ->groupBy(DB::raw('YEAR(reports.date)'))
                    ->orderBy('year')
                    ->get();
                break;

            default:
                return response()->json(['error' => 'Tipo inválido. Usa dia, mes o año.'], 400);
        }

        return response()->json($data);
    }

    public function uploadImage(Request $request)
    {
        $base64 = $request->input('image');

        if (!$base64) {
            return response()->json(['error' => 'No se recibió ninguna imagen base64'], 422);
        }

        try {
            // Decodificar base64
            $imageData = base64_decode($base64);

            // Crear nombre único
            $filename = 'img_' . time() . '.jpg';
            $path = storage_path('app/public/uploads/' . $filename);

            // Guardar archivo
            file_put_contents($path, $imageData);

            return response()->json([
                'message' => 'Imagen subida correctamente',
                'full_url' => asset('storage/uploads/' . $filename),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al guardar la imagen',
                'message' => $e->getMessage(),
            ], 500);
        }
    }





    /**
     * Subir audio
     */
    public function uploadAudio(Request $request)
    {
        $request->validate([
            'audio' => 'required|mimes:mp3,m4a,wav,aac|max:20480', // 20MB max
        ]);

        try {
            $audio = $request->file('audio');

            $filename = time() . '_' . Str::random(10) . '.' . $audio->getClientOriginalExtension();
            $path = $audio->storeAs('audios', $filename, 'public');
            $url = Storage::url($path);

            return response()->json([
                'success' => true,
                'message' => 'Audio subido correctamente',
                'path' => $path,
                'audio_url' => $url,
                'full_url' => asset($url)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al subir el audio',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // /api/histograma?type=dia&precipitation=lluvia&month=10&year=2025

    // /api/histograma?type=mes&precipitation=nieve&year=2025

    // /api/histograma?type=año&precipitation=caudalimetro
}