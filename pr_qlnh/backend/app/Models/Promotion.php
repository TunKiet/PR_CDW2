<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    protected $table = 'promotions';
    protected $primaryKey = 'promotion_id';
    protected $fillable = ['promotion_name', 'discount_percent', 'start_date', 'end_date', 'status'];

    public function orders()
    {
        return $this->hasMany(Order::class, 'promotion_id', 'promotion_id');
    }
}
