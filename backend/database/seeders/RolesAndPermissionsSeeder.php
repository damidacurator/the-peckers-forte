<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        $permissions = [
            'manage users', 'manage members', 'manage payments', 
            'manage settings', 'manage content', 'view reports'
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // create roles and assign created permissions
        $roleSuperAdmin = Role::create(['name' => 'Super Admin']);
        $roleSuperAdmin->givePermissionTo(Permission::all());

        $rolePresident = Role::create(['name' => 'President']);
        $rolePresident->givePermissionTo(['manage members', 'view reports']);

        $roleSecretary = Role::create(['name' => 'Secretary']);
        $roleSecretary->givePermissionTo(['manage members', 'manage content', 'view reports']);

        $roleTreasurer = Role::create(['name' => 'Treasurer']);
        $roleTreasurer->givePermissionTo(['manage payments', 'view reports']);

        Role::create(['name' => 'Financial Secretary'])->givePermissionTo(['manage payments', 'view reports']);
        Role::create(['name' => 'Auditor'])->givePermissionTo(['view reports']);
        Role::create(['name' => 'Executive Member']);
        Role::create(['name' => 'Ordinary Member']);
        Role::create(['name' => 'Guest']);

        $user = User::firstOrCreate(
            ['email' => 'admin@thepeckersfortelp.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
            ]
        );
        if (!$user->hasRole('Super Admin')) {
            $user->assignRole('Super Admin');
        }
    }
}
