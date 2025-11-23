<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// Tên class phải là MenuItem
class MenuItem extends Model 
{
    use HasFactory;
    
    // Tên bảng trong database
    protected $table = 'menu_items';

    // Khóa chính
    protected $primaryKey = 'menu_item_id';

    // Các trường được phép Mass Assignment (cần thiết cho store/update)
    protected $fillable = [
        'category_id',
        'menu_item_name',
        'price',
        'image_url',
        'description',
        'status',
        'is_featured',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }
}
