<?php

namespace App\Models; // ⚠️ Thêm dòng này

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $primaryKey = 'menu_item_id';

    protected $fillable = [
        'category_id',
        'menu_item_name',
        'price',
        'image_url',
        'description',
        'status',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }
}
