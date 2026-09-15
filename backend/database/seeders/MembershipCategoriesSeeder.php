<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MembershipCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Regular',
                'slug' => 'regular',
                'registration_fee' => 5000.00,
                'annual_dues' => 10000.00,
                'monthly_contribution' => 2000.00,
                'description' => 'Regular membership category',
                'wing' => 'both',
            ],
            [
                'name' => 'Associate',
                'slug' => 'associate',
                'registration_fee' => 3000.00,
                'annual_dues' => 5000.00,
                'monthly_contribution' => 1000.00,
                'description' => 'Associate membership category',
                'wing' => 'both',
            ],
            [
                'name' => 'Life',
                'slug' => 'life',
                'registration_fee' => 50000.00,
                'annual_dues' => 0.00,
                'monthly_contribution' => 0.00,
                'description' => 'Life membership category',
                'wing' => 'both',
            ],
            [
                'name' => 'Honorary',
                'slug' => 'honorary',
                'registration_fee' => 0.00,
                'annual_dues' => 0.00,
                'monthly_contribution' => 0.00,
                'description' => 'Honorary membership category',
                'wing' => 'both',
            ]
        ];

        foreach ($categories as $cat) {
            DB::table('membership_categories')->updateOrInsert(
                ['slug' => $cat['slug']],
                $cat
            );
        }
    }
}
