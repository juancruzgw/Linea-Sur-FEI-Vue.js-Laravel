<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Models\Zona;
use App\Models\Site;
use App\Models\User;

use Firebase\JWT\JWT;

class UserController extends Controller
{
    public function register(Request $request)
    {
        // Debug: ver qué datos están llegando
        \Log::info('Datos recibidos en register:', $request->all());

        // Validación - solo IDs y datos del usuario
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'password' => 'required|string|min:6',
            'rol' => 'required|string|max:50',
            'zona_id' => 'required|exists:zonas,id',
            'site_id' => 'required|exists:sites,id'
        ]);

        if ($validator->fails()) {
            \Log::error('Errores de validación:', $validator->errors()->toArray());
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // Verificar que el site pertenezca a la zona
        $site = Site::find($request->site_id);
        if ($site->zona_id != $request->zona_id) {
            return response()->json([
                'error' => 'El sitio no pertenece a la zona seleccionada'
            ], 422);
        }

        // Crear el usuario
        $user = User::create([
            'name' => $request->name,
            'password' => $request->password,
            'rol' => $request->rol,
            'zona_id' => $request->zona_id,
            'site_id' => $request->site_id
        ]);

        $user->load(['site', 'zona']);

        \Log::info('Usuario creado ', $user->toArray());

        return response()->json([
            'message' => 'Usuario registrado correctamente',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'password' => 'required'
        ]);

        $user = User::where('password', $request->password)->first();

        if (!$user) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        // Obtener instrumentos únicos por nombreViewOptionMenu
        $instruments = $user->instruments()
            ->get()
            ->unique('name') // elimina repetidos por campo 'name'
            ->values(); // reindexa el array

        $payload = [
            'sub' => $user->id,
            'name' => $user->name,
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24) // 24 horas
        ];

        // Clave secreta
        $secret = env('JWT_SECRET', 'secret_key');

        $token = JWT::encode($payload, $secret, 'HS256');

        return response()->json([
            'token' => $token,
            'user' => $user,
            'instruments' => $instruments
        ], 200);
    }

    public function index()
    {
        $start = microtime(true);

        // Cargar usuarios con sus relaciones
        $users = User::with(['site', 'zona'])->get();
        
        $time_elapsed_secs = microtime(true) - $start;

        \Log::info('Usuarios cargados:', ['count' => $users->count(), 'time' => $time_elapsed_secs]);

        return response()->json([
            'users' => $users,
            'time_elapsed_secs' => $time_elapsed_secs
        ], 200);
    }

   public function modifyUserById(Request $request, $id)
    {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'rol' => 'nullable|string',
        'password' => 'nullable|string|min:6',
        'site_id' => 'nullable|exists:sites,id',
        'zona_id' => 'nullable|exists:zonas,id',
    ]);

    $user = User::findOrFail($id);

    $user->name = $validated['name'];
    
    if (!empty($validated['rol'])) {
        $user->rol = $validated['rol'];
    }
    
    if (!empty($validated['password'])) {
        $user->password = $validated['password'];
    }
    // bug arreglado, no modifica mas la zona, sino que asocia
    if (isset($validated['site_id'])) {
        $user->site_id = $validated['site_id'];
    }
    if (isset($validated['zona_id'])) {
        $user->zona_id = $validated['zona_id'];
    }

    $user->save();

    return response()->json([
        'message' => 'Usuario actualizado correctamente',
        'user' => $user->load(['site', 'zona']),
    ], 200);
}

    public function searchWord(Request $request)
    {
        $word = $request->query('word');

        if (empty($word)) {
            return $this->index();
        }

        $users = User::with(['site', 'zona'])
            ->where('name', 'like', "%{$word}%")
            ->orWhereHas('zona', function ($query) use ($word) {
                $query->where('locality', 'like', "%{$word}%");
            })
            ->get();

        if ($users->isEmpty()) {
            return response()->json([
                'message' => 'Usuario no encontrado',
                'users' => []
            ], 404);
        }

        return response()->json([
            'message' => 'Usuarios encontrados correctamente',
            'users' => $users
        ]);
    }
    public function getZonas()
    {
        $zonas = Zona::all();
        return response()->json($zonas);
    }

    public function getSites()
    {
        $sites = Site::with(['zona', 'precipitation'])->get();
        return response()->json($sites);
    }
    // elimina al ususario 
    public function deleteUser($id)
{
    try {
        $user = User::findOrFail($id);
        $userName = $user->name;
        
        // Eliminar el usuario
        $user->delete();
        
        \Log::info('Usuario eliminado:', ['id' => $id, 'name' => $userName]);
        
        return response()->json([
            'message' => 'Usuario eliminado correctamente',
            'user' => $userName
        ], 200);
        
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        \Log::error('Usuario no encontrado:', ['id' => $id]);
        
        return response()->json([
            'error' => 'Usuario no encontrado'
        ], 404);
        
    } catch (\Exception $e) {
        \Log::error('Error al eliminar usuario:', [
            'id' => $id,
            'error' => $e->getMessage()
        ]);
        
        return response()->json([
            'error' => 'Error al eliminar el usuario',
            'message' => $e->getMessage()
        ], 500);
    }
}
}