<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model 
{
    protected $table = 'menu_items';
    protected $primaryKey = 'menu_item_id';
    public $timestamps = true;

    protected $fillable = [
        'category_id',
        'menu_item_name',
        'description',
        'price',
        'image_url',
        'status'
    ];
}