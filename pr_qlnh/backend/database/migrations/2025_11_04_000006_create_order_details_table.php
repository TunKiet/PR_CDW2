<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('order_details', function (Blueprint $table) {
    $table->bigIncrements('order_detail_id');
    
    $table->unsignedBigInteger('order_id');
    $table->unsignedBigInteger('menu_item_id');
    
    $table->integer('quantity');
    $table->decimal('price', 10, 2);
    
    $table->timestamps();

    $table->foreign('order_id')
        ->references('order_id')->on('orders')
        ->cascadeOnDelete();

    $table->foreign('menu_item_id')
        ->references('menu_item_id')->on('menu_items')
        ->cascadeOnDelete();
});

    }
    public function down(): void {
        Schema::dropIfExists('order_details');
    }
};
