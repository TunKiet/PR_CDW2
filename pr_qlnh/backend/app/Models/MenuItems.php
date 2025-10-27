<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class menuItems extends Model
{
    use HasFactory;

    //Liên kết với bảng menu_items
    protected $table = 'menu_items';

    //Khóa chính (vì không phải là "id")
    protected $primaryKey = 'menu_item_id';

    //Cho phép gán hàng loạt các cột này
    protected $fillable = [
        'category_id',
        'menu_item_name',
        'description',
        'price',
        'image_url',
        'status',
    ];

    //Laravel mặc định có timestamps, nhưng bạn có thể bật rõ ràng
    public $timestamps = true;
}
