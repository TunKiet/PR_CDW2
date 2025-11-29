<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    /**
     * Chấm công vào
     */
    public function checkIn(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,user_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        // Lấy thông tin user
        $user = User::find($request->user_id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy nhân viên'
            ], 404);
        }

        // Sử dụng user_id làm employee_code
        $result = Attendance::checkIn($user->user_id, $user->user_id);

        return response()->json($result, $result['success'] ? 200 : 400);
    }

    /**
     * Chấm công ra
     */
    public function checkOut(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,user_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        // Lấy thông tin user
        $user = User::find($request->user_id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy nhân viên'
            ], 404);
        }

        $result = Attendance::checkOut($user->user_id);

        return response()->json($result, $result['success'] ? 200 : 400);
    }

    /**
     * Lấy trạng thái chấm công hôm nay của nhân viên
     */
    public function getTodayStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,user_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::find($request->user_id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy nhân viên'
            ], 404);
        }

        $today = Carbon::today();
        $attendance = Attendance::where('user_id', $user->user_id)
            ->where('date', $today)
            ->first();

        return response()->json([
            'success' => true,
            'data' => $attendance,
            'user' => [
                'user_id' => $user->user_id,
                'full_name' => $user->full_name,
                'email' => $user->email,
            ],
            'has_checked_in' => $attendance ? true : false,
            'has_checked_out' => $attendance && $attendance->check_out ? true : false,
        ]);
    }

    /**
     * Lấy danh sách chấm công theo tháng (cho nhân viên)
     */
    public function getMonthlyAttendance(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,user_id',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $attendances = Attendance::getMonthlyAttendance(
            $request->user_id,
            $request->month,
            $request->year
        );

        // Tính tổng giờ làm việc trong tháng
        $totalHours = Attendance::getMonthlyHours(
            $request->user_id,
            $request->month,
            $request->year
        );

        // Tính số ngày làm việc
        $workDays = $attendances->count();

        return response()->json([
            'success' => true,
            'data' => $attendances,
            'summary' => [
                'total_hours' => round($totalHours, 2),
                'work_days' => $workDays,
                'average_hours_per_day' => $workDays > 0 ? round($totalHours / $workDays, 2) : 0,
            ]
        ]);
    }

    /**
     * Lấy tổng giờ làm việc trong tuần
     */
    public function getWeeklyHours(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,user_id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $totalHours = Attendance::getWeeklyHours(
            $request->user_id,
            $request->start_date,
            $request->end_date
        );

        $attendances = Attendance::where('user_id', $request->user_id)
            ->whereBetween('date', [$request->start_date, $request->end_date])
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $attendances,
            'total_hours' => round($totalHours, 2),
            'work_days' => $attendances->count(),
        ]);
    }

    /**
     * Lấy tất cả chấm công (cho admin/manager)
     */
    public function index(Request $request)
    {
        $filters = $request->only(['user_id', 'employee_code', 'date', 'month', 'year', 'status']);
        
        $attendances = Attendance::getAllAttendances($filters);

        return response()->json([
            'success' => true,
            'data' => $attendances,
            'total' => $attendances->count(),
        ]);
    }

    /**
     * Lấy chi tiết một bản ghi chấm công
     */
    public function show($id)
    {
        $attendance = Attendance::with('user')->find($id);

        if (!$attendance) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bản ghi chấm công'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $attendance
        ]);
    }

    /**
     * Tạo bản ghi chấm công thủ công (cho admin/manager)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,user_id',
            'employee_code' => 'required|string|max:50',
            'date' => 'required|date',
            'check_in' => 'required|date_format:H:i:s',
            'check_out' => 'nullable|date_format:H:i:s|after:check_in',
            'status' => 'nullable|in:present,absent,late,half_day',
            'note' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();

        // Tính số giờ làm việc nếu có giờ ra
        if ($request->check_out) {
            $checkIn = Carbon::parse($request->check_in);
            $checkOut = Carbon::parse($request->check_out);
            $data['hours_worked'] = round($checkOut->diffInMinutes($checkIn) / 60, 2);
        }

        $attendance = Attendance::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Tạo bản ghi chấm công thành công',
            'data' => $attendance
        ], 201);
    }

    /**
     * Cập nhật chấm công (cho admin/manager)
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'check_in' => 'nullable|date_format:H:i:s',
            'check_out' => 'nullable|date_format:H:i:s',
            'status' => 'nullable|in:present,absent,late,half_day',
            'note' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $result = Attendance::updateAttendance($id, $request->all());

        return response()->json($result, $result['success'] ? 200 : 404);
    }

    /**
     * Xóa chấm công (cho admin/manager)
     */
    public function destroy($id)
    {
        $result = Attendance::deleteAttendance($id);

        return response()->json($result, $result['success'] ? 200 : 404);
    }

    /**
     * Lấy báo cáo chấm công tổng hợp
     */
    public function getReport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        // Lấy tất cả nhân viên
        $users = User::with('roles')->get();
        
        $report = [];

        foreach ($users as $user) {
            $attendances = Attendance::getMonthlyAttendance(
                $user->user_id,
                $request->month,
                $request->year
            );

            $totalHours = Attendance::getMonthlyHours(
                $user->user_id,
                $request->month,
                $request->year
            );

            $report[] = [
                'user_id' => $user->user_id,
                'employee_code' => $user->username,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name'),
                'work_days' => $attendances->count(),
                'total_hours' => round($totalHours, 2),
                'average_hours_per_day' => $attendances->count() > 0 
                    ? round($totalHours / $attendances->count(), 2) 
                    : 0,
                'attendances' => $attendances,
            ];
        }

        return response()->json([
            'success' => true,
            'month' => $request->month,
            'year' => $request->year,
            'data' => $report,
        ]);
    }
}
