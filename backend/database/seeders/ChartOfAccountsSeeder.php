<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChartOfAccountsSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            // Assets
            ['code' => '1000', 'name' => 'Assets', 'type' => 'asset', 'parent_code' => null],
            ['code' => '1100', 'name' => 'Cash', 'type' => 'asset', 'parent_code' => '1000'],
            ['code' => '1200', 'name' => 'Bank', 'type' => 'asset', 'parent_code' => '1000'],
            ['code' => '1300', 'name' => 'Receivables', 'type' => 'asset', 'parent_code' => '1000'],
            
            // Liabilities
            ['code' => '2000', 'name' => 'Liabilities', 'type' => 'liability', 'parent_code' => null],
            ['code' => '2100', 'name' => 'Payables', 'type' => 'liability', 'parent_code' => '2000'],
            ['code' => '2200', 'name' => 'Member Savings', 'type' => 'liability', 'parent_code' => '2000'],

            // Equity
            ['code' => '3000', 'name' => 'Equity', 'type' => 'equity', 'parent_code' => null],
            ['code' => '3100', 'name' => 'Share Capital', 'type' => 'equity', 'parent_code' => '3000'],
            ['code' => '3200', 'name' => 'Retained Earnings', 'type' => 'equity', 'parent_code' => '3000'],

            // Income
            ['code' => '4000', 'name' => 'Income', 'type' => 'income', 'parent_code' => null],
            ['code' => '4100', 'name' => 'Dues & Contributions', 'type' => 'income', 'parent_code' => '4000'],
            ['code' => '4200', 'name' => 'Levies', 'type' => 'income', 'parent_code' => '4000'],
            ['code' => '4300', 'name' => 'Interest Income', 'type' => 'income', 'parent_code' => '4000'],

            // Expenses
            ['code' => '5000', 'name' => 'Expenses', 'type' => 'expense', 'parent_code' => null],
            ['code' => '5100', 'name' => 'Admin Expenses', 'type' => 'expense', 'parent_code' => '5000'],
            ['code' => '5200', 'name' => 'Operations', 'type' => 'expense', 'parent_code' => '5000'],
        ];

        // First pass: insert all without parents
        foreach ($accounts as $acc) {
            DB::table('chart_of_accounts')->updateOrInsert(
                ['code' => $acc['code']],
                ['name' => $acc['name'], 'type' => $acc['type']]
            );
        }

        // Second pass: set parent_id
        foreach ($accounts as $acc) {
            if ($acc['parent_code']) {
                $parentId = DB::table('chart_of_accounts')->where('code', $acc['parent_code'])->value('id');
                DB::table('chart_of_accounts')->where('code', $acc['code'])->update(['parent_id' => $parentId]);
            }
        }
    }
}
