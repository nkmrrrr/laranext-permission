<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->error('ユーザーが存在しません。先にUserRoleSeederを実行してください。');
            return;
        }

        $posts = [
            [
                'title' => 'Laravel Permission システムについて',
                'content' => 'Spatie Laravel Permissionパッケージを使用したロールベースアクセス制御システムの実装方法について解説します。このシステムにより、ユーザーの権限を細かく制御できるようになります。',
                'is_published' => true,
            ],
            [
                'title' => 'PHPの最新機能紹介',
                'content' => 'PHP 8.3の新機能について詳しく説明します。型宣言の改善、パフォーマンスの向上、新しい標準ライブラリ機能などを取り上げています。',
                'is_published' => true,
            ],
            [
                'title' => 'データベース設計のベストプラクティス',
                'content' => '効率的なデータベース設計のための基本原則と実践的なテクニックを紹介します。正規化、インデックス、パフォーマンス最適化について説明します。',
                'is_published' => false,
            ],
            [
                'title' => 'フロントエンド開発トレンド2025',
                'content' => '2025年のフロントエンド開発において注目すべき技術トレンドとフレームワークについて解説します。React、Vue、Next.jsの最新動向を含みます。',
                'is_published' => true,
            ],
            [
                'title' => 'セキュリティ対策の重要性',
                'content' => 'Webアプリケーション開発におけるセキュリティ対策の基本から応用まで、XSS、CSRF、SQLインジェクション対策について詳しく説明します。',
                'is_published' => true,
            ],
        ];

        foreach ($posts as $postData) {
            Post::create([
                'title' => $postData['title'],
                'content' => $postData['content'],
                'user_id' => $users->random()->id, // ランダムなユーザーを割り当て
                'is_published' => $postData['is_published'],
            ]);
        }

        $this->command->info('投稿のサンプルデータが作成されました！');
    }
}
