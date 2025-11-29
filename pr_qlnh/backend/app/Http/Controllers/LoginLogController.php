<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LoginLog;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class LoginLogController extends Controller
{
    /**
     * Lấy danh sách login logs của user hiện tại
     */
    public function getUserLogs(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            
            $limit = $request->input('limit', 50);
            $logs = LoginLog::getLogsByUserId($user->user_id, $limit);

            return response()->json([
                'success' => true,
                'data' => $logs,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể lấy danh sách nhật ký!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy danh sách login logs của một user cụ thể (dành cho admin)
     */
    public function getLogsByUser($userId)
    {
        try {
            $logs = LoginLog::getLogsByUserId($userId);

            return response()->json([
                'success' => true,
                'data' => $logs,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể lấy danh sách nhật ký!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
