<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;


class MessageController extends Controller
{
    public function sendMessage(Request $request)
    {
        Log::info("▶ [API] sendMessage RECEIVED", $request->all());

        $request->validate([
            'conversation_id' => 'required|exists:conversations,conversation_id',
            'user_id' => 'required|exists:users,user_id',
            'sender_type' => 'required|in:user,admin',
            'message' => 'required|string',
        ]);

        // Tạo message
        $message = Message::create([
            'conversation_id' => $request->conversation_id,
            'user_id' => $request->user_id,
            'sender_type' => $request->sender_type,
            'message' => $request->message,
            'status' => 'sent',
            'is_read' => false,
        ]);

        // Update last_message_id trong conversation
        Conversation::where('conversation_id', $request->conversation_id)
            ->update(['last_message_id' => $message->message_id]);

        broadcast(new MessageSent($message));

        return response()->json(['status' => 'sent', 'message' => $message]);
    }

    // Get messages theo conversation
    public function getMessages($conversationId)
    {
        $messages = Message::where('conversation_id', $conversationId)
            ->with('user')  // Load user info
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    // Get conversations cho admin (hoặc user)
    public function getConversations()
    {
        // Ví dụ cho admin: lấy tất cả conversations
        $conversations = Conversation::with('customer', 'lastMessage')->get();
        return response()->json($conversations);
    }

    // Mark messages as read
    public function markAsRead(Request $request)
    {
        Message::where('conversation_id', $request->conversation_id)
            ->where('user_id', '!=', $request->user_id)  // Mark messages của người khác là read
            ->update(['is_read' => true]);

        return response()->json(['status' => 'marked']);
    }

    public function delete($messageId)
    {
        $delete = Message::deleteMessage($messageId);

        if ($delete) {
            return response()->json([
                'data' => true,
                'message' => 'Xóa thành công'
            ]);
        }

        return response()->json([
            'data' => false,
            'message' => 'Xóa không hợp lệ'
        ], 404);
    }
}
