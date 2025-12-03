<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Conversation extends Model
{
    // use SoftDeletes;

    protected $primaryKey = 'conversation_id';
    protected $table = 'conversations';
    protected $fillable = [
        'customer_id',
        'admin_id',
        'last_message_id',
        'status',  // Thêm status (active/inactive)
    ];

    protected $casts = [
        'status' => 'string',  // Enum, nhưng cast string OK
    ];

    public $timestamps = true;

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id', 'user_id');
    }
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id', 'user_id');
    }
    public function messages()
    {
        return $this->hasMany(Message::class, 'conversation_id', 'conversation_id')->orderBy('created_at', 'asc');
    }
    public function lastMessage()
    {
        return $this->belongsTo(Message::class, 'last_message_id', 'message_id');
    }
}