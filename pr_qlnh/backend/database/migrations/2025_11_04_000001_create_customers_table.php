<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->bigIncrements('customer_id');
            $table->string('phone', 30)->nullable()->unique();
            $table->string('name', 120)->nullable();
            $table->integer('points')->default(0);
             $table->decimal('total_spent', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
        $table->dropColumn('total_spent');
    });
        
    }
};
