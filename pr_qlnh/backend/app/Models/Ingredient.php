<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model 
{
    protected $table = 'ingredients';
    protected $primaryKey = 'ingredient_id';
    public $timestamps = true;

    protected $fillable = [
        'ingredient_name',
        'price',
        'unit',
        'total_price',
        'stock_quantity',
        'min_stock_level'
    ];
}
