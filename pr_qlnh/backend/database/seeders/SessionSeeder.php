<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SessionSeeder extends Seeder
{
    const MAX_SESSIONS = 20;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= self::MAX_SESSIONS; $i++) {
            DB::table('sessions')->insert([
                'id' => Str::uuid()->toString(), // id session ngẫu nhiên
                'user_id' => rand(1, 10), // giả sử user_id từ 1 đến 10, nullable
                'ip_address' => '192.168.1.' . rand(1, 255),
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'payload' => serialize(['_token' => Str::random(40), 'data' => 'sample']), // payload thử
                'last_activity' => now()->timestamp,
            ]);
        }
    }
}
