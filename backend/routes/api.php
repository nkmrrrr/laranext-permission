<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ヘルスチェックエンドポイント
Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is working correctly',
        'timestamp' => now()->toISOString()
    ]);
});

// 認証エンドポイント
Route::post('/login', [AuthController::class, 'login']);

// 認証が必要なエンドポイント
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // 投稿関連のエンドポイント
    Route::apiResource('posts', PostController::class);
});
