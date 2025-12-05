<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class ReviewReply extends Model
{
    protected $table = 'review_replies';
    protected $primaryKey = 'reply_id';
    public $timestamps = true;

    protected $fillable = [
        'review_id',
        'user_id',
        'reply_text',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function reviewId()
    {
        return $this->belongsTo(Review::class, 'review_id', 'review_id');
    }

    //Get reply review
    public static function getReplyByReviewId($reviewId)
    {
        return self::with('user')
            ->where('review_id', $reviewId)
            ->where('status', 'approved')
            ->orderBy('created_at', 'asc')
            ->get();
    }

    //Count reply review
    public static function countReply()
    {
        return self::count();
    }

    public static function getReply($perPage = 10)
    {
        return self::with('user:user_id,full_name', 'reviewId:review_id,comment')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
        ;
    }

    //Delete reply
    public static function deleteReply($replyId)
    {
        $reply = self::find($replyId);
        if (!$reply) {
            return false;
        }
        return $reply->delete();
    }

    //Hide review
    public static function hideReply($replyId)
    {
        $reply = self::find($replyId);

        if (!$reply) {
            return false;
        }

        $reply->status = 'hide';

        return $reply->save();
    }

    //Approved reply
    public static function approvedReply($replyId)
    {
        $reply = self::find($replyId);

        if (!$reply) {
            return false;
        }
        $reply->status = 'approved';

        return $reply->save();
    }
}