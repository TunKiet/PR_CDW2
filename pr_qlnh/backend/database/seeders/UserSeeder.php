<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    const MAX_RECORDS = 1000;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= self::MAX_RECORDS; $i++) {
            DB::table('users')->insert([
                'username' => 'user' . $i,
                'email' => 'user' . $i . '@example.com',
                'password' => Hash::make('123456'),
                'phone' => '090' . str_pad($i, 7, '0', STR_PAD_LEFT),
                'role' => 'user',
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // ✅ Thêm 1 tài khoản admin riêng biệt
        DB::table('users')->insert([
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin123'),
            'phone' => '0999999999',
            'role' => 'admin',
            'is_active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
