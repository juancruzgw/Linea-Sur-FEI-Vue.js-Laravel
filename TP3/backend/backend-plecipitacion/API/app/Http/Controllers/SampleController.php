<?php

namespace App\Http\Controllers;

use App\Models\Sample;
use Illuminate\Http\Request;

class SampleController extends Controller
{
    
    public function index()
    {
        $sample = Sample::all(); // trae todos

        return response()->json($sample, 200);
    }
}
