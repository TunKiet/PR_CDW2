<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model 
{
protected $table = 'orders';
    protected $primaryKey = 'order_id';
    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'table_id',
        'reservation_id',
        'total_price',
        'payment_method',
        'payment_status'
    ];
}