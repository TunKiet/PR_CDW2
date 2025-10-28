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
    $table->string('ingredient_name', 150);
    $table->string('unit', 50);
    $table->decimal('price', 10, 2)->default(0);
    // ❌ Xoá dòng này nếu có:
    // $table->decimal('total_price', 10, 2);
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
