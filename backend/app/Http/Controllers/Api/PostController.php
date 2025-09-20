<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('permission:view')->only(['index', 'show']);
        $this->middleware('permission:create')->only(['store']);
        $this->middleware('permission:edit')->only(['update']);
        $this->middleware('permission:delete')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with('user:id,name,email')->latest()->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $posts,
            'user_permissions' => [
                'can_create' => Auth::user()->can('create'),
                'can_edit' => Auth::user()->can('edit'),
                'can_delete' => Auth::user()->can('delete'),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_published' => 'boolean',
        ]);

        $post = Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'user_id' => Auth::id(),
            'is_published' => $request->boolean('is_published', false),
        ]);

        $post->load('user:id,name,email');

        return response()->json([
            'success' => true,
            'message' => '投稿が作成されました。',
            'data' => $post
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        $post->load('user:id,name,email');

        $canEdit = Auth::user()->hasRole('admin') || $post->user_id === Auth::id();
        $canDelete = Auth::user()->hasRole('admin') || $post->user_id === Auth::id();

        return response()->json([
            'success' => true,
            'data' => $post,
            'permissions' => [
                'can_edit' => $canEdit && Auth::user()->can('edit'),
                'can_delete' => $canDelete && Auth::user()->can('delete'),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        // 管理者または投稿者本人のみ更新可能
        if (!Auth::user()->hasRole('admin') && $post->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'この投稿を更新する権限がありません。'
            ], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_published' => 'boolean',
        ]);

        $post->update([
            'title' => $request->title,
            'content' => $request->content,
            'is_published' => $request->boolean('is_published', false),
        ]);

        $post->load('user:id,name,email');

        return response()->json([
            'success' => true,
            'message' => '投稿が更新されました。',
            'data' => $post
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        // 管理者または投稿者本人のみ削除可能
        if (!Auth::user()->hasRole('admin') && $post->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'この投稿を削除する権限がありません。'
            ], 403);
        }

        $post->delete();

        return response()->json([
            'success' => true,
            'message' => '投稿が削除されました。'
        ]);
    }
}
