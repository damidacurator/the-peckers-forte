<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExecutivesSeeder extends Seeder
{
    public function run(): void
    {
         = [
            [
                'name' => 'Akinola Idowu',
                'position' => 'President',
                'wing' => 'both',
                'photo' => '/images/executives/akinola-idowu-square.png',
                'bio' => 'President and visionary leader of THE PECKERS FORTE.',
                'is_current' => true,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Oyindamola Idowu',
                'position' => 'Lead Developer',
                'wing' => 'both',
                'photo' => '/images/executives/oyindamola-idowu-square.png',
                'bio' => 'Lead Developer driving technology implementation across THE PECKERS FORTE platforms.',
                'is_current' => true,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Oluwadamilare Idowu',
                'position' => 'Lead Developer',
                'wing' => 'both',
                'photo' => '/images/executives/oluwadamilare-idowu.png',
                'bio' => 'Lead Developer architecting and overseeing digital infrastructure and platform systems.',
                'is_current' => true,
                'sort_order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ( as ) {
            DB::table('executives')->updateOrInsert(
                ['name' => ['name']],
                
            );
        }
    }
}
