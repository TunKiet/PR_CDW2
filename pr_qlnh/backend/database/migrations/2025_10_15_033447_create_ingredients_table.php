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
        Schema::create('ingredients', function (Blueprint $table) {
            $table->id('ingredient_id');
            $table->foreignId('category_ingredient_id')->constrained('category_ingredients', 'category_ingredient_id')->onDelete('cascade');
            $table->string('ingredient_name', 100);
            $table->decimal('price', 10, 2);
            $table->string('unit', 20);
            $table->decimal('total_price', 12, 2);
            $table->integer('stock_quantity');
            $table->integer('min_stock_level');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingredients');
    }
};
