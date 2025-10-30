<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model 
{
protected $table = 'reservations';
    protected $primaryKey = 'reservation_id';
    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'table_id',
        'reservation_date',
        'reservation_time',
        'num_guests',
        'deposit_amount',
        'note',
        'status'
    ];
}