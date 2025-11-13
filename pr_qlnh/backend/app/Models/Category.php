<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $primaryKey = 'category_id';
    // Đảm bảo khóa chính là tự động tăng (mặc định là true, nhưng khai báo cho rõ)
    public $incrementing = true; 
    
    // Tên bảng (nếu không theo quy tắc số nhiều mặc định)
    protected $table = 'categories';

    // Cho phép gán hàng loạt (Mass Assignment) cho các trường này
    protected $fillable = [
        'category_name',
        'description',
    ];

    /**
     * Định nghĩa mối quan hệ: Một Category có nhiều Menu Items (Món ăn)
     */
    public function menuItems()
    {
        // 1. Sửa tên Class: Menu_Item::class (hoặc MenuItem::class)
        // 2. Sửa Khóa cục bộ: Dùng 'category_id' thay vì 'id'
        return $this->hasMany(MenuItem::class, 'category_id', 'category_id'); 
    }
}