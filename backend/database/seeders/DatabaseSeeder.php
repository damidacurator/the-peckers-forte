<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            MembershipCategoriesSeeder::class,
            PaymentTypesSeeder::class,
            ChartOfAccountsSeeder::class,
            SettingsSeeder::class,
            ExecutivesSeeder::class,
        ]);
    }
}
