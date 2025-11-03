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
    /**
     * Summary of updateIngredient
     * @param mixed $id
     * @param mixed $data
     * @return array{data: Ingredient|\Illuminate\Database\Eloquent\Collection<int, Ingredient>, message: string, success: bool|null}
     */
    public static function updateIngredient($id, $data)
    {
        $ingredient = self::find($id);

        if (!$ingredient) {
            return [
                'success' => false,
                'message' => 'Nguyên liệu không tồn tại.'
            ];
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
        return [
            'success' => true,
            'message' => 'Cập nhật nguyên liệu thành công.',
            'data' => $ingredient->fresh()->load('category_ingredient')
        ];
    }
    /**
     * Summary of remove
     * @param mixed $id
     * @return array{data: Ingredient|\Illuminate\Database\Eloquent\Collection<int, Ingredient>, message: string, success: bool|array{message: string, success: bool}}
     */
    public static function remove($id)
    {
        try {
            $ingredient = self::find($id);
            if (!$ingredient) {
                return [
                    'success' => false,
                    'message' => 'Xóa không hợp lệ'
                ];
            }

            $ingredient->delete();

            return [
                'success' => true,
                'message' => 'Xóa nguyên liệu thành công.',
                'data' => $ingredient
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Không thể xóa nguyên liệu: ' . $e->getMessage()
            ];
        }
    }
}
