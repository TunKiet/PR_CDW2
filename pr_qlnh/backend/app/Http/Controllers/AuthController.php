<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Models\User;

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
            'password' => 'required|min:6|confirmed', // nhớ thêm field password_confirmation
        ]);

        $user = User::create([
            'username' => explode('@', $request->email)[0],
            'full_name' => $request->full_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'user',
            'status' => 1,
        ]);

        // Đăng nhập luôn sau khi đăng ký
        Auth::login($user);

        return response()->json([
            'message' => 'Đăng ký thành công!',
            'user' => $user,
            'role' => $user->role ?? 'user'
        ], 201);
    }

    /**
     * Đăng nhập người dùng (session-based)
     */
    public function login(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'password' => 'required|string',
        ]);

        // Kiểm tra identifier là email hay phone
        $user = User::where('email', $request->identifier)
            ->orWhere('phone', $request->identifier)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Sai thông tin đăng nhập.'], 401);
        }

        Auth::login($user);

        return response()->json([
            'message' => 'Đăng nhập thành công!',
            'user' => $user,
            'role' => $user->role ?? 'user',
        ]);
    }

    /**
     * Lấy thông tin người dùng hiện tại
     */
    public function me()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Chưa đăng nhập!'], 401);
        }

        return response()->json($user);
    }

    /**
     * Đăng xuất người dùng
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Đăng xuất thành công!']);
    }

    /**
     * Gửi OTP qua email để reset password
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $otp = rand(100000, 999999);

        DB::table('password_resets')->where('email', $request->email)->delete();
        DB::table('password_resets')->insert([
            'email' => $request->email,
            'otp' => $otp,
            'created_at' => Carbon::now(),
        ]);

        Mail::raw("Mã OTP của bạn là: $otp. Mã này có hiệu lực trong 5 phút.", function ($message) use ($request) {
            $message->to($request->email)
                ->subject('Xác nhận đặt lại mật khẩu');
        });

        return response()->json(['message' => 'OTP đã được gửi đến email của bạn!']);
    }

    /**
     * Xác thực OTP
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6',
        ]);

        $record = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('otp', $request->otp)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'OTP không hợp lệ!'], 400);
        }

        if (Carbon::parse($record->created_at)->addMinutes(5)->isPast()) {
            return response()->json(['message' => 'OTP đã hết hạn!'], 400);
        }

        return response()->json(['message' => 'Xác thực OTP thành công!']);
    }

    /**
     * Đặt lại mật khẩu mới
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6',
            'password' => 'required|min:6|confirmed',
        ]);

        $record = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('otp', $request->otp)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'OTP không hợp lệ!'], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Đặt lại mật khẩu thành công!']);
    }
}
