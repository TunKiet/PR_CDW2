<?php

namespace Database\Seeders;


use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call([
            UserSeeder::class,
            CategorySeeder::class,       
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
        // Dang ky them cac seeder khac o day
        // lenh: php artisan db:seed (chay toan bo cac seeder)
        // lenh: php artisan db:seed --class=RolePermissionsSeeder (chay tung seeder)
        $this->call(
            [RolePermissionsSeeder::class]
        );
    }
}
