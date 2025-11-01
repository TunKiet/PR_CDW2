<?php

// app/Http/Resources/MenuItemResource.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Ánh xạ các trường DB sang cấu trúc JSON mong muốn của React
        return [
            // DB: menu_item_id => React: id
            'id' => $this->menu_item_id, 
            
            // DB: menu_item_name => React: name
            'name' => $this->menu_item_name,
            
            // DB: category_id => React: categoryKey (Giả định category_id là key bạn cần)
            'categoryKey' => $this->category_id, 
            
            // DB: price => React: price
            'price' => (float) $this->price, 
            
            // DB: image_url => React: image
            'image' => $this->image_url, 
            
            // DB: status => React: statusKey
            'statusKey' => $this->status,   
            
            'description' => $this->description,
            'created_at' => $this->created_at,
        ];
    }
}