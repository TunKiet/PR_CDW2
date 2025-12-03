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

    //Count reply, all reply
    public function getAllReplies(Request $request)
    {
        $perPage = $request->query('per_page', 10);

        $countReply = ReviewReply::countReply();

        $replies = ReviewReply::getReply($perPage);

        return response()->json([
            'countReply' => $countReply,
            'data' => $replies->items(),
            'current_page' => $replies->currentPage(),
            'last_page' => $replies->lastPage(),
            'per_page' => $replies->perPage(),
        ]);
    }

    public function delete($replyId)
    {
        $delete = ReviewReply::deleteReply($replyId);

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

    //Hide review 
    public function hide($replyId)
    {
        $hide = ReviewReply::hideReply($replyId);

        if ($hide) {
            return response()->json([
                'data' => true,
            ]);
        } else {
            return response()->json([
                'data' => false
            ], 404);
        }
    }

    //Approved review
    public function approved($replyId)
    {
        $approved = ReviewReply::approvedReply($replyId);

        if ($approved) {
            return response()->json([
                'data' => true,
            ]);
        } else {
            return response()->json([
                'data' => false
            ], 404);
        }
    }
}
