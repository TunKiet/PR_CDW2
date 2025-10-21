<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //User
        $data =[
            ['username' => 'admin', 'email' => 'admin@gmail.com', 'password' => md5('admin123'), 'full_name' => 'Administrator', 'phone' => '0932455555', 'status' => 1, 'created_at' => now(),
            'updated_at' => now()],
        ];
        DB::table('users')->insert($data);
    }
}
