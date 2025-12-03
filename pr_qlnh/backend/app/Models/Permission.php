<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_permissions', 'permission_id', 'role_id');
    }
    // method
    // get all permissions
    public static function getAllPermissions()
    {
        return self::all();
    }
    // add permission
    public static function addPermission(array $data)
    {
        return self::create($data);
    }
    // update permission
    public static function updatePermission($id, array $data)
    {
        $permission = self::find($id);
        if ($permission) {
            $permission->update($data);
            return $permission;
        }
    }
    // delete permission
    public static function deletePermission($id)
    {
        $permission = self::find($id);
        if ($permission) {
            return $permission->delete();
        }
    }
}

