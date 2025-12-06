<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\NotificationRead;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /* ==========================================
     * LIST WITH READ STATUS
     * GET /api/notifications?user_id=1
     * ========================================== */
    public function index(Request $request)
    {
        $userId = $request->user_id;

        $notifications = Notification::orderBy('created_at', 'desc')
            ->paginate(10);

        // Gắn trạng thái is_read theo từng user
        $notifications->getCollection()->transform(function ($notification) use ($userId) {
            $isRead = NotificationRead::where('notification_id', $notification->notification_id)
                ->where('user_id', $userId)
                ->exists();

            $notification->is_read = $isRead;
            return $notification;
        });

        return response()->json([
            'success' => true,
            'data' => $notifications
        ]);
    }

    /* ==========================================
     * CREATE
     * POST /api/notifications
     * ========================================== */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'     => 'required',
            'message'   => 'required',
            'type'      => 'nullable|string',
            'priority'  => 'nullable|string',
            'scope'     => 'nullable|string',
            'user_id'   => 'nullable|integer',
            'role'      => 'nullable|string',
        ]);

        $data['created_by'] = $request->created_by ?? null;

        $notification = Notification::create($data);

        return response()->json(['success' => true, 'data' => $notification]);
    }

    /* ==========================================
     * DETAIL
     * GET /api/notifications/{id}?user_id=1
     * ========================================== */
    public function show(Request $request, $id)
    {
        $userId = $request->user_id;

        $notification = Notification::find($id);
        if (!$notification) {
            return response()->json(['success' => false, 'error' => 'Không tìm thấy thông báo'], 404);
        }

        $isRead = NotificationRead::where('notification_id', $id)
            ->where('user_id', $userId)
            ->exists();

        $notification->is_read = $isRead;

        return response()->json(['success' => true, 'data' => $notification]);
    }


    /* ==========================================
     * UPDATE
     * PUT /api/notifications/{id}
     * ========================================== */
    public function update(Request $request, $id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json(['success' => false, 'error' => 'Không tìm thấy thông báo'], 404);
        }

        $notification->update($request->only([
            'title', 'message', 'type', 'priority', 'scope', 'user_id', 'role'
        ]));

        return response()->json(['success' => true, 'data' => $notification]);
    }

    /* ==========================================
     * DELETE (Soft Delete)
     * DELETE /api/notifications/{id}
     * ========================================== */
    public function destroy($id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json(['success' => false, 'error' => 'Không tìm thấy thông báo'], 404);
        }

        $notification->delete();

        return response()->json(['success' => true, 'message' => 'Xóa thành công']);
    }


    /* ==========================================
     * MARK 1 READ
     * POST /api/notifications/{id}/mark-read
     * ========================================== */
    public function markRead(Request $request, $id)
    {
        $userId = $request->user_id;

        NotificationRead::updateOrCreate(
            ['notification_id' => $id, 'user_id' => $userId],
            ['read_at' => now()]
        );

        return response()->json(['success' => true]);
    }


    /* ==========================================
     * MARK ALL READ
     * POST /api/notifications/mark-all-read
     * ========================================== */
    public function markAllRead(Request $request)
    {
        $userId = $request->user_id;

        $ids = Notification::pluck('notification_id')->toArray();

        foreach ($ids as $id) {
            NotificationRead::updateOrCreate(
                ['notification_id' => $id, 'user_id' => $userId],
                ['read_at' => now()]
            );
        }

        return response()->json(['success' => true, 'message' => 'OK']);
    }


    /* ==========================================
     * UNREAD COUNT
     * GET /api/notifications/unread-count?user_id=1
     * ========================================== */
    public function unreadCount(Request $request)
    {
        $userId = $request->user_id;

        $count = Notification::whereDoesntHave('reads', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })->count();

        return response()->json(['success' => true, 'count' => $count]);
    }
}
