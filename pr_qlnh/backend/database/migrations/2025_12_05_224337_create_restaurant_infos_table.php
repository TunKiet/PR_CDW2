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
        Schema::create('restaurant_infos', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable(); // Tên nhà hàng
            $table->string('logo')->nullable(); // Đường dẫn logo
            $table->string('email')->nullable(); // Email liên hệ
            $table->string('phone')->nullable(); // Số điện thoại
            $table->text('address')->nullable(); // Địa chỉ
            $table->text('description')->nullable(); // Mô tả
            $table->string('website')->nullable(); // Website
            $table->string('facebook')->nullable(); // Facebook
            $table->string('instagram')->nullable(); // Instagram
            $table->time('opening_time')->nullable(); // Giờ mở cửa
            $table->time('closing_time')->nullable(); // Giờ đóng cửa
            $table->string('currency', 10)->default('VND'); // Đơn vị tiền tệ
            $table->string('timezone', 50)->default('Asia/Ho_Chi_Minh'); // Múi giờ
            $table->boolean('is_active')->default(true); // Trạng thái hoạt động
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurant_infos');
    }
};
