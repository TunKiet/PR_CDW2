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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id('review_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->foreignId('menu_item_id')->constrained('menu_items', 'menu_item_id')->onDelete('cascade');
            $table->integer('rating')->nullable()->check('rating BETWEEN 1 AND 5');
            $table->text('comment')->nullable();
            $table->string('image_url', 255)->nullable();
            $table->integer('like')->nullable();
            $table->integer('dislike')->nullable();
            $table->string('status', 50)->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
