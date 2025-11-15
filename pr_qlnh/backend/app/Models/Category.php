<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';
    protected $primaryKey = 'category_id';

    // Cho phép gán hàng loạt (Mass Assignment) cho các trường này
    protected $fillable = [
        'category_name',
        'description', // Giữ lại trường này nếu bạn dùng nó trong DB
        'slug',        // BỔ SUNG: Rất quan trọng cho API Store/Update
        'is_hidden',   // BỔ SUNG: Rất quan trọng cho API Store/Update
    ];

    /**
     * Định nghĩa mối quan hệ: Một Category có nhiều Menu Items (Món ăn)
     */
    public function menuItems()
    {
        // SỬA LỖI: Dùng tên Class đúng là MenuItem::class
        // Tham số 1: Tên Model của đối tượng liên quan (Món ăn)
        // Tham số 2: Tên khóa ngoại trên bảng 'menu_items' (category_id)
        // Tham số 3: Tên khóa cục bộ trên bảng 'categories' (category_id)
        return $this->hasMany(MenuItem::class, 'category_id', 'category_id'); 
    }
}
