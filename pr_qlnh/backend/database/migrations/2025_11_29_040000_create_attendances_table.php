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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id('attendance_id');
            $table->unsignedBigInteger('user_id');
            $table->string('employee_code', 50); // Mã nhân viên
            $table->date('date'); // Ngày chấm công
            $table->time('check_in')->nullable(); // Giờ vào
            $table->time('check_out')->nullable(); // Giờ ra
            $table->decimal('hours_worked', 5, 2)->default(0); // Số giờ làm việc
            $table->enum('status', ['present', 'absent', 'late', 'half_day'])->default('present'); // Trạng thái
            $table->text('note')->nullable(); // Ghi chú
            $table->timestamps();

            // Foreign key
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            
            // Index để tìm kiếm nhanh
            $table->index(['user_id', 'date']);
            $table->index('employee_code');
            $table->index('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
