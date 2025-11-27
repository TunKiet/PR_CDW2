<?php

namespace App\Http\Controllers;

use App\Models\ReviewReply;
use Illuminate\Http\Request;

class ReviewReplyController extends Controller
{
    public function getDataReply($reviewId)
    {
        $reply = ReviewReply::getReplyByReviewId($reviewId);

        return response()->json([
            'reply' => $reply
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'review_id' => 'required|integer',
            'user_id' => 'required|integer',
            'reply_text' => 'required|string',
        ]);

        $reply = ReviewReply::create($request->all());

        return response()->json([
            'data' => $reply,
        ]);
    }
    
    //Count reply
    public function getAllReplies()
    {
        $countReply = ReviewReply::countReply();

        $replies = ReviewReply::getReply();

        return response()->json([
            'countReply' => $countReply,
            'replies' => $replies
        ]);
    }
}
