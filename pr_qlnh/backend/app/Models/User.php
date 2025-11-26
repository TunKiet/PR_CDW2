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
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id');
    }
    // Gán role cho user
    public function assignRole($roleName = 'customer')
    {
        $role = Role::firstOrCreate(['name' => $roleName]);
        $this->roles()->syncWithoutDetaching($role->id);
        return $this;
    }

    public function hasPermission($permissionName)
    {
        foreach ($this->roles as $role) {
            if ($role->permissions->contains('name', $permissionName)) {
                return true;
            }
        }
        return false;
    }
    // lay tat ca quyen
    public function getAllPermissions()
    {
        return Permission::whereIn('id', function ($query) {
            $query->select('permission_id')
                ->from('role_permissions')
                ->whereIn('role_id', $this->roles()->pluck('id'));
        })->pluck('name');
    }

    public function getAuthIdentifierName()
    {
        return 'user_id';
    }
    //lay nguoi dung theo email hoac phone
    public static function getUserbyEmailOrPhone(string $field, string $value)
    {
        return self::where($field, $value)->first();
    }
    // get all users
    public static function getAllUsers()
    {
        return self::with('roles')
            ->get()
            ->map(function ($user) {
                return [
                    'user_id' => $user->user_id,
                    'full_name' => $user->full_name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'status' => $user->status,
                    'roles' => $user->roles->pluck('name')->join(', '),
                ];
            });
    }

    //get user by id
    public static function getUserById($id)
    {
        return self::find($id);
    }
    // add user
    public static function addUser($data)
    {
        return self::create([
            'full_name' => $data['username'] ?? null,
            'email' => $data['email'],
            'password' => $data['password'],
            'phone' => $data['phone'],
            'status' => $data['status'] ?? 1,
        ]);
    }

    // update user
    public static function updateUser($id, array $data)
    {
        $user = self::find($id);
        if ($user) {
            $user->update($data);
            return $user;
        }
    }
    // delete user
    public static function deleteUser($id)
    {
        $user = self::find($id);
        if ($user) {
            return $user->delete();
        }
    }
    //lay ten vai tro cua nguoi dung
    public function getRoleNames()
    {
        return $this->roles()->pluck('name');
    }

}
