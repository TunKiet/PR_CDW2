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
    public function show($id)
    {
    $item = MenuItem::find($id);

    if (!$item) {
        return response()->json(['message' => 'Menu item not found'], 404);
    }

    return response()->json($item);
}

}
