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
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();

            // SỬA LỖI TẠI ĐÂY: Dùng unsignedBigInteger và tham chiếu đến 'user_id'
            $table->unsignedBigInteger('user_id'); // Khóa ngoại tham chiếu đến user_id
            
            // Cột cần thiết cho chức năng Sanctum (Được khôi phục)
            $table->string('tokenable_type');
            $table->unsignedBigInteger('tokenable_id');
            $table->index(['tokenable_type', 'tokenable_id']);

            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable(); // Thêm cột expires_at
            $table->timestamps();

            // Khắc phục lỗi: Tham chiếu đến cột 'user_id'
            $table->foreign('user_id')
                  ->references('user_id') // <-- ĐÃ SỬA CHỮA
                  ->on('users')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
    }
};
