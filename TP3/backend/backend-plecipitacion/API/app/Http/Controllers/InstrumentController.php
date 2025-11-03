<?php

namespace App\Http\Controllers;

use App\Models\Instrument;
use Illuminate\Http\Request;

class InstrumentController extends Controller
{
    public function index()
    {
        $instrument = Instrument::with("precipitation:id,type")->get();

        return response()->json($instrument, 200);
    }
}
