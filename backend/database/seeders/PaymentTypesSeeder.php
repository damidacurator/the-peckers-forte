<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentTypesSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['name' => 'Registration Fee', 'code' => 'REG', 'category' => 'registration', 'wing' => 'both', 'is_recurring' => false, 'frequency' => 'one_time', 'default_amount' => 5000],
            ['name' => 'Monthly Dues', 'code' => 'MDU', 'category' => 'contribution', 'wing' => 'contribution', 'is_recurring' => true, 'frequency' => 'monthly', 'default_amount' => 2000],
            ['name' => 'Annual Dues', 'code' => 'ADU', 'category' => 'contribution', 'wing' => 'contribution', 'is_recurring' => true, 'frequency' => 'annually', 'default_amount' => 10000],
            ['name' => 'Special Levy', 'code' => 'SPL', 'category' => 'levy', 'wing' => 'both', 'is_recurring' => false, 'frequency' => 'one_time', 'default_amount' => null],
            ['name' => 'Building Fund', 'code' => 'BLD', 'category' => 'contribution', 'wing' => 'contribution', 'is_recurring' => false, 'frequency' => 'one_time', 'default_amount' => null],
            ['name' => 'Welfare Fund', 'code' => 'WLF', 'category' => 'contribution', 'wing' => 'contribution', 'is_recurring' => true, 'frequency' => 'monthly', 'default_amount' => 500],
            ['name' => 'Investment Capital', 'code' => 'INV', 'category' => 'investment', 'wing' => 'investment', 'is_recurring' => false, 'frequency' => 'one_time', 'default_amount' => null],
            ['name' => 'Dividend', 'code' => 'DIV', 'category' => 'investment', 'wing' => 'investment', 'is_recurring' => false, 'frequency' => 'annually', 'default_amount' => null],
            ['name' => 'Fine', 'code' => 'FIN', 'category' => 'fine', 'wing' => 'both', 'is_recurring' => false, 'frequency' => 'one_time', 'default_amount' => null],
            ['name' => 'Donation', 'code' => 'DON', 'category' => 'donation', 'wing' => 'both', 'is_recurring' => false, 'frequency' => 'one_time', 'default_amount' => null],
        ];

        foreach ($types as $type) {
            DB::table('payment_types')->updateOrInsert(['code' => $type['code']], $type);
        }
    }
}
