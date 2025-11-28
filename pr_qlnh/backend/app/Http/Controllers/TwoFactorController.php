<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class TwoFactorController extends Controller
{
    /**
     * Gửi mã OTP qua email
     */
    public function sendOTP(Request $request, $userId)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại!'], 404);
        }

        // Tạo mã OTP 6 chữ số
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Lưu OTP vào cache với thời gian hết hạn 5 phút
        $cacheKey = "otp_2fa_{$userId}";
        Cache::put($cacheKey, $otp, now()->addMinutes(5));

        // Gửi email
        try {
            Mail::send('emails.otp', ['otp' => $otp, 'user' => $user], function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('Mã xác thực 2 yếu tố (2FA)');
            });

            return response()->json([
                'message' => 'Mã OTP đã được gửi đến email của bạn!',
                'email' => $user->email
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi gửi email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xác thực mã OTP
     */
    public function verifyOTP(Request $request, $userId)
    {
        $request->validate([
            'otp' => 'required|digits:6'
        ]);

        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại!'], 404);
        }

        $cacheKey = "otp_2fa_{$userId}";
        $cachedOTP = Cache::get($cacheKey);

        if (!$cachedOTP) {
            return response()->json([
                'message' => 'Mã OTP đã hết hạn hoặc không tồn tại!'
            ], 400);
        }

        if ($cachedOTP !== $request->otp) {
            return response()->json([
                'message' => 'Mã OTP không chính xác!'
            ], 400);
        }

        // Xóa OTP sau khi xác thực thành công
        Cache::forget($cacheKey);

        // Kích hoạt 2FA cho user
        $user->two_factor_enabled = true;
        $user->save();

        return response()->json([
            'message' => 'Xác thực 2FA thành công!',
            'two_factor_enabled' => true
        ]);
    }

    /**
     * Tắt 2FA
     */
    public function disable2FA($userId)
    {
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại!'], 404);
        }

        $user->two_factor_enabled = false;
        $user->save();

        return response()->json([
            'message' => 'Đã tắt xác thực 2 yếu tố!',
            'two_factor_enabled' => false
        ]);
    }

    /**
     * Kiểm tra trạng thái 2FA
     */
    public function check2FAStatus($userId)
    {
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại!'], 404);
        }

        return response()->json([
            'two_factor_enabled' => $user->two_factor_enabled ?? false
        ]);
    }
}
