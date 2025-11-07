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
        Schema::create('tables', function (Blueprint $table) {
    $table->bigIncrements('table_id');
    $table->string('table_name');
    $table->enum('table_type', ['Normal', 'VIP'])->default('Normal');
    $table->integer('capacity')->default(4);
    $table->string('note')->nullable();
    $table->enum('status', ['available', 'reserved', 'occupied'])->default('available');
    $table->timestamps();
});




    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tables');
    }
};
