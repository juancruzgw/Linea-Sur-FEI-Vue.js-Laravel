<?php

namespace App\Http\Controllers;

use App\Models\InstrumentUser;
use Illuminate\Http\Request;

class InstrumentUserController extends Controller
{
    public function index()
    {
        $InstrumentUser = InstrumentUser::with("instrument");

        return response()->json($InstrumentUser, 200);
    }

    public function search($id)
    {
        $instruments = InstrumentUser::with('instrument')
            ->where('user_id', $id)
            ->get()
            ->map(function($item) {
                return $item->instrument;
            });

        return response()->json([
            'instruments' => $instruments
        ], 200);
    }
}
