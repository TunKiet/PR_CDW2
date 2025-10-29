<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolePermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Du lieu mau
        $data = [
            ['role_id' => 1, 'permission_id' => 1],
            ['role_id' => 1, 'permission_id' => 2],
            ['role_id' => 2, 'permission_id' => 1],
            ['role_id' => 2, 'permission_id' => 3],
            ['role_id' => 3, 'permission_id' => 2],
        ];
        DB::table('role_permissions')->insert($data);
    }
}
