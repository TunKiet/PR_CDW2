<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    const MAX_RECORDS = 100;

    /**
     * Chạy quá trình seed database.
     *
     * @return void
     */
    public function run(): void
    {
        // ✅ Thêm 1 tài khoản admin riêng biệt
        DB::table('users')->insert([
            'full_name' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin123'),
            'phone' => '0999999999',
            'role' => 'admin',
            'status' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
