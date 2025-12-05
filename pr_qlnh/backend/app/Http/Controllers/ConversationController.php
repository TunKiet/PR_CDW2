<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    //Create conversation
    public function createConversation(Request $request)
    {
        $conversation = Conversation::firstOrCreate(
            ['customer_id' => $request->customer_id]
        );

        return response()->json([
            'conversation_id' => $conversation
        ]);
    }
}
