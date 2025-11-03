<?php

namespace App\Http\Controllers;

use App\Models\UnitedMeasure;
use Illuminate\Http\Request;

class UnitedMeasureController extends Controller
{
    public function index()
    {
        $unitedMeasure = UnitedMeasure::all();

        return response()->json($unitedMeasure, 200);
    }
}
