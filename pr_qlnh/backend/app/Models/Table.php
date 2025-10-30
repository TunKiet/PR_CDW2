<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    protected $table = 'tables';
    protected $primaryKey = 'table_id';
    public $timestamps = true;

    protected $fillable = [
        'table_name',
        'table_type',
        'status'
    ];
}
