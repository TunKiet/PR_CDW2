<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DishStatusHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_item_id',
        'old_status',
        'new_status',
        'reason',
        'changed_by',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    // Relationship
    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class, 'menu_item_id', 'menu_item_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'changed_by', 'id');
    }
}