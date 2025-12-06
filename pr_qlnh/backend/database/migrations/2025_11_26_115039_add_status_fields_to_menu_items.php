<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            // Thêm cột để quản lý trạng thái nâng cao
            $table->integer('stock_quantity')->default(0)->after('status'); // Số lượng tồn kho
            $table->string('unavailable_reason', 255)->nullable()->after('stock_quantity'); // Lý do hết hàng
            $table->timestamp('unavailable_until')->nullable()->after('unavailable_reason'); // Dự kiến có hàng lúc
            $table->unsignedBigInteger('updated_by')->nullable()->after('unavailable_until'); // Người cập nhật
        });
    }

    public function down(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropColumn(['stock_quantity', 'unavailable_reason', 'unavailable_until', 'updated_by']);
        });
    }
};