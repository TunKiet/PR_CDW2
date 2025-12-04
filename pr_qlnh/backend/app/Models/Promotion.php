<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    protected $table = 'promotions';
    protected $primaryKey = 'promotion_id';
    
    // Cập nhật các trường fillable để khớp với migration và controller
    protected $fillable = [
        'code', 
        'title', 
        'description', 
        'discount_type', 
        'discount_value', 
        'max_uses', 
        'used_count', 
        'expired_at', 
        'status'
    ]; 

    // Các trường ngày tháng nên được tự động chuyển đổi thành đối tượng Carbon
    protected $dates = ['expired_at'];

    public function orders()
    {
        return $this->hasMany(Order::class, 'promotion_id', 'promotion_id');
    }
}