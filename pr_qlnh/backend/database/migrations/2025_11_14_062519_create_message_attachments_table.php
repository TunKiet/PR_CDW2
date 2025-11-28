<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('message_attachments', function (Blueprint $table) {
            $table->id('message_attachment_id'); // id tự sinh (message_attachment_id)
            
            $table->unsignedBigInteger('message_id'); // tham chiếu đúng tới messages.id
            $table->string('name', 255);
            $table->string('path', 1024);
            $table->string('mime', 255);
            $table->string('size');
            $table->timestamps();

            // FK tới messages.id
            $table->foreign('message_id')
                  ->references('message_id')
                  ->on('messages')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('message_attachments', function (Blueprint $table) {
            $table->dropForeign(['message_id']);
        });
        Schema::dropIfExists('message_attachments');
    }
};
