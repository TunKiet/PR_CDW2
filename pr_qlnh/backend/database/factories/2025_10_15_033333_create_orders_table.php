<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('orders', function (Blueprint $table) {
            $table->bigIncrements('order_id');
            $table->unsignedBigInteger('user_id')->nullable(); // nhân viên
            $table->unsignedBigInteger('customer_id')->nullable(); // khách hàng (points)
            $table->unsignedBigInteger('table_id')->nullable();
            $table->unsignedBigInteger('reservation_id')->nullable();
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('total_price', 12, 2)->default(0);
            $table->unsignedBigInteger('promotion_id')->nullable();
            $table->string('payment_method', 50)->nullable();
            $table->string('payment_status', 30)->default('pending'); // pending/paid/refunded
            $table->text('notes')->nullable();
            $table->timestamps();

            // FK (expect referenced tables exist)
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('set null');
            $table->foreign('customer_id')->references('customer_id')->on('customers')->onDelete('set null');
            $table->foreign('table_id')->references('table_id')->on('tables')->onDelete('set null');
            $table->foreign('reservation_id')->references('reservation_id')->on('reservations')->onDelete('set null');
            $table->foreign('promotion_id')->references('promotion_id')->on('promotions')->onDelete('set null');
        });
    }
    public function down(): void {
        Schema::dropIfExists('orders');
    }
};
