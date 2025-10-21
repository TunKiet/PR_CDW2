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
        Schema::create('user_roles', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id'); // Nguoi dung | ham unsigned co nghia la chi nhan gia tri tuong duong >= 0
            $table->unsignedBigInteger('role_id'); // Vai tro
            // Primary key
            $table->primary(['user_id', 'role_id']);
            // Foreign keys
            // Ham onDelete co nghia la khi mot user bi xoa thi cac ban ghi tuong ung trong bang se bi xoa theo
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_roles');
    }
};
