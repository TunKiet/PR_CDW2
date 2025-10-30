<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categories extends Model 
{
    protected $table = 'categories';
    protected $primaryKey = 'category_id';
    public $timestamps = true;

    protected $fillable = [
        'category_name',
        'description'
    ];
}