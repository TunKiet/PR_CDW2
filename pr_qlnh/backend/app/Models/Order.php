<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $primaryKey = 'order_id';
    protected $fillable = [
        'user_id',
        'table_id',
        'reservation_id',
        'total_price',
        'payment_method',
        'payment_status',
    ];

    public function details()
    {
        return $this->hasMany(OrderDetail::class, 'order_id', 'order_id');
    }
}

