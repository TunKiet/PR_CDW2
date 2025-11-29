<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //thêm 3 roles
       DB::table('roles')->insert([
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
