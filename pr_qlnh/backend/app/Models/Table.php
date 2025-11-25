<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    use HasFactory;

    protected $table = 'tables';
    protected $primaryKey = 'table_id';
    protected $fillable = ['table_name', 'table_type', 'capacity', 'note', 'status'];
	public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'table_name',
        'table_type',
        'capacity',
        'note',
        'status',
    ];
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'table_id', 'table_id');
    }
}
