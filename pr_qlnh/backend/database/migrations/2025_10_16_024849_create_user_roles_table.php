<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_roles', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id'); // Nguoi dung | ham unsigned co nghia la chi nhan gia tri tuong duong >= 0
            $table->unsignedBigInteger('role_id'); // Vai tro
            
            // Primary key
            $table->primary(['user_id', 'role_id']);
            
            $table->timestamps();

            // SỬA LỖI: Cập nhật tham chiếu Khóa ngoại từ 'id' sang 'user_id'
            $table->foreign('user_id')
                  ->references('user_id') // <-- ĐÃ SỬA TỪ 'id'
                  ->on('users')
                  ->onDelete('cascade');
                  
            // Giả định bảng 'roles' dùng 'id' mặc định
            $table->foreign('role_id')
                  ->references('id')
                  ->on('roles')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_roles');
    }
};
