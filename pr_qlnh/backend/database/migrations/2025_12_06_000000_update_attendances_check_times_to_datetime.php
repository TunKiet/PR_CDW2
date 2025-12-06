<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Cập nhật check_in và check_out từ time sang datetime để lưu thời gian chấm công chính xác
     */
    public function up(): void
    {
        // Sử dụng raw SQL để thay đổi kiểu dữ liệu mà không cần doctrine/dbal
        DB::statement('ALTER TABLE attendances MODIFY check_in DATETIME NULL');
        DB::statement('ALTER TABLE attendances MODIFY check_out DATETIME NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Đổi lại về time nếu rollback
        DB::statement('ALTER TABLE attendances MODIFY check_in TIME NULL');
        DB::statement('ALTER TABLE attendances MODIFY check_out TIME NULL');
    }
};
