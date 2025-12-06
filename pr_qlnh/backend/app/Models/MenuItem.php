<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model 
{
    use HasFactory;
    
    protected $table = 'menu_items';
    protected $primaryKey = 'menu_item_id';

    protected $fillable = [
        'category_id',
        'menu_item_name',
        'price',
        'image_url',
        'description',
        'status',
        'is_featured',
        'stock_quantity',           // ⭐ Thêm
        'unavailable_reason',       // ⭐ Thêm
        'unavailable_until',        // ⭐ Thêm
        'updated_by',               // ⭐ Thêm
    ];

    // ⭐ Cast kiểu dữ liệu
    protected $casts = [
        'price' => 'decimal:2',
        'is_featured' => 'boolean',
        'stock_quantity' => 'integer',
        'unavailable_until' => 'datetime',
    ];

    // Relationship
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    // ⭐ Relationship với User (người cập nhật)
    public function updatedByUser()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
}