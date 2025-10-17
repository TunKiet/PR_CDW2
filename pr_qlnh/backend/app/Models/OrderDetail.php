<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model 
{
protected $table = 'order_details';
    protected $primaryKey = 'order_detail_id';
    public $timestamps = true;

    protected $fillable = [
        'order_id',
        'menu_item_id',
        'quantity',
        'price'
    ];
}