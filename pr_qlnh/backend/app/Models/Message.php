<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model 
{
protected $table = 'messages';
    protected $primaryKey = 'message_id';
    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'sender_type',
        'message',
        'status'
    ];
}