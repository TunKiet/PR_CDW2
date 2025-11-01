<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PreOrder extends Model
{
    protected $primaryKey = 'pre_order_id';
    protected $fillable = ['order_code', 'customer_name', 'order_datetime', 'total_amount', 'deposit_amount', 'status'];

    public function details()
    {
        return $this->hasMany(PreOrderDetail::class, 'pre_order_id');
    }
}
