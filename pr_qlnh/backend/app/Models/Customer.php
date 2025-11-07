<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $table = 'customers';
    protected $primaryKey = 'customer_id';
    protected $fillable = ['phone', 'name', 'points'];

    public function orders()
    {
        return $this->hasMany(Order::class, 'customer_id', 'customer_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'customer_id', 'customer_id');
    }

    public function points()
    {
        return $this->hasMany(Point::class, 'customer_id', 'customer_id');
    }
}
