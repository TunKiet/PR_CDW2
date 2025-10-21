<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('password_resets', function (Blueprint $table) {
            // Đổi tên cột token -> otp, và rút ngắn độ dài xuống 6 ký tự
            $table->renameColumn('token', 'otp');
        });

        Schema::table('password_resets', function (Blueprint $table) {
            // Chỉnh lại kiểu dữ liệu của cột otp
            $table->string('otp', 6)->change();
        });
    }

    public function down(): void
    {
        Schema::table('password_resets', function (Blueprint $table) {
            // Khôi phục lại tên cột nếu rollback
            $table->renameColumn('otp', 'token');
        });

        Schema::table('password_resets', function (Blueprint $table) {
            $table->string('token', 255)->change();
        });
    }
};

