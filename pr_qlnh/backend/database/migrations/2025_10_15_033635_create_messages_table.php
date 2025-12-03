<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id('message_id');
            $table->unsignedBigInteger('user_id');

            // Cột conversation_id tham chiếu đúng cột id trong conversations
            $table->unsignedBigInteger('conversation_id');
            $table->foreign('conversation_id')
                ->references('conversation_id')
                ->on('conversations')
                ->onDelete('cascade');
            $table->string('sender_type')->nullable();

            $table->boolean('is_read')->default(false);
            $table->text('message')->nullable();
            $table->enum('status', ['sending', 'sent', 'read', 'failed'])->default('sending');
            $table->timestamps();

            // Indexes
            $table->index(['conversation_id', 'created_at']);
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
