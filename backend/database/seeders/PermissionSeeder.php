<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // キャッシュをリセット
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 基本的な権限を作成
        $permissions = [
            'view',   // 閲覧権限
            'create', // 作成権限
            'edit',   // 編集権限
            'delete', // 削除権限
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ロールを作成し、権限を割り当て

        // Viewer ロール（閲覧のみ）
        $viewerRole = Role::firstOrCreate(['name' => 'viewer']);
        if (!$viewerRole->hasPermissionTo('view')) {
            $viewerRole->givePermissionTo('view');
        }

        // Manager ロール（閲覧と編集）
        $managerRole = Role::firstOrCreate(['name' => 'manager']);
        $managerPermissions = ['view', 'create', 'edit'];
        foreach ($managerPermissions as $permission) {
            if (!$managerRole->hasPermissionTo($permission)) {
                $managerRole->givePermissionTo($permission);
            }
        }

        // Admin ロール（全ての権限）
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $allPermissions = Permission::all();
        foreach ($allPermissions as $permission) {
            if (!$adminRole->hasPermissionTo($permission)) {
                $adminRole->givePermissionTo($permission);
            }
        }

        $this->command->info('権限とロールが正常に作成されました！');
        $this->command->info('Viewer: 閲覧のみ');
        $this->command->info('Manager: 閲覧、作成、編集');
        $this->command->info('Admin: 全ての権限');
    }
}
