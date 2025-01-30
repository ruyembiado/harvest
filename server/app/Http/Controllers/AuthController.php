<?php

namespace App\Http\Controllers;

use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Exception;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'phone' => 'required|string|max:15|unique:users,phone',
                'password' => 'required|string|min:8',
            ]);

            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'phone' => $validatedData['phone'],
                'password' => Hash::make($validatedData['password']),
            ]);

            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user,
            ], 200);
        } catch (Exception $ex) {
            return response()->json([
                'error' => $ex->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $user = auth()->user();

        return response()->json([
            'token' => $token,
            'user_id' => $user->id
        ], 200);
    }

    public function protectedRoute()
    {
        return response()->json(['message' => 'You have access to this route.']);
    }
}
