<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CookingRecipe extends Model
{
    protected $table = 'cooking_recipe';
    protected $primaryKey = 'cooking_recipe_id';
    public $timestamps = true;

    protected $fillable = [
        'menu_item_id',
        'ingredient_id',
        'quantity_needed',
        'available_servings',
        'preparation_steps',
        'note'
    ];
}
