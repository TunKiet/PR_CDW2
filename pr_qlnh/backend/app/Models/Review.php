<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $table = 'reviews';
    protected $primaryKey = 'review_id';
    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'menu_item_id',
        'rating',
        'comment',
        'image_url',
        'like',
        'dislike',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
