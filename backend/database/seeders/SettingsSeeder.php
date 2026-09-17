<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'org_name', 'value' => 'THE PECKERS FORTE', 'group' => 'general', 'type' => 'string'],
            ['key' => 'tagline', 'value' => 'Two Wings One Vision', 'group' => 'general', 'type' => 'string'],
            ['key' => 'currency', 'value' => 'NGN', 'group' => 'financial', 'type' => 'string'],
            ['key' => 'membership_id_prefix', 'value' => 'TPF', 'group' => 'general', 'type' => 'string'],
            ['key' => 'contact_email', 'value' => 'admin@thepeckersfortelp.com', 'group' => 'general', 'type' => 'string'],
            ['key' => 'whatsapp_phone', 'value' => '+2348037221344', 'group' => 'general', 'type' => 'string'],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->updateOrInsert(['key' => $setting['key']], $setting);
        }
    }
}
