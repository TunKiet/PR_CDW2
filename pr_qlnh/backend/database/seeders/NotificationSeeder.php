<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;

class NotificationSeeder extends Seeder
{
    public function run()
    {
        $samples = [
            [
                'title' => 'Đơn hàng mới',
                'message' => 'Bàn 5 vừa gọi món Bò lúc lắc và Nước suối.',
                'type' => 'order',
                'priority' => 'high',
                'scope' => 'all',
            ],
            [
                'title' => 'Món đã sẵn sàng',
                'message' => 'Bếp đã hoàn thành món Lẩu Thái cho bàn 2.',
                'type' => 'kitchen',
                'priority' => 'normal',
                'scope' => 'all',
            ],
            [
                'title' => 'Hủy món',
                'message' => 'Bàn 3 yêu cầu hủy món Trà đào.',
                'type' => 'order',
                'priority' => 'low',
                'scope' => 'all',
            ],
            [
                'title' => 'Khuyến mãi hot',
                'message' => 'Giảm 20% tất cả món nướng trong tuần này.',
                'type' => 'promotion',
                'priority' => 'normal',
                'scope' => 'all',
            ],
            [
                'title' => 'Thiếu nguyên liệu',
                'message' => 'Nguyên liệu Tôm sú sắp hết. Còn 3 phần.',
                'type' => 'warning',
                'priority' => 'high',
                'scope' => 'role',
                'role' => 'kitchen'
            ],
            [
                'title' => 'Ca làm việc mới',
                'message' => 'Nhân viên Trần Minh đã điểm danh vào ca sáng.',
                'type' => 'info',
                'priority' => 'low',
                'scope' => 'role',
                'role' => 'manager'
            ],
            [
                'title' => 'Cảnh báo hệ thống',
                'message' => 'Server sẽ bảo trì lúc 23:00 tối nay.',
                'type' => 'system',
                'priority' => 'high',
                'scope' => 'all',
            ],
        ];

        // Tạo 20 thông báo random dựa theo mẫu
        for ($i = 0; $i < 20; $i++) {

            $pick = $samples[array_rand($samples)];

            Notification::create([
                'title'      => $pick['title'],
                'message'    => $pick['message'],
                'type'       => $pick['type'],
                'priority'   => $pick['priority'],
                'scope'      => $pick['scope'] ?? 'all',
                'user_id'    => $pick['scope'] === 'user' ? rand(1, 5) : null,
                'role'       => $pick['scope'] === 'role' ? ($pick['role'] ?? null) : null,
                'created_by' => rand(1, 3), // giả lập admin tạo
            ]);
        }
    }
}
