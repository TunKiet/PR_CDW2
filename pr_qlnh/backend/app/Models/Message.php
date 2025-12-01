<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table = 'messages';
    protected $primaryKey = 'message_id';

    protected $fillable = [
        'user_id',
        'conversation_id',  // Thêm conversation_id
        'sender_type',
        'message',
        'status',
        'is_read',  // Thêm is_read
    ];

    protected $casts = [
        'is_read' => 'boolean',  // Cast thành boolean
    ];

    public $timestamps = true;

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function conversation()
    {
        return $this->belongsTo(Conversation::class, 'conversation_id', 'conversation_id');
    }

    public function attachments()
    {
        return $this->hasMany(MessageAttachment::class, 'message_id', 'message_id');
    }

    public static function deleteMessage($messageId)
    {
        $message = Message::find($messageId);

        if (!$message) {
            return false;
        }

        return $message->delete();
    }
}