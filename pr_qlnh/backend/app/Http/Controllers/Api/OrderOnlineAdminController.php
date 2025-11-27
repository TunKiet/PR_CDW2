<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OnlineOrder;

class OrderOnlineAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = OnlineOrder::query();

        // Tìm kiếm
        if ($request->q) {
            $query->where(function ($q) use ($request) {
                $q->where('customer_name', 'like', "%{$request->q}%")
                  ->orWhere('phone', 'like', "%{$request->q}%")
                  ->orWhere('id', $request->q);
            });
        }

        // Lọc trạng thái
        if ($request->status) {
            $query->where('status', $request->status);
        }

        return response()->json(
            $query->withCount('items')
                  ->orderBy('id', 'desc')
                  ->paginate(10)
        );
    }

    public function show($id)
    {
        return OnlineOrder::with(['items.menu'])
            ->findOrFail($id);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = OnlineOrder::findOrFail($id);
        $order->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Trạng thái đã cập nhật',
            'order' => $order
        ]);
    }
}
