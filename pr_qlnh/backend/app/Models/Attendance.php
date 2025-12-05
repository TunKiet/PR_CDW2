<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Attendance extends Model
{
    use HasFactory;

    protected $primaryKey = 'attendance_id';
    protected $table = 'attendances';

    protected $fillable = [
        'user_id',
        'employee_code',
        'date',
        'check_in',
        'check_out',
        'hours_worked',
        'status',
        'note',
    ];

    protected $casts = [
        'date' => 'date',
        'check_in' => 'datetime',
        'check_out' => 'datetime',
        'hours_worked' => 'decimal:2',
    ];

    /**
     * Relationship với User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * Chấm công vào
     */
    public static function checkIn($userId, $employeeCode)
    {
        $today = Carbon::today();
        $now = Carbon::now();
        
        // Kiểm tra đã chấm công hôm nay chưa
        $attendance = self::where('user_id', $userId)
            ->where('date', $today)
            ->first();

        if ($attendance) {
            return [
                'success' => false,
                'message' => 'Bạn đã chấm công vào hôm nay rồi',
                'data' => $attendance
            ];
        }

        // Lấy cấu hình từ config
        $workStartTime = Carbon::parse(config('attendance.work_hours.start_time'));
        $lateThreshold = Carbon::parse(config('attendance.work_hours.late_threshold'));
        $earliestCheckIn = Carbon::parse(config('attendance.check_in.earliest_time'));
        $latestCheckIn = Carbon::parse(config('attendance.check_in.latest_time'));
        
        // Kiểm tra giờ chấm công hợp lý
        if ($now->lt($earliestCheckIn)) {
            return [
                'success' => false,
                'message' => 'Chưa đến giờ chấm công (từ ' . $earliestCheckIn->format('H:i') . ' trở đi)'
            ];
        }

        if ($now->gt($latestCheckIn)) {
            return [
                'success' => false,
                'message' => 'Đã quá giờ chấm công vào (trước ' . $latestCheckIn->format('H:i') . ')'
            ];
        }

        // Xác định trạng thái
        $status = 'present';
        $note = '';
        
        if ($now->gt($lateThreshold)) {
            $status = 'late';
            $minutesLate = $now->diffInMinutes($lateThreshold);
            $note = "Đi muộn {$minutesLate} phút";
        }

        // Tạo bản ghi chấm công mới
        $attendance = self::create([
            'user_id' => $userId,
            'employee_code' => $employeeCode,
            'date' => $today,
            'check_in' => $now->format('H:i:s'),
            'status' => $status,
            'note' => $note,
        ]);

        $message = $status === 'late' 
            ? "Chấm công vào thành công. {$note}" 
            : 'Chấm công vào thành công';

        return [
            'success' => true,
            'message' => $message,
            'data' => $attendance
        ];
    }

    /**
     * Chấm công ra
     */
    public static function checkOut($userId)
    {
        $today = Carbon::today();
        $now = Carbon::now();
        
        $attendance = self::where('user_id', $userId)
            ->where('date', $today)
            ->first();

        if (!$attendance) {
            return [
                'success' => false,
                'message' => 'Bạn chưa chấm công vào hôm nay'
            ];
        }

        if ($attendance->check_out) {
            return [
                'success' => false,
                'message' => 'Bạn đã chấm công ra rồi',
                'data' => $attendance
            ];
        }

        // Lấy cấu hình từ config
        $workEndTime = Carbon::parse(config('attendance.work_hours.end_time'));
        $minWorkHours = config('attendance.hours.minimum_work_hours');
        $standardWorkHours = config('attendance.hours.standard_work_hours');
        $lunchBreakStart = Carbon::parse(config('attendance.lunch_break.start_time'));
        $lunchBreakEnd = Carbon::parse(config('attendance.lunch_break.end_time'));
        $lunchBreakHours = config('attendance.lunch_break.duration_hours');
        $earlyLeaveThreshold = config('attendance.work_hours.early_leave_threshold');

        // Kiểm tra giờ chấm công ra hợp lý
        $checkIn = Carbon::parse($attendance->check_in);
        $minCheckOutTime = $checkIn->copy()->addHours($minWorkHours);

        if ($now->lt($minCheckOutTime)) {
            return [
                'success' => false,
                'message' => "Chưa đủ thời gian làm việc tối thiểu ({$minWorkHours} giờ)"
            ];
        }

        // Tính số giờ làm việc (trừ giờ nghỉ trưa nếu có)
        $totalMinutes = $now->diffInMinutes($checkIn);
        
        // Kiểm tra có nghỉ trưa không
        $hasLunchBreak = false;
        if ($checkIn->lt($lunchBreakStart) && $now->gt($lunchBreakEnd)) {
            $hasLunchBreak = true;
            $totalMinutes -= ($lunchBreakHours * 60); // Trừ 1 giờ nghỉ trưa
        }

        $hoursWorked = $totalMinutes / 60;

        // Xác định trạng thái
        $status = $attendance->status; // Giữ nguyên status từ check-in
        $note = $attendance->note;

        // Kiểm tra về sớm
        if ($now->lt($workEndTime)) {
            $minutesEarly = $now->diffInMinutes($workEndTime);
            if ($minutesEarly > $earlyLeaveThreshold) {
                $status = 'half_day';
                $note .= ($note ? ' | ' : '') . "Về sớm {$minutesEarly} phút";
            }
        }

        // Kiểm tra thiếu giờ
        if ($hoursWorked < $standardWorkHours) {
            $missingHours = round($standardWorkHours - $hoursWorked, 2);
            $note .= ($note ? ' | ' : '') . "Thiếu {$missingHours} giờ";
        }

        $attendance->update([
            'check_out' => $now->format('H:i:s'),
            'hours_worked' => round($hoursWorked, 2),
            'status' => $status,
            'note' => $note,
        ]);

        $message = 'Chấm công ra thành công';
        if ($hoursWorked >= $standardWorkHours) {
            $message .= '. Hoàn thành đủ giờ làm việc!';
        } else {
            $message .= ". Làm được " . round($hoursWorked, 2) . " giờ";
        }

        return [
            'success' => true,
            'message' => $message,
            'data' => $attendance
        ];
    }

    /**
     * Lấy danh sách chấm công theo tháng
     */
    public static function getMonthlyAttendance($userId, $month, $year)
    {
        return self::where('user_id', $userId)
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->orderBy('date', 'asc')
            ->get();
    }

    /**
     * Tính tổng giờ làm việc trong tuần
     */
    public static function getWeeklyHours($userId, $startDate, $endDate)
    {
        return self::where('user_id', $userId)
            ->whereBetween('date', [$startDate, $endDate])
            ->sum('hours_worked');
    }

    /**
     * Tính tổng giờ làm việc trong tháng
     */
    public static function getMonthlyHours($userId, $month, $year)
    {
        return self::where('user_id', $userId)
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->sum('hours_worked');
    }

    /**
     * Lấy tất cả chấm công (cho admin/manager)
     */
    public static function getAllAttendances($filters = [])
    {
        $query = self::with('user');

        if (isset($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (isset($filters['employee_code'])) {
            $query->where('employee_code', 'like', '%' . $filters['employee_code'] . '%');
        }

        if (isset($filters['date'])) {
            $query->where('date', $filters['date']);
        }

        if (isset($filters['month']) && isset($filters['year'])) {
            $query->whereYear('date', $filters['year'])
                  ->whereMonth('date', $filters['month']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('date', 'desc')->get();
    }

    /**
     * Cập nhật chấm công (cho admin/manager)
     */
    public static function updateAttendance($attendanceId, $data)
    {
        $attendance = self::find($attendanceId);
        
        if (!$attendance) {
            return [
                'success' => false,
                'message' => 'Không tìm thấy bản ghi chấm công'
            ];
        }

        // Nếu có cập nhật giờ vào và giờ ra, tính lại số giờ làm việc
        if (isset($data['check_in']) && isset($data['check_out'])) {
            $checkIn = Carbon::parse($data['check_in']);
            $checkOut = Carbon::parse($data['check_out']);
            $data['hours_worked'] = round($checkOut->diffInMinutes($checkIn) / 60, 2);
        }

        $attendance->update($data);

        return [
            'success' => true,
            'message' => 'Cập nhật chấm công thành công',
            'data' => $attendance
        ];
    }

    /**
     * Xóa chấm công
     */
    public static function deleteAttendance($attendanceId)
    {
        $attendance = self::find($attendanceId);
        
        if (!$attendance) {
            return [
                'success' => false,
                'message' => 'Không tìm thấy bản ghi chấm công'
            ];
        }

        $attendance->delete();

        return [
            'success' => true,
            'message' => 'Xóa chấm công thành công'
        ];
    }
}
