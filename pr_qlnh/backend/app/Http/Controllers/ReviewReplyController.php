<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\ReviewReplie;
use App\Models\ReviewReply;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ReviewReplyController extends Model
{
    // App\Http\Controllers\ReviewReplyController.php
    public function getReplies($menuItemId)
    {
        $replies = ReviewReply::getRepliesByMenuItem($menuItemId);
        return response()->json($replies);
    }
}
