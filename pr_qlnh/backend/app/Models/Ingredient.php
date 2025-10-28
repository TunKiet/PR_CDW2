<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $table = 'menu_items';

    // ⚠️ Đây là điểm quan trọng
    protected $primaryKey = 'menu_item_id';

    // Nếu khóa chính tự động tăng (AUTO_INCREMENT)
    public $incrementing = true;

    // Nếu là integer
    protected $keyType = 'int';

    protected $fillable = [
        'menu_item_id',
        'name',
        'price',
        'description',
        'category_id',
        'status'
    ];
    public function run(): void
{
    DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // 🔧 tắt kiểm tra khóa ngoại
    DB::table('ingredients')->truncate();

    DB::table('ingredients')->insert([
        ['ingredient_id' => 1, 'ingredient_name' => 'Thịt bò', 'unit' => 'kg', 'created_at' => now(), 'updated_at' => now()],
        ['ingredient_id' => 2, 'ingredient_name' => 'Bún tươi', 'unit' => 'kg', 'created_at' => now(), 'updated_at' => now()],
        ['ingredient_id' => 3, 'ingredient_name' => 'Hành lá', 'unit' => 'g', 'created_at' => now(), 'updated_at' => now()],
        ['ingredient_id' => 4, 'ingredient_name' => 'Nước mắm', 'unit' => 'ml', 'created_at' => now(), 'updated_at' => now()],
        ['ingredient_id' => 5, 'ingredient_name' => 'Đường', 'unit' => 'g', 'created_at' => now(), 'updated_at' => now()],
    ]);
    DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // 🔒 bật lại
}

}
