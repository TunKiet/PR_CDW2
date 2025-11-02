<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PreOrderDetail extends Model
{
    protected $primaryKey = 'pre_order_detail_id';
    protected $fillable = ['pre_order_id', 'menu_item_id', 'quantity', 'price'];

    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class, 'menu_item_id');
    }
}
