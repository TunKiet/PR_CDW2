<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OnlineOrder extends Model
{
    protected $table = 'online_orders';

    protected $fillable = [
        'customer_name',
        'phone',
        'email',
        'province',
        'district',
        'ward',
        'address_detail',
        'payment_method',
        'ship_fee',
        'discount',
        'total',
        'notes',
        'status'
    ];

    public function items()
    {
        return $this->hasMany(OnlineOrderItem::class, 'online_order_id');
    }
}
