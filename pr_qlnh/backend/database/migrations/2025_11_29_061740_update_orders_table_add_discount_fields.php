<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {

            if (!Schema::hasColumn('orders', 'table_id')) {
                $table->unsignedBigInteger('table_id')->nullable()->after('customer_id');
            }

            if (!Schema::hasColumn('orders', 'voucher')) {
                $table->string('voucher')->nullable()->after('note');
            }

            if (!Schema::hasColumn('orders', 'discount')) {
                $table->decimal('discount', 12, 2)->default(0)->after('voucher');
            }

            if (!Schema::hasColumn('orders', 'rank_discount')) {
                $table->decimal('rank_discount', 12, 2)->default(0)->after('discount');
            }

            // Cập nhật total_price lên DECIMAL(12,2) 
            $table->decimal('total_price', 12, 2)->change();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'table_id')) {
                $table->dropColumn('table_id');
            }

            if (Schema::hasColumn('orders', 'voucher')) {
                $table->dropColumn('voucher');
            }

            if (Schema::hasColumn('orders', 'discount')) {
                $table->dropColumn('discount');
            }

            if (Schema::hasColumn('orders', 'rank_discount')) {
                $table->dropColumn('rank_discount');
            }

            $table->decimal('total_price', 12, 2)->change();
        });
    }
};
