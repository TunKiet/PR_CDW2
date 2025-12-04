<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Doctrine\DBAL\Types\Type; // Cần thiết cho lệnh change()

return new class extends Migration
{
    public function up(): void
    {
        // Cần đảm bảo package doctrine/dbal được cài đặt để dùng $table->text('description')->change();
        // Nếu bạn chưa cài, chạy: composer require doctrine/dbal

        Schema::table('menu_items', function (Blueprint $table) {
            // Thay đổi kiểu dữ liệu của cột 'description' thành TEXT
            $table->text('description')->change(); 
        });
    }

    public function down(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            // Hoàn tác: Quay về string(255) (nếu muốn)
            $table->mediumText('description')->change();
        });
    }
};