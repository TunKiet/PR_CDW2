<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OnlineOrderItem extends Model
{
    protected $table = 'online_order_items';

    protected $fillable = [
        'online_order_id',
        'menu_item_id',
        'quantity',
        'price',
        'note'
    ];

    public function menu()
    {
        return $this->belongsTo(MenuItem::class, 'menu_item_id');
    }
}
