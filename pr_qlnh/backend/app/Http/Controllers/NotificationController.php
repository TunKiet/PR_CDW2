<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    // ============================================
    // GET: /api/notifications?page=1
    // ============================================
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 10);

        $query = Notification::orderBy('created_at', 'desc');

        // lọc theo type, priority nếu có
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $data = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'current_page' => $data->currentPage(),
            'last_page' => $data->lastPage(),
            'total_notifications' => $data->total(),
            'data' => $data->items(),
        ]);
    }

    // ============================================
    // POST: /api/notifications (Tạo mới)
    // ============================================
    public function store(Request $request)
    {
        // Validation đơn giản
        $request->validate([
            'title'   => 'required|string|max:255',
            'message' => 'required|string',
            'type'    => 'nullable|string',
            'priority'=> 'nullable|string',
            'user_id' => 'nullable|integer',
        ]);

        $data = $request->only([
            'title', 'message', 'type', 'priority', 'user_id'
        ]);

        $data['is_read'] = false;
        $data['created_by'] = auth()->id() ?? null;

        $notification = Notification::create($data);

        return response()->json([
            'success' => true,
            'data' => $notification
        ]);
    }

    // ============================================
    // PUT: /api/notifications/{id} (Cập nhật)
    // ============================================
    public function update(Request $request, $id)
    {
        $notification = Notification::where('notification_id', $id)->first();

        if (!$notification) {
            return response()->json([
                'success' => false,
                'error' => 'Không tìm thấy thông báo'
            ], 404);
        }

        $request->validate([
            'title'   => 'required|string|max:255',
            'message' => 'required|string',
            'type'    => 'nullable|string',
            'priority'=> 'nullable|string',
            'user_id' => 'nullable|integer',
        ]);

        $notification->update($request->only([
            'title', 'message', 'type', 'priority', 'user_id', 'is_read'
        ]));

        return response()->json([
            'success' => true,
            'data' => $notification
        ]);
    }

    // ============================================
    // DELETE: /api/notifications/{id}
    // ============================================
    public function destroy($id)
    {
        $notification = Notification::where('notification_id', $id)->first();

        if (!$notification) {
            return response()->json([
                'success' => false,
                'error' => 'Không tìm thấy thông báo'
            ], 404);
        }

        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa thành công'
        ]);
    }

    // ============================================
    // POST: /api/notifications/{id}/mark-read
    // Đánh dấu 1 thông báo là đã đọc
    // ============================================
    public function markRead($id)
    {
        $notification = Notification::where('notification_id', $id)->first();

        if (!$notification) {
            return response()->json([
                'success' => false,
                'error' => 'Không tìm thấy thông báo'
            ], 404);
        }

        $notification->is_read = true;
        $notification->save();

        return response()->json([
            'success' => true,
            'data' => $notification
        ]);
    }

    // ============================================
    // POST: /api/notifications/mark-all-read?user_id=123
    // Đánh dấu tất cả đã đọc
    // ============================================
    public function markAllRead(Request $request)
    {
        $query = Notification::query()->where('is_read', false);

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $query->update([
            'is_read' => true,
            'updated_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đã đánh dấu tất cả thông báo là đã đọc'
        ]);
    }
}
