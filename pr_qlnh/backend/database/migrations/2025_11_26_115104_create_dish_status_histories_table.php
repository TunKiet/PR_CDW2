<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dish_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_item_id')->constrained('menu_items', 'menu_item_id')->onDelete('cascade');
            $table->string('old_status', 50);
            $table->string('new_status', 50);
            $table->string('reason', 255)->nullable();
            $table->unsignedBigInteger('changed_by')->nullable(); // User ID
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dish_status_histories');
    }
};