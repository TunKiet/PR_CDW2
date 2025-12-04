<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TableSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $types = ['Sảnh', 'VIP', 'Ngoài trời', 'Cửa sổ'];
        $statuses = ['available', 'occupied', 'reserved'];
        $notes = [
            'Gần cửa sổ',
            'Bàn rộng',
            'Bàn cạnh tường',
            'Không hút thuốc',
            'Ưu tiên gia đình',
            'View đẹp',
            'Yên tĩnh'
        ];

        $tables = [];

        for ($i = 1; $i <= 20; $i++) {
            $tables[] = [
                'table_name' => 'Bàn A' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'table_type' => $types[array_rand($types)],
                'capacity' => rand(2, 10),
                'note' => $notes[array_rand($notes)],
                'status' => $statuses[array_rand($statuses)],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('tables')->insert($tables);
    }
}
