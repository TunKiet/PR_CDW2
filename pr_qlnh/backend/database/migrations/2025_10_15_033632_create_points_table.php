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
    Schema::create('points', function (Blueprint $table) {
        $table->bigIncrements('point_id');
        $table->unsignedBigInteger('customer_id')->nullable();
        $table->unsignedBigInteger('order_id')->nullable(); // chỉ tạo cột, KHÔNG tạo FK
        $table->integer('points')->default(0);
        $table->timestamps();
    });



    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('points');
    }
};
