<?php

namespace App\Http\Controllers;

use App\Models\BreakageInstrument;
use Illuminate\Http\Request;


class breakageInstrumentController extends Controller
{
    public function index()
    {
        $breakageInstrument = BreakageInstrument::all();

        return response()->json($breakageInstrument, 200);
    }
    
    //trae todos los reportes con el id del usuario
    public function reportsUser($idUser){
        $breakageInstrument = BreakageInstrument::with('report')
        ->whereHas('report', function ($query) use ($idUser) {
            $query->where('user_id', $idUser);
        })
        ->get();
    
        return response()->json($breakageInstrument, 200);
    }
    
    //obtenes todos los reportes con el id del sitio
    public function reportsSite($idSite){
        $breakageInstrument = BreakageInstrument::with('report')
        ->whereHas('report', function ($query) use ($idSite) {
            $query->where('site_id', $idSite);
        })
        ->get(); 
    
        return response()->json($breakageInstrument, 200);
    }
}

