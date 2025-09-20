"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Post, postsApi } from "@/lib/api";
import Link from "next/link";

export default function PostsPage() {
  const { user, hasPermission, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userPermissions, setUserPermissions] = useState({
    can_create: false,
    can_edit: false,
    can_delete: false,
  });

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsApi.getAll();
      setPosts(response.data.data.data);
      if (response.data.user_permissions) {
        setUserPermissions(response.data.user_permissions);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "投稿の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm("この投稿を削除しますか？")) return;

    try {
      await postsApi.delete(postId);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err: any) {
      alert(err.response?.data?.message || "削除に失敗しました");
    }
  };

  const canEditPost = (post: Post) => {
    return (
      hasPermission("edit") &&
      (user?.id === post.user_id || hasPermission("delete"))
    );
  };

  const canDeletePost = (post: Post) => {
    return (
      hasPermission("delete") &&
      (user?.id === post.user_id || hasPermission("delete"))
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">ログインが必要です</h1>
          <Link
            href="/login"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            ログイン
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">投稿管理システム</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user.name} ({user.roles?.join(", ")})
              </span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">投稿一覧</h2>
            {userPermissions.can_create && (
              <Link
                href="/posts/create"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                新規投稿
              </Link>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2">読み込み中...</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <li key={post.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {post.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            作成者: {post.user?.name} | 作成日:{" "}
                            {new Date(post.created_at).toLocaleDateString(
                              "ja-JP"
                            )}{" "}
                            |
                            {post.is_published ? (
                              <span className="text-green-600 font-medium">
                                {" "}
                                公開中
                              </span>
                            ) : (
                              <span className="text-gray-600"> 下書き</span>
                            )}
                          </p>
                          <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                            {post.content.substring(0, 150)}
                            {post.content.length > 150 ? "..." : ""}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex space-x-2">
                          <Link
                            href={`/posts/${post.id}`}
                            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                          >
                            詳細
                          </Link>
                          {canEditPost(post) && (
                            <Link
                              href={`/posts/${post.id}/edit`}
                              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                            >
                              編集
                            </Link>
                          )}
                          {canDeletePost(post) && (
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                            >
                              削除
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {posts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  投稿がありません
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
