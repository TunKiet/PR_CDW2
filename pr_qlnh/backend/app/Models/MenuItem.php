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
        'category_id', 'menu_item_name', 'price', 'image_url', 'description', 'status'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'menu_item_id', 'menu_item_id');
    }
}
