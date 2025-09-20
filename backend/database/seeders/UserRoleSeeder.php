<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // テストユーザーを作成してロールを割り当て

        // Admin ユーザー
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin User', 'password' => bcrypt('password')]
        );
        $adminUser->assignRole('admin');

        // Manager ユーザー
        $managerUser = User::firstOrCreate(
            ['email' => 'manager@example.com'],
            ['name' => 'Manager User', 'password' => bcrypt('password')]
        );
        $managerUser->assignRole('manager');

        // Viewer ユーザー
        $viewerUser = User::firstOrCreate(
            ['email' => 'viewer@example.com'],
            ['name' => 'Viewer User', 'password' => bcrypt('password')]
        );
        $viewerUser->assignRole('viewer');

        $this->command->info('テストユーザーが作成され、ロールが割り当てられました！');
        $this->command->info('Admin: admin@example.com (password: password)');
        $this->command->info('Manager: manager@example.com (password: password)');
        $this->command->info('Viewer: viewer@example.com (password: password)');
    }
}
