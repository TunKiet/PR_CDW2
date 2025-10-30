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
        Schema::create('cooking_recipes', function (Blueprint $table) {
            $table->id('recipe_id');
            $table->foreignId('menu_item_id')->constrained('menu_items', 'menu_item_id')->onDelete('cascade');
            $table->foreignId('ingredient_id')->constrained('ingredients', 'ingredient_id')->onDelete('cascade');
            $table->decimal('quantity_needed', 10, 2);
            $table->integer('available_servings')->nullable();
            $table->text('preparation_steps')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cooking_recipes');
    }
};
