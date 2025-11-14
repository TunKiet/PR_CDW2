<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageAttachment extends Model
{
    protected $primaryKey = 'message_attachment_id';
    protected $table = 'message_attachments';

    protected $fillable = [
        'message_id',
        'name',
        'path',
        'mime',
        'size',
    ];

    public $timestamps = true;

    public function message()
    {
        return $this->belongsTo(Message::class, 'message_id', 'message_id');
    }
}