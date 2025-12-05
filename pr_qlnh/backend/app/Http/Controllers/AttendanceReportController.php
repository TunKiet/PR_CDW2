<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AttendanceReportController extends Controller
{
    /**
     * Test endpoint để kiểm tra dữ liệu
     */
    public function testData(Request $request)
    {
        try {
            $month = $request->month ?? date('n');
            $year = $request->year ?? date('Y');
            
            $attendances = Attendance::with('user')
                ->whereYear('date', $year)
                ->whereMonth('date', $month)
                ->orderBy('date')
                ->get();
            
            return response()->json([
                'success' => true,
                'count' => $attendances->count(),
                'data' => $attendances->map(function($a) {
                    return [
                        'id' => $a->attendance_id,
                        'employee_code' => $a->employee_code,
                        'user_name' => $a->user->full_name ?? 'N/A',
                        'date' => $a->date,
                        'check_in' => $a->check_in,
                        'check_out' => $a->check_out,
                        'status' => $a->status,
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
    
    /**
     * Xuất báo cáo chấm công theo ngày
     */
    public function exportByDate(Request $request)
    {
        $request->validate([
            'date' => 'required|date'
        ]);

        $date = Carbon::parse($request->date);
        $attendances = Attendance::with('user')
            ->whereDate('date', $date)
            ->orderBy('check_in')
            ->get();

        return $this->generateExcel($attendances, "Báo cáo chấm công ngày {$date->format('d-m-Y')}");
    }

    /**
     * Xuất báo cáo chấm công theo tháng
     */
    public function exportByMonth(Request $request)
    {
        $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2020'
        ]);

        $month = $request->month;
        $year = $request->year;

        $attendances = Attendance::with('user')
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->orderBy('date')
            ->orderBy('check_in')
            ->get();

        return $this->generateExcel($attendances, "Báo cáo chấm công tháng {$month}-{$year}");
    }

    /**
     * Xuất báo cáo chấm công theo khoảng thời gian
     */
    public function exportByRange(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date'
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);

        $attendances = Attendance::with('user')
            ->whereBetween('date', [$startDate, $endDate])
            ->orderBy('date')
            ->orderBy('check_in')
            ->get();

        return $this->generateExcel(
            $attendances, 
            "Báo cáo chấm công từ {$startDate->format('d-m-Y')} đến {$endDate->format('d-m-Y')}"
        );
    }

    /**
     * Tạo file Excel (CSV format - không cần GD extension)
     */
    private function generateExcel($attendances, $title)
    {
        try {
            // Sử dụng CSV thay vì XLSX để tránh lỗi GD extension
            $fileName = $this->sanitizeFileName($title) . '_' . time() . '.csv';
            
            $headers = [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
                'Cache-Control' => 'max-age=0',
            ];

            $callback = function() use ($attendances, $title) {
                $file = fopen('php://output', 'w');
                
                // BOM cho UTF-8
                fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
                
                // Tiêu đề
                fputcsv($file, [$title]);
                fputcsv($file, ['Ngày xuất: ' . Carbon::now()->format('d/m/Y H:i:s')]);
                fputcsv($file, []); // Dòng trống
                
                // Header bảng
                fputcsv($file, ['STT', 'Mã NV', 'Họ tên', 'Ngày', 'Giờ vào', 'Giờ ra', 'Số giờ', 'Trạng thái']);
                
                // Dữ liệu
                $stt = 1;
                foreach ($attendances as $attendance) {
                    $row = [
                        $stt++,
                        $attendance->employee_code ?? '—',
                        $attendance->user->full_name ?? 'N/A',
                        $this->formatDate($attendance->date),
                        $this->formatTime($attendance->check_in),
                        $this->formatTime($attendance->check_out),
                        $attendance->hours_worked ?? '—',
                        $this->getStatusText($attendance->status ?? 'N/A'),
                    ];
                    fputcsv($file, $row);
                }
                
                // Tổng kết
                fputcsv($file, []);
                fputcsv($file, ['Tổng số bản ghi:', count($attendances)]);
                
                fclose($file);
            };

            return response()->stream($callback, 200, $headers);
            
        } catch (\Exception $e) {
            \Log::error('CSV export error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Lỗi xuất file CSV: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Format date safely
     */
    private function formatDate($date)
    {
        try {
            return $date instanceof \DateTime 
                ? $date->format('d/m/Y')
                : Carbon::parse($date)->format('d/m/Y');
        } catch (\Exception $e) {
            return '—';
        }
    }
    
    /**
     * Format time safely
     */
    private function formatTime($time)
    {
        if (!$time) return '—';
        
        try {
            return $time instanceof \DateTime
                ? $time->format('H:i:s')
                : Carbon::parse($time)->format('H:i:s');
        } catch (\Exception $e) {
            return '—';
        }
    }
    
    /**
     * Tạo file Excel với PhpSpreadsheet (cần GD extension)
     */
    private function generateExcelOld($attendances, $title)
    {
        try {
            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();

            // Thiết lập tiêu đề
            $sheet->setCellValue('A1', $title);
            $sheet->mergeCells('A1:H1');
            $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
            $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

            // Thông tin xuất file
            $sheet->setCellValue('A2', 'Ngày xuất: ' . Carbon::now()->format('d/m/Y H:i:s'));
            $sheet->mergeCells('A2:H2');
            $sheet->getStyle('A2')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

            // Header bảng
            $headers = ['STT', 'Mã NV', 'Họ tên', 'Ngày', 'Giờ vào', 'Giờ ra', 'Số giờ', 'Trạng thái'];
            $column = 'A';
            foreach ($headers as $header) {
                $sheet->setCellValue($column . '4', $header);
                $column++;
            }

            // Style cho header
            $headerStyle = [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4472C4']
                ],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => '000000']
                    ]
                ]
            ];
            $sheet->getStyle('A4:H4')->applyFromArray($headerStyle);

            // Dữ liệu
            $row = 5;
            $stt = 1;
            foreach ($attendances as $attendance) {
                $sheet->setCellValue('A' . $row, $stt++);
                $sheet->setCellValue('B' . $row, $attendance->employee_code ?? '—');
                $sheet->setCellValue('C' . $row, $attendance->user->full_name ?? 'N/A');
                
                // Parse date safely
                try {
                    $dateValue = $attendance->date instanceof \DateTime 
                        ? $attendance->date->format('d/m/Y')
                        : Carbon::parse($attendance->date)->format('d/m/Y');
                    $sheet->setCellValue('D' . $row, $dateValue);
                } catch (\Exception $e) {
                    $sheet->setCellValue('D' . $row, '—');
                }
                
                // Parse check_in safely
                try {
                    if ($attendance->check_in) {
                        $checkInValue = $attendance->check_in instanceof \DateTime
                            ? $attendance->check_in->format('H:i:s')
                            : Carbon::parse($attendance->check_in)->format('H:i:s');
                        $sheet->setCellValue('E' . $row, $checkInValue);
                    } else {
                        $sheet->setCellValue('E' . $row, '—');
                    }
                } catch (\Exception $e) {
                    $sheet->setCellValue('E' . $row, '—');
                }
                
                // Parse check_out safely
                try {
                    if ($attendance->check_out) {
                        $checkOutValue = $attendance->check_out instanceof \DateTime
                            ? $attendance->check_out->format('H:i:s')
                            : Carbon::parse($attendance->check_out)->format('H:i:s');
                        $sheet->setCellValue('F' . $row, $checkOutValue);
                    } else {
                        $sheet->setCellValue('F' . $row, '—');
                    }
                } catch (\Exception $e) {
                    $sheet->setCellValue('F' . $row, '—');
                }
                
                $sheet->setCellValue('G' . $row, $attendance->hours_worked ?? '—');
                $sheet->setCellValue('H' . $row, $this->getStatusText($attendance->status ?? 'N/A'));

                // Style cho dữ liệu
                $sheet->getStyle('A' . $row . ':H' . $row)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => 'CCCCCC']
                        ]
                    ]
                ]);

                // Màu nền theo trạng thái
                $statusColor = $this->getStatusColor($attendance->status ?? '');
                if ($statusColor) {
                    $sheet->getStyle('H' . $row)->applyFromArray([
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'startColor' => ['rgb' => $statusColor]
                        ]
                    ]);
                }

                $row++;
            }

            // Tổng kết
            $totalRow = $row + 1;
            $sheet->setCellValue('A' . $totalRow, 'Tổng số bản ghi:');
            $sheet->setCellValue('B' . $totalRow, count($attendances));
            $sheet->getStyle('A' . $totalRow . ':B' . $totalRow)->getFont()->setBold(true);

            // Tự động điều chỉnh độ rộng cột
            foreach (range('A', 'H') as $col) {
                $sheet->getColumnDimension($col)->setAutoSize(true);
            }

            // Tạo file và trả về
            $fileName = $this->sanitizeFileName($title) . '_' . time() . '.xlsx';
            $writer = new Xlsx($spreadsheet);
            
            // Tạo response để download
            return response()->streamDownload(function() use ($writer) {
                $writer->save('php://output');
            }, $fileName, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Cache-Control' => 'max-age=0',
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Excel export error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Lỗi xuất file Excel: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy text trạng thái
     */
    private function getStatusText($status)
    {
        $statuses = [
            'present' => 'Đúng giờ',
            'late' => 'Đi muộn',
            'early_leave' => 'Về sớm',
            'absent' => 'Vắng mặt',
            'on_leave' => 'Nghỉ phép',
            'working' => 'Đang làm việc'
        ];

        return $statuses[$status] ?? $status;
    }

    /**
     * Lấy màu theo trạng thái
     */
    private function getStatusColor($status)
    {
        $colors = [
            'present' => '90EE90',      // Xanh lá nhạt
            'late' => 'FFD700',         // Vàng
            'early_leave' => 'FFA500',  // Cam
            'absent' => 'FF6B6B',       // Đỏ
            'on_leave' => 'ADD8E6',     // Xanh dương nhạt
            'working' => 'E0E0E0'       // Xám
        ];

        return $colors[$status] ?? null;
    }

    /**
     * Làm sạch tên file
     */
    private function sanitizeFileName($fileName)
    {
        $fileName = str_replace(['/', '\\', ':', '*', '?', '"', '<', '>', '|'], '_', $fileName);
        $fileName = preg_replace('/\s+/', '_', $fileName);
        return $fileName;
    }
}
