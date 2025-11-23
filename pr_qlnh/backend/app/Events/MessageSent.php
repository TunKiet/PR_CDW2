<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $data;

    public function __construct(Message $message)
    {
        $this->data = $this->formatMessage($message);

        Log::info("🟢 Event MessageSent created:", [
            'conversation_id' => $message->conversation_id,
            'message_id' => $message->message_id,
            'user_id' => $message->user_id,
            'message' => $message->message,
        ]);
    }

    private function formatMessage(Message $message)
    {
        return [
            'message_id' => $message->message_id,
            'user_id' => $message->user_id,
            'conversation_id' => $message->conversation_id,
            'sender_type' => $message->sender_type,
            'is_read' => $message->is_read,
            'message' => $message->message,
            'status' => $message->status,
            'created_at' => $message->created_at->toDateTimeString(),
            'user' => $this->formatUser($message->user),
        ];
    }

    private function formatUser($user)
    {
        return [
            'user_id' => $user->user_id, // kiểm tra lại nếu model User dùng 'id'
            'full_name' => $user->full_name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role,
            'status' => $user->status,
        ];
    }

    public function broadcastOn(): array
    {
        $channelName = 'conversation.' . $this->data['conversation_id'];
        Log::info("🟢 Broadcasting on channel: {$channelName}");
        return [new Channel($channelName)];
    }

    public function broadcastAs()
    {
        Log::info('Broadcasting as', ['event' => 'message']);
        return 'message';
    }

     public function broadcastWith()
    {
        return $this->data;
    }
}
