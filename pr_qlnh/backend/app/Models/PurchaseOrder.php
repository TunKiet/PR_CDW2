<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model 
{
protected $table = 'purchase_orders';
    protected $primaryKey = 'purchase_order_id';
    public $timestamps = true;

    protected $fillable = [
        'supplier_name',
        'total_cost',
        'status',
        'order_date'
    ];
}