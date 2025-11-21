<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Redis;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $message;

    public function __construct($message)
    {
        $this->message = $message;
    }

    public function broadcastOn()
    {
        Redis::publish('laravel-database-chat', json_encode([
            'event' => $this->broadcastAs(),
            'data' => $this->message,
            'channel' => 'chat.' . $this->message->conversation_id,
        ]));
        return new Channel('chat.' . $this->message->conversation_id);  // Channel name
    }

    public function broadcastAs()
    {
        return 'message.sent';  // Event name
    }
}
