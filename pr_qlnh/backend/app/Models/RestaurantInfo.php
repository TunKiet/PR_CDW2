<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RestaurantInfo extends Model
{
    protected $fillable = [
        'name',
        'logo',
        'email',
        'phone',
        'address',
        'description',
        'website',
        'facebook',
        'instagram',
        'opening_time',
        'closing_time',
        'currency',
        'timezone',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'opening_time' => 'datetime:H:i',
        'closing_time' => 'datetime:H:i',
    ];
}
