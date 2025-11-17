<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';
    protected $primaryKey = 'order_id';
    protected $fillable = ['customer_id', 'total_price', 'note'];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'order_id', 'order_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'order_id', 'order_id');
    }

    public function points()
    {
        return $this->hasMany(Point::class, 'order_id', 'order_id');
    }
}
