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
    // method
    //assign permission to role
    public function assignRole($roleName = 'customer')
    {
        $role = Role::where('name', $roleName)->first();

        if ($role) {
            $this->roles()->attach($role->id);
        }

        return $this;
    }
    public function givePermission($permissionName)
    {
        $permission = Permission::where('name', $permissionName)->first();

        if ($permission) {
            $this->permissions()->syncWithoutDetaching($permission->id);
        }

        return $this;
    }
    // get all roles
    public static function getAllRoles()
    {
        return self::all();
    }
    // add role
    public static function addRole(array $data)
    {
        return self::create($data);
    }
    // update role
    public static function updateRole($id, array $data)
    {
        $role = self::find($id);
        if ($role) {
            $role->update($data);
            return $role;
        } else {
            return null;
        }
    }
    // delete role
    public static function deleteRole($id)
    {
        $role = self::find($id);
        if ($role) {
            return $role->delete();
        } else {
            return false;
        }
    }
}
