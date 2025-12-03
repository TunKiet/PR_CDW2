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

    public function order_item()
    {
        return $this->hasMany(PurchaseOrderItem::class, 'purchase_order_id', 'purchase_order_id');
    }

    public static function getIngredientImport()
    {
        return self::selectRaw("
            YEAR(order_date) AS year,
            MONTH(order_date) AS month,
            SUM(purchase_order_items.quantity) AS total_quantity,
            COUNT(DISTINCT purchase_orders.purchase_order_id) AS total_orders
        ")
            ->join('purchase_order_items', 'purchase_orders.purchase_order_id', '=', 'purchase_order_items.purchase_order_id')
            ->where('purchase_orders.status', 'received')
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();
    }
}
