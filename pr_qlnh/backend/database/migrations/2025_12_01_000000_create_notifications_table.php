<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->bigIncrements('notification_id');

            $table->string('title');
            $table->text('message');

            $table->enum('type', ['system','order','kitchen','promotion','warning','info'])
                  ->default('system');

            $table->enum('priority', ['low','normal','high'])
                  ->default('normal');

            $table->boolean('is_read')->default(false);

            // đúng với bảng users
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();

            $table->timestamps();

            // Foreign keys CHUẨN ==> reference user_id chứ không phải id
            $table->foreign('user_id')
                  ->references('user_id')->on('users')
                  ->onDelete('set null');

            $table->foreign('created_by')
                  ->references('user_id')->on('users')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
