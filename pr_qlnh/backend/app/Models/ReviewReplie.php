<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReviewReplie extends Model 
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
}