<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

Route::post('/register', function (Request $request) {
    $validated = $request->validate([
        'full_name' => 'required|string|max:255',
        'email' => 'required|string|email|unique:users,email',
        'phone' => 'required|string|max:15|unique:users,phone',
        'password' => 'required|string|min:8',
    ]);

    $user = User::create([
        'name' => $validated['full_name'],
        'email' => $validated['email'],
        'phone' => $validated['phone'],
        'password' => Hash::make($validated['password']),
    ]);

    return response()->json(['message' => 'Đăng ký thành công!', 'user' => $user]);
});

Route::post('/login', function (Request $request) {
    $validated = $request->validate([
        'phone' => 'required|string',
        'password' => 'required|string',
    ]);

    // Tìm user theo số điện thoại
    $user = User::where('phone', $validated['phone'])->first();

    if (!$user || !Hash::check($validated['password'], $user->password)) {
        return response()->json(['message' => 'Số điện thoại hoặc mật khẩu không đúng!'], 401);
    }

    return response()->json([
        'message' => 'Đăng nhập thành công!',
        'user' => $user
    ]);
});
