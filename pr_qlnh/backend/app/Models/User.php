<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    // Khai báo khóa chính là 'user_id' thay vì 'id'
    protected $primaryKey = 'user_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $table = 'users';

    // Nếu khóa chính khác "id", ví dụ "user_id"
    // protected $primaryKey = 'id';

    //Các cột có thể gán hàng loạt (mass assignment)
    protected $fillable = [
        'username', // Đã thay thế 'name' bằng 'username'
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
    // function
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function hasPermission($permissionName)
    {
        return $this->role
            ? $this->role->permissions->contains('name', $permissionName)
            : false;
    }
    public function getAuthIdentifierName()
    {
        return 'user_id';
    }

}
