<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('permission:view')->only(['index', 'show']);
        $this->middleware('permission:create')->only(['create', 'store']);
        $this->middleware('permission:edit')->only(['edit', 'update']);
        $this->middleware('permission:delete')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with('user')->latest()->paginate(10);
        return view('posts.index', compact('posts'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('posts.create');
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

        Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'user_id' => Auth::id(),
            'is_published' => $request->has('is_published'),
        ]);

        return redirect()->route('posts.index')->with('success', '投稿が作成されました。');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        return view('posts.show', compact('post'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        // 管理者または投稿者本人のみ編集可能
        if (!Auth::user()->hasRole('admin') && $post->user_id !== Auth::id()) {
            abort(403, 'この投稿を編集する権限がありません。');
        }

        return view('posts.edit', compact('post'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        // 管理者または投稿者本人のみ更新可能
        if (!Auth::user()->hasRole('admin') && $post->user_id !== Auth::id()) {
            abort(403, 'この投稿を更新する権限がありません。');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_published' => 'boolean',
        ]);

        $post->update([
            'title' => $request->title,
            'content' => $request->content,
            'is_published' => $request->has('is_published'),
        ]);

        return redirect()->route('posts.index')->with('success', '投稿が更新されました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        // 管理者または投稿者本人のみ削除可能
        if (!Auth::user()->hasRole('admin') && $post->user_id !== Auth::id()) {
            abort(403, 'この投稿を削除する権限がありません。');
        }

        $post->delete();

        return redirect()->route('posts.index')->with('success', '投稿が削除されました。');
    }
}
