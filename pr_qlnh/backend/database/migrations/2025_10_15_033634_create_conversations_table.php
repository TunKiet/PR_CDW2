<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id('conversation_id'); // primary key
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('admin_id')->nullable();
            $table->unsignedBigInteger('last_message_id')->nullable();

            // Thêm status để track active/inactive
            $table->enum('status', ['active', 'inactive'])->default('active');

            $table->timestamps();

            // Indexes
            $table->index(['customer_id', 'admin_id']);  // Query conversations theo customer/admin
            $table->index('status');                     // Filter active conversations
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
