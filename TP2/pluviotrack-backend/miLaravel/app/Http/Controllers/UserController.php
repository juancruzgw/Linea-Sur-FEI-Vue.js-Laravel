<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function login(Request $request)
    {
        // Validar campos
        $validated = $request->validate([
            'email' => 'required',
            'password' => 'required',
        ]);

        // Buscar usuario
        $user = User::where('email', $validated['email'])->first();
        
        if (!$user) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], 401);
        }


        return response()->json([
            'message' => 'Login exitoso',
            'user' => $user,

        ], 200);
    }
}