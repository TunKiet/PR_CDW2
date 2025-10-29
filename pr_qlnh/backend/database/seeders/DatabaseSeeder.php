<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB; // ✅ thêm dòng này

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $this->call([
            UserSeeder::class,
            CategorySeeder::class,       
            CategoryIngredientSeeder::class,       
            MenuItemSeeder::class,
            IngredientSeeder::class,
            TableSeeder::class,  
            ReservationSeeder::class,
            PurchaseOrderSeeder::class,
            PurchaseOrderItemSeeder::class,
            OrderSeeder::class,
            OrderDetailSeeder::class,
            PointSeeder::class,
            MessageSeeder::class,
            CookingRecipeSeeder::class,
            ReviewSeeder::class,
            ReviewReplySeeder::class,
            SessionSeeder::class,
        ]);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
