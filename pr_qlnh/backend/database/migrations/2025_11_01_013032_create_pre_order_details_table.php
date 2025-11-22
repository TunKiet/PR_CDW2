<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pre_order_details', function (Blueprint $table) {
            $table->id('pre_order_detail_id');
            $table->unsignedBigInteger('pre_order_id');
            $table->unsignedBigInteger('menu_item_id');
            $table->integer('quantity')->default(1);
            $table->decimal('price', 10, 2)->default(0);
            $table->timestamps();

            // 🔗 Khóa ngoại liên kết
            $table->foreign('pre_order_id')
                  ->references('pre_order_id')
                  ->on('pre_orders')
                  ->onDelete('cascade');

            $table->foreign('menu_item_id')
                  ->references('menu_item_id')
                  ->on('menu_items')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pre_order_details');
    }
};
