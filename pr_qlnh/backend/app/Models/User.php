<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;


    protected $table = 'users';

    // Nếu khóa chính khác "id", ví dụ "user_id"
    protected $primaryKey = 'id';

    //Các cột có thể gán hàng loạt (mass assignment)
    protected $fillable = [
        'username',
        'email',
        'password',
        'full_name',
        'phone',
        'status',
    ];

    // Ẩn password khi trả về JSON
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public $timestamps = true;
}
