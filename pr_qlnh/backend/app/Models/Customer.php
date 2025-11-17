<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    // 🔹 Tên bảng
    protected $table = 'customers';

    // 🔹 Khóa chính
    protected $primaryKey = 'customer_id';

    // 🔹 Cho phép tự tăng ID
    public $incrementing = true;

    // 🔹 Kiểu khóa chính là int
    protected $keyType = 'int';

    // 🔹 Các cột có thể gán dữ liệu hàng loạt
    protected $fillable = [
        'name',
        'phone',
        'points',
        'total_spent',
    ];

    public $timestamps = false;

    // 🔹 Quan hệ (nếu có)
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
    public function getTotalSpentAttribute()
{
    return $this->orders()->sum('total_price');
}

}
