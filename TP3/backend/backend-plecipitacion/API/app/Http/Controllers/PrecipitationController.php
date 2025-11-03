<?php

namespace App\Http\Controllers;

use App\Models\Precipitation;
use Illuminate\Http\Request;

class PrecipitationController extends Controller
{
    public function index()
    {
        $report = Precipitation::all(); 

        return response()->json($report, 200);
    }
}
