<?php

use App\Http\Controllers\ApiController;
use App\Http\Controllers\DashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Di sini Anda dapat mendaftarkan rute API untuk aplikasi Anda. Rute-rute
| ini dimuat oleh RouteServiceProvider dan semuanya akan
| ditugaskan ke grup middleware "api". Buatlah sesuatu yang hebat!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/auth/{any}', [DashboardController::class, 'index'])->where('any', '.*');

// Rute untuk menghitung jumlah status baru
Route::get('/jumlah-status-new', [ApiController::class, 'countNewStatus']);

// Anda dapat menambahkan rute API lainnya di sini
