<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    DB::statement("ALTER TABLE online_orders MODIFY status ENUM('pending','confirmed','delivering','done','cancelled') DEFAULT 'pending'");
}

public function down()
{
    DB::statement("ALTER TABLE online_orders MODIFY status ENUM('pending','confirmed','delivered','cancelled') DEFAULT 'pending'");
}

};
