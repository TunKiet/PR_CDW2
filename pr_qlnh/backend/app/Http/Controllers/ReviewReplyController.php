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
}
