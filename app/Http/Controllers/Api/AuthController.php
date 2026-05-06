<?php

namespace App\Http\Controllers\Api;
 use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
       $request->validate([
           'email' => 'required|email',
           'password' => 'required|string|min:6|max:24',
       ]);
       if (!Auth::attempt($request->only('email', 'password'))) {
           return response()->json([
               'message' => 'Invalid login details'
           ], 401);
       }
       /** @var \App\Models\User $user */
       $user = Auth::user();

       $token = $user->createToken('auth_token')->plainTextToken;
       return response()->json([
           'access_token' => $token,
           'token_type' => 'Bearer',
           'user' => $user
       ]);

    }
public function logout(Request $request)
{
    $request->user()->tokens()->delete();

    return response()->json([
        'message' => 'Logged out successfully'
    ]);
}
}
