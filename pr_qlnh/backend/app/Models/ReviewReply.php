<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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

    //Get reply review
    public static function getReplyByReviewId($reviewId)
    {
        return self::with('user')
            ->where('review_id', $reviewId)
            ->where('status', 'approved')
            ->orderBy('created_at', 'asc')
            ->get();
    }
}