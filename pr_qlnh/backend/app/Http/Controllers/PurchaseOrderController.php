<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;


class PurchaseOrderController extends Controller
{
    public function getReceivedOrders()
    {

        $cacheKey = 'received_orders_' . date('Y_m');

        try {
            $orders = PurchaseOrder::getIngredientImport();

            return response()->json([
                'status' => true,
                'message' => 'Import thành công',
                'data' => $orders
            ], 200);
        } catch (\Exception $e) {
            Log::error('Received Orders Error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }
}
