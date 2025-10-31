<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryIngredient extends Model
{
    protected $table = 'category_ingredients';
    protected $primaryKey = 'category_ingredient_id';
    public $timestamps = true;

    protected $fillable = [
        'category_ingredient_name',
        'description'
    ];
    public function ingredient()
    {
        return $this->hasMany(Ingredient::class, 'category_ingredient_id', 'category_ingredient_id');
    }
    public static function index()
    {
        return self::all();
    }
    

}