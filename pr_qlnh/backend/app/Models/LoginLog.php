<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoginLog extends Model
{
    use HasFactory;

    protected $table = 'login_logs';

    protected $fillable = [
        'user_id',
        'ip_address',
        'status',
    ];

    /**
     * Relationship với User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * Lấy danh sách login logs của user
     */
    public static function getLogsByUserId($userId, $limit = 50)
    {
        return self::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Tạo log đăng nhập
     */
    public static function createLog($userId, $ipAddress, $status = 'success')
    {
        return self::create([
            'user_id' => $userId,
            'ip_address' => $ipAddress,
            'status' => $status,
        ]);
    }
}
