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
       Schema::create('reservations', function (Blueprint $table) {
            $table->bigIncrements('reservation_id');
            $table->unsignedBigInteger('table_id')->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            
            $table->date('reservation_date');
            $table->time('reservation_time');
            $table->integer('num_guests');
            $table->decimal('deposit_amount', 10,2)->nullable();
            $table->string('note')->nullable();
            $table->enum('status',['pending','confirmed','cancelled'])->default('pending');
            $table->timestamps();

            $table->foreign('table_id')->references('table_id')->on('tables')->onDelete('cascade');
            $table->foreign('customer_id')->references('customer_id')->on('customers')->onDelete('set null');
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('set null');
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
