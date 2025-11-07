<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('promotions', function (Blueprint $table) {
            $table->bigIncrements('promotion_id');
            $table->string('code', 50)->unique();
            $table->string('title', 150);
            $table->text('description')->nullable();
            $table->enum('discount_type', ['percent','fixed'])->default('fixed');
            $table->decimal('discount_value', 10, 2)->default(0);
            $table->unsignedInteger('max_uses')->nullable(); // null = unlimited
            $table->unsignedInteger('used_count')->default(0);
            $table->dateTime('expired_at')->nullable();
            $table->string('status', 30)->default('active');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('promotions');
    }
};
