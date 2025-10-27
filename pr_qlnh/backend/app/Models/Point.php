<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Point extends Model 
{
protected $table = 'points';
    protected $primaryKey = 'point_id';
    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'order_id',
        'points'
    ];
}