<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id('category_id'); // Khóa chính (Primary Key, auto-increment)

            $table->string('category_name', 100);

            // BỔ SUNG: Slug (Duy nhất và có index)
            $table->string('slug', 150)->unique();

            $table->string('description', 255)->nullable();

            // BỔ SUNG: Trạng thái hiển thị (Mặc định là false = Hiển thị)
            $table->boolean('is_hidden')->default(false);

            $table->timestamps(); // Thêm created_at và updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
