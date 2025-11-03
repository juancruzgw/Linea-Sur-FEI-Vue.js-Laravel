<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class VerifyJwtToken
{
    public function handle($request, Closure $next)
    {
        $token = $request->bearerToken();
        if (!$token) {
            return response()->json(['error' => 'Token no provisto'], 401);
        }

        try {
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET', 'mi_clave_super_secreta'), 'HS256'));
            $request->auth = $decoded;
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token inválido o expirado'], 401);
        }

        return $next($request);
    }
}

