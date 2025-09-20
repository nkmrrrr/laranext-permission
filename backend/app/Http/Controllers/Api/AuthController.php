<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * ログイン
     */
    public function login(Request $request)
    {
        \Illuminate\Support\Facades\Log::debug(json_encode($request, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        // ユーザーのロールと権限を取得
        $user->load('roles.permissions');

        return response()->json([
            'success' => true,
            'message' => 'ログインしました。',
            'data' => [
                'user' => $user,
                'token' => $token,
                'permissions' => $user->getAllPermissions()->pluck('name'),
                'roles' => $user->getRoleNames(),
            ]
        ]);
    }

    /**
     * ログアウト
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'ログアウトしました。'
        ]);
    }

    /**
     * 現在のユーザー情報を取得
     */
    public function me(Request $request)
    {
        $user = $request->user();
        $user->load('roles.permissions');

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'permissions' => $user->getAllPermissions()->pluck('name'),
                'roles' => $user->getRoleNames(),
            ]
        ]);
    }
}
