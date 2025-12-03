<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
          DB::table('permissions')->insert([
            'name' => 'ADMIN',
            'description' => 'ADMIN',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
         DB::table('roles')->insert([
            'name' => 'CUSTOMER',
            'description' => 'KHÁCH HÀNG',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
         DB::table('roles')->insert([
            'name' => 'STAFF',
            'description' => 'NHÂN VIÊN',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
