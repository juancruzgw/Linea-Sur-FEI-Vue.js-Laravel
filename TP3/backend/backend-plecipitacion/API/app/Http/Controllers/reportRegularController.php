<?php

namespace App\Http\Controllers;

use App\Models\ReportRegular;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class reportRegularController extends Controller
{
    public function index(){
        $reportRegular = ReportRegular::all();
        return response()->json($reportRegular, 200);
    }

    public function getReportData($tipo)
    {
        $reportRegular = ReportRegular::with([
            'report.site:id,latitude,longitude',
            'report.precipitation:id,type',
            'united_measure:id,valueMeasure,abbreviation'
        ])
        ->whereHas('report.precipitation', function ($query) use ($tipo) {
            $query->where('type', $tipo);
        })
        ->get();

        // Ocultar campos de ReportRegular
        $reportRegular->makeHidden(['audio', 'image', 'note', 'date' , "report_id"]);

        // Ocultar campos de report relacionado
        $reportRegular->each(function($item) {
            if ($item->report) {
                $item->report->makeHidden(['audio', 'image', 'note', 'date']);
            }
        });

        return response()->json($reportRegular, 200);
    }

    // Obtiene los años donde existen reportes (solo años con datos reales)
    public function getAvailableYears(){
        $years = DB::table('report_regulars')
            ->join('reports', 'report_regulars.report_id', '=', 'reports.id')
            ->select(DB::raw('DISTINCT YEAR(reports.date) as year'))
            ->whereNotNull('reports.date')
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();

        return response()->json($years, 200);
    }

    //trae todos los reportes regulares de un usuario
    public function reportsUser($idUser){
        $reportRegular = ReportRegular::with('report')
        ->whereHas('report', function ($query) use ($idUser) {
            $query->where('user_id', $idUser);
        })
        ->get();

        return response()->json($reportRegular, 200);
    }

    //obtenes todos los reportes con el id del sitio (con filtro opcional de año)
  public function reportsSite($idSite, $year = null){
    $query = ReportRegular::with(['report' => function($query) {
            $query->select('id', 'site_id', 'date', 'user_id'); // Incluir date
        }])
        ->whereHas('report', function ($q) use ($idSite, $year) {
            $q->where('site_id', $idSite);
            
            if ($year !== null) {
                $q->whereYear('date', $year);
            }
        });

    if ($year !== null) {
        $query->orderBy(\DB::raw('(SELECT date FROM reports WHERE reports.id = report_regulars.report_id)'), 'desc');
    }

    $reportRegular = $query->get();

    return response()->json($reportRegular, 200);
}

    // 
    public function reportsSiteYear($idSite, $year){
        $reportes = DB::table('reports')
            ->where('site_id', $idSite)
            ->whereYear('created_at', $year)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reportes, 200);
    }
}