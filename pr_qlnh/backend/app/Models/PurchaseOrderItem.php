<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrderItem extends Model 
{
protected $table = 'purchase_order_items';
    protected $primaryKey = 'po_item_id';
    public $timestamps = true;

    protected $fillable = [
        'purchase_order_id',
        'ingredient_id',
        'quantity',
        'price'
    ];
}