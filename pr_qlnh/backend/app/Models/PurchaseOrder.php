<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

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


    public function order_items()
    {
        return $this->hasMany(PurchaseOrderItem::class, 'purchase_order_id', 'purchase_order_id')->with('ingredient');
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

    public static function getDataPurchaseOrder()
    {

    }

    // 🔹 Tổng quan đơn hàng
    public static function getSummary($perPage = 5)
    {
        $ordersQuery = self::select(
            'purchase_order_id',
            'supplier_name',
            'order_date',
            'total_cost',
            'status',
            'created_at',
            'updated_at'
        )
            ->orderBy('created_at', 'desc');

        $paginatedOrders = $ordersQuery->paginate($perPage);

        return [
            'total_orders' => self::count(),
            'pending_orders' => self::where('status', 'pending')->count(),
            'delivering_orders' => self::where('status', 'shipping')->count(),
            'total_cost' => self::sum('total_cost'),
            'orders' => $paginatedOrders->items(),
            'last_page' => $paginatedOrders->lastPage(),
            'current_page' => $paginatedOrders->currentPage(),
        ];
    }




    // Chi tiết đơn hàng
    public static function getOrderDetail($purchase_order_id)
    {
        $order = self::with(['order_items.ingredient'])->find($purchase_order_id);

        if (!$order)
            return null;

        return [
            'purchase_order_id' => $order->purchase_order_id,
            'supplier_name' => $order->supplier_name,
            'order_date' => $order->order_date,
            'status' => $order->status,
            'total_cost' => $order->total_cost,
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
            'items' => $order->order_items->map(function ($item) {
                return [
                    'ingredient_id' => $item->ingredient_id,
                    'ingredient_name' => $item->ingredient->ingredient_name ?? null,
                    'unit' => $item->ingredient->unit ?? null,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'total' => $item->quantity * $item->price,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                ];
            })
        ];
    }

    
}
