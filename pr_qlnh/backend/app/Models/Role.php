<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
     use HasFactory;

    protected $fillable = ['name', 'description'];

    public function users()
    {
        return $this->hasMany(User::class); // ham hasMany de thiet lap quan he mot-nhieu
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permission'); // ham belongsToMany de thiet lap quan he nhieu-nhieu
    }
}
