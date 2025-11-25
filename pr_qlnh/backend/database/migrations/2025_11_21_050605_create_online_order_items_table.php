<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('online_order_items', function (Blueprint $table) {
        $table->id();

        // FK tới bảng online_orders
        $table->unsignedBigInteger('online_order_id');
        $table->foreign('online_order_id')
            ->references('id')
            ->on('online_orders')
            ->onDelete('cascade');

        // FK tới bảng menu_items (menu_item_id != id)
        $table->unsignedBigInteger('menu_item_id');
        $table->foreign('menu_item_id')
            ->references('menu_item_id')
            ->on('menu_items')
            ->onDelete('cascade');

        $table->integer('quantity');
        $table->integer('price');
        $table->string('note')->nullable();

        $table->timestamps();
    });
}


public function down()
{
    Schema::dropIfExists('online_order_items');
}

};
