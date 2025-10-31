<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    protected $table = 'ingredients';
    protected $primaryKey = 'ingredient_id';
    public $timestamps = true;

    protected $fillable = [
        'category_ingredient_id',
        'ingredient_name',
        'price',
        'unit',
        'total_price',
        'stock_quantity',
        'min_stock_level'
    ];

    protected $casts = [
        'created_at' => 'datetime:Y/m/d H:i:s',
        'updated_at' => 'datetime:Y/m/d H:i:s',
    ];

    public function category_ingredient()
    {
        return $this->belongsTo(CategoryIngredient::class, 'category_ingredient_id', 'category_ingredient_id');
    }
    /**
     * get list ingredient
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public static function allIngedient()
    {
        return self::with('category_ingredient:category_ingredient_id,category_ingredient_name')
            ->orderBy('ingredient_id', 'desc')
            ->paginate(10);
    }

    public static function updateIngredient($id, $data)
    {
        $ingredient = self::find($id);
        if ($ingredient) {
            return null;
        }

        $ingredient->update([
            'ingredient_name'        => $data['ingredient_name'],
            'category_ingredient_id' => $data['category_ingredient_id'],
            'price'                  => $data['price'],
            'unit'                   => $data['unit'],
            'stock_quantity'         => $data['stock_quantity'],
            'min_stock_level'        => $data['min_stock_level'],
            'total_price'            => $data['price'] * $data['stock_quantity']
        ]);
        return $ingredient->load('category_ingredient');
    }
}
