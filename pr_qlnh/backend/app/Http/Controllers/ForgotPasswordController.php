<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class ForgotPasswordController extends Controller
{
    // B1: Gửi OTP
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $email = $request->email;
        $otp = rand(100000, 999999);

        DB::table('password_resets')->updateOrInsert(
            ['email' => $email],
            [
                'otp' => $otp,
                'created_at' => now()
            ]
        );

        // Gửi mail trực tiếp
        Mail::send([], [], function ($message) use ($email, $otp) {
            $message->to($email)
                ->subject('Mã OTP khôi phục mật khẩu')
                ->html("
                    <div style='font-family: Arial, sans-serif'>
                        <h3>Xin chào!</h3>
                        <p>Bạn vừa yêu cầu đặt lại mật khẩu.</p>
                        <p>Mã OTP của bạn là:</p>
                        <h2 style='color:#2563eb;'>$otp</h2>
                        <p>Mã này có hiệu lực trong 5 phút.</p>
                    </div>
                ");
        });

        return response()->json(['message' => 'OTP đã được gửi đến email của bạn.']);
    }

    // B2: Xác minh OTP
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6',
        ]);

        $record = DB::table('password_resets')->where('email', $request->email)->first();

        if (!$record) {
            return response()->json(['message' => 'Không tìm thấy yêu cầu khôi phục.'], 404);
        }

        if ($record->otp != $request->otp) {
            return response()->json(['message' => 'Mã OTP không đúng.'], 400);
        }

        // Kiểm tra thời gian (5 phút)
        if (now()->diffInMinutes($record->created_at) > 5) {
            return response()->json(['message' => 'OTP đã hết hạn.'], 400);
        }

        return response()->json(['message' => 'Xác minh OTP thành công.']);
    }

    // B3: Đặt lại mật khẩu
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6',
            'password' => 'required|min:6|confirmed'
        ]);

        $record = DB::table('password_resets')->where('email', $request->email)->first();

        if (!$record || $record->otp != $request->otp) {
            return response()->json(['message' => 'OTP không hợp lệ.'], 400);
        }

        // Cập nhật mật khẩu
        User::where('email', $request->email)->update([
            'password' => Hash::make($request->password),
        ]);

        // Xóa OTP sau khi reset
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Đặt lại mật khẩu thành công!']);
    }
}
