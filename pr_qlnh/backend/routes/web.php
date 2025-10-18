<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/monan', function () {
    return view('08_hao_QLMonAn.chitiet');
});

Route::get('/chitiet', function () {
    return view('08_hao_QLMonAn.chitiet');
});

route::get('/QLTThongTin', function () {
    return view('08_hao_QLMonAn.quanlytrangthongtin');
});