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
        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->id('po_item_id');
            $table->foreignId('purchase_order_id')->constrained('purchase_orders', 'purchase_order_id')->onDelete('cascade');
            $table->foreignId('ingredient_id')->constrained('ingredients', 'ingredient_id')->onDelete('cascade');
            $table->decimal('quantity', 12, 2);
            $table->decimal('price', 12, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_order_items');
    }
};
