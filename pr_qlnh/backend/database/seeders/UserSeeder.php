<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Chạy quá trình seed database.
     *
     * @return void
     */
    public function run()
    {
        // 1. VÔ HIỆU HÓA kiểm tra khóa ngoại để cho phép TRUNCATE
        // Điều này đảm bảo quá trình Seeding không bị ảnh hưởng bởi khóa ngoại khác
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Xóa dữ liệu cũ trong bảng 'users'
        DB::table('users')->truncate(); 

        $now = Carbon::now();

        // Thêm dữ liệu người dùng với các cột tùy chỉnh của bạn
        $users = [
            [
                // Cột 'user_id' là khóa chính, nếu nó là auto-increment thì không cần chèn.
                // Nếu nó là UUID hoặc tự chèn, bỏ qua. Ở đây giả định nó là auto-increment.
                'username' => 'admin',
                'email' => 'admin@restaurant.com',
                'password' => Hash::make('password'), // Luôn hash password
                'phone' => '0901234567',
                'role' => 'admin', // Vai trò quản trị
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'username' => 'employee',
                'email' => 'employee@restaurant.com',
                'password' => Hash::make('password'),
                'phone' => '0907654321',
                'role' => 'employee', // Vai trò nhân viên
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'username' => 'customer',
                'email' => 'customer@guest.com',
                'password' => Hash::make('password'),
                'phone' => '0909888999',
                'role' => 'customer', // Vai trò khách hàng
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        // Chèn dữ liệu vào bảng 'users'
        DB::table('users')->insert($users);

        // 2. KÍCH HOẠT lại kiểm tra khóa ngoại
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
