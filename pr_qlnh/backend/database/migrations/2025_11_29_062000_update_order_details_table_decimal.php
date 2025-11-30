<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_details', function (Blueprint $table) {
            // 🔥 Cập nhật price từ DECIMAL(10,2) → DECIMAL(12,2)
            $table->decimal('price', 12, 2)->change();
        });
    }

    public function down(): void
    {
        Schema::table('order_details', function (Blueprint $table) {
            // Rollback về DECIMAL(10,2)
            $table->decimal('price', 12, 2)->change();
        });
    }
};
