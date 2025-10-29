<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MenuItem; // ⚠️ Quan trọng: import đúng model

class MenuItemController extends Controller
{
    public function index()
    {
        $menuItems = MenuItem::with('category')->get();
        return response()->json($menuItems);
    }
}
