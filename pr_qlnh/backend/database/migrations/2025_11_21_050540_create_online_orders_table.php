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
    Schema::create('online_orders', function (Blueprint $table) {
        $table->id();
        $table->string('customer_name');
        $table->string('phone');
        $table->string('email')->nullable();

        $table->string('province')->nullable();
        $table->string('district')->nullable();
        $table->string('ward')->nullable();
        $table->string('address_detail')->nullable();

        $table->string('payment_method');
        $table->integer('ship_fee')->default(0);
        $table->integer('discount')->default(0);
        $table->integer('total');

        $table->text('notes')->nullable();
        $table->enum('status', ['pending','confirmed','delivered','cancelled'])->default('pending');

        $table->timestamps();
    });
}


public function down()
{
    Schema::dropIfExists('online_orders');
}

};
