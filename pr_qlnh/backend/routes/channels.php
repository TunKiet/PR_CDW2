<?php

use Illuminate\Support\Facades\Broadcast;


Broadcast::channel('conversation.{conversation_id}', function ($user, $conversation_id) {
    // Ở đây bạn không cần check auth nếu là public channel
    return true; 
});