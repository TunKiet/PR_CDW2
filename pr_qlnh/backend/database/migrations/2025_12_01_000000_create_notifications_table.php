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

            $table->enum('type', [
                'system', 'order', 'kitchen', 'promotion', 'warning', 'info'
            ])->default('system');

            $table->enum('priority', ['low', 'normal', 'high'])->default('normal');

            // Phạm vi thông báo: tất cả / user / role
            $table->enum('scope', ['all', 'user', 'role'])->default('all');

            // Nếu scope = user → user_id có giá trị
            $table->unsignedBigInteger('user_id')->nullable();

            // Nếu scope = role → role có giá trị
            $table->string('role')->nullable();

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // FK
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
