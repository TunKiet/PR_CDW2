<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Role;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Đăng ký tài khoản mới
     */
    public function register(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|unique:users,phone',
            'password' => 'required|min:6',
        ]);

        // Tạo user mới
        $user = User::addUser([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'status' => 1,
        ]);

        // Gán role mặc định = customer
        $user->assignRole('customer');

        // Tạo token JWT
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Đăng ký thành công!',
            'user' => $user,
            'roles' => $user->roles,
            'token' => $token
        ], 201);
    }


    /**
     * Đăng nhập người dùng
     */
    public function login(Request $request)
    {
        $request->validate([
            'password' => 'required|min:6',
            'phone' => 'required_without:email',
            'email' => 'required_without:phone|email',
        ]);

        // Xác định trường đăng nhập
        $loginField = $request->filled('email') ? 'email' : 'phone';
        $identifier = $request->input($loginField);

        // Lấy user
        $user = User::getUserbyEmailOrPhone($loginField, $identifier);

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email/SĐT hoặc mật khẩu không đúng!'], 401);
        }

        // Kiểm tra tài khoản có bị vô hiệu hóa không
        if ($user->status == 0) {
            return response()->json(['message' => 'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên!'], 403);
        }

        // Kiểm tra nếu user đã bật 2FA
        if ($user->two_factor_enabled) {
            // Tạo mã OTP 6 chữ số
            $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            
            // Lưu OTP vào cache với thời gian hết hạn 5 phút
            $cacheKey = "otp_login_{$user->user_id}";
            Cache::put($cacheKey, $otp, now()->addMinutes(5));
            
            // Gửi email OTP
            try {
                Mail::send('emails.login-otp', ['otp' => $otp, 'user' => $user], function ($message) use ($user) {
                    $message->to($user->email)
                        ->subject('Mã xác thực đăng nhập');
                });
            } catch (\Exception $e) {
                return response()->json(['message' => 'Có lỗi khi gửi email OTP!'], 500);
            }
            
            // Trả về yêu cầu nhập OTP (không tạo token ngay)
            return response()->json([
                'message' => 'Vui lòng nhập mã OTP đã được gửi đến email của bạn',
                'requires_2fa' => true,
                'user_id' => $user->user_id,
                'email' => $user->email
            ], 200);
        }

        // Nếu không bật 2FA, đăng nhập bình thường
        try {
            $token = JWTAuth::fromUser($user);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Không thể tạo token!'], 500);
        }

        // Lấy danh sách role và permission
        $roles = $user->roles()->pluck('name');
        $permissions = $user->getAllPermissions();

        return response()->json([
            'message' => 'Đăng nhập thành công!',
            'user' => $user,
            'roles' => $roles,
            'permissions' => $permissions,
            'token' => $token,
        ], 200);
    }

    /**
     * Xác thực OTP khi đăng nhập (cho user đã bật 2FA)
     */
    public function verifyLoginOTP(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,user_id',
            'otp' => 'required|digits:6'
        ]);

        $user = User::find($request->user_id);
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại!'], 404);
        }

        $cacheKey = "otp_login_{$user->user_id}";
        $cachedOTP = Cache::get($cacheKey);

        if (!$cachedOTP) {
            return response()->json(['message' => 'Mã OTP đã hết hạn!'], 400);
        }

        if ($cachedOTP !== $request->otp) {
            return response()->json(['message' => 'Mã OTP không chính xác!'], 400);
        }

        // Xóa OTP sau khi xác thực thành công
        Cache::forget($cacheKey);

        // Tạo token JWT
        try {
            $token = JWTAuth::fromUser($user);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Không thể tạo token!'], 500);
        }

        // Lấy danh sách role và permission
        $roles = $user->roles()->pluck('name');
        $permissions = $user->getAllPermissions();

        return response()->json([
            'message' => 'Đăng nhập thành công!',
            'user' => $user,
            'roles' => $roles,
            'permissions' => $permissions,
            'token' => $token,
        ], 200);
    }

    /**
     * Lấy thông tin người dùng hiện tại (dành cho Frontend)
     */
    public function me()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $roles = $user->roles()->pluck('name');
            $permissions = $user->getAllPermissions();

            return response()->json([
                'user' => $user,
                'roles' => $roles,
                'permissions' => $permissions,
            ]);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn!'], 401);
        }
    }
    /**
     * Đăng xuất (hủy token)
     */
    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Đăng xuất thành công!']);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Không thể đăng xuất!'], 500);
        }
    }
}
