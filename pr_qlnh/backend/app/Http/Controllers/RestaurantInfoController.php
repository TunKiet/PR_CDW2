<?php

namespace App\Http\Controllers;

use App\Models\RestaurantInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RestaurantInfoController extends Controller
{
    /**
     * Lấy thông tin nhà hàng (chỉ có 1 bản ghi)
     */
    public function index()
    {
        $info = RestaurantInfo::first();
        
        if (!$info) {
            // Tạo bản ghi mặc định nếu chưa có
            $info = RestaurantInfo::create([
                'name' => 'Nhà hàng của bạn',
                'currency' => 'VND',
                'timezone' => 'Asia/Ho_Chi_Minh',
                'is_active' => true,
            ]);
        }
        
        return response()->json($info);
    }

    /**
     * Cập nhật thông tin nhà hàng
     */
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'description' => 'nullable|string',
            'website' => 'nullable|url|max:255',
            'facebook' => 'nullable|url|max:255',
            'instagram' => 'nullable|url|max:255',
            'opening_time' => 'nullable|date_format:H:i',
            'closing_time' => 'nullable|date_format:H:i',
            'currency' => 'nullable|string|max:10',
            'timezone' => 'nullable|string|max:50',
            'is_active' => 'nullable|boolean',
        ]);

        $info = RestaurantInfo::first();
        
        if (!$info) {
            $info = RestaurantInfo::create($request->all());
        } else {
            $info->update($request->all());
        }

        return response()->json([
            'message' => 'Cập nhật thông tin nhà hàng thành công!',
            'data' => $info
        ]);
    }

    /**
     * Upload logo
     */
    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $info = RestaurantInfo::first();
        if (!$info) {
            $info = RestaurantInfo::create([
                'name' => 'Nhà hàng của bạn',
            ]);
        }

        // Xóa logo cũ nếu có
        if ($info->logo && Storage::disk('public')->exists($info->logo)) {
            Storage::disk('public')->delete($info->logo);
        }

        // Lưu logo mới
        $path = $request->file('logo')->store('restaurant', 'public');
        $info->update(['logo' => $path]);

        return response()->json([
            'message' => 'Upload logo thành công!',
            'logo' => $path,
            'url' => Storage::url($path)
        ]);
    }

    /**
     * Xóa logo
     */
    public function deleteLogo()
    {
        $info = RestaurantInfo::first();
        
        if ($info && $info->logo) {
            if (Storage::disk('public')->exists($info->logo)) {
                Storage::disk('public')->delete($info->logo);
            }
            $info->update(['logo' => null]);
            
            return response()->json([
                'message' => 'Xóa logo thành công!'
            ]);
        }

        return response()->json([
            'message' => 'Không có logo để xóa'
        ], 404);
    }
}
