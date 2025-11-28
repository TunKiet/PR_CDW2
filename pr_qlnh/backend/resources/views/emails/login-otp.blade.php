<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mã xác thực đăng nhập</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #10B981;
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .content {
            padding: 40px 30px;
        }
        .otp-box {
            background-color: #F3F4F6;
            border: 2px dashed #10B981;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #10B981;
            letter-spacing: 8px;
            margin: 10px 0;
        }
        .footer {
            background-color: #F9FAFB;
            padding: 20px;
            text-align: center;
            color: #6B7280;
            font-size: 14px;
        }
        .warning {
            color: #DC2626;
            font-size: 14px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Xác thực đăng nhập</h1>
        </div>
        
        <div class="content">
            <p>Xin chào <strong>{{ $user->full_name ?? $user->username }}</strong>,</p>
            
            <p>Chúng tôi nhận được yêu cầu đăng nhập vào tài khoản của bạn. Vui lòng sử dụng mã OTP bên dưới để hoàn tất đăng nhập:</p>
            
            <div class="otp-box">
                <p style="margin: 0; color: #6B7280;">Mã OTP của bạn là:</p>
                <div class="otp-code">{{ $otp }}</div>
                <p style="margin: 10px 0 0 0; color: #6B7280; font-size: 14px;">Mã có hiệu lực trong <strong>5 phút</strong></p>
            </div>
            
            <p><strong>Lưu ý bảo mật:</strong></p>
            <ul style="color: #6B7280;">
                <li>Mã OTP chỉ sử dụng được <strong>một lần</strong></li>
                <li><strong>KHÔNG</strong> chia sẻ mã này với bất kỳ ai</li>
                <li>Nhân viên hỗ trợ sẽ <strong>KHÔNG BAO GIỜ</strong> yêu cầu mã OTP của bạn</li>
            </ul>
            
            <p class="warning">
                ⚠️ Nếu bạn không thực hiện đăng nhập này, vui lòng đổi mật khẩu ngay lập tức và liên hệ với chúng tôi!
            </p>
        </div>
        
        <div class="footer">
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
            <p>&copy; {{ date('Y') }} Nhà Hàng. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
