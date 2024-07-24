<?php

use App\Http\Controllers\AnomaliController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GarduController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;




Route::get('/', function () {
    return Inertia::render('Home');
});


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/gardu',  [GarduController::class, 'index'])->name('gardu');
    Route::get('/gardu/create',  [GarduController::class, 'create'])->name('gardu.create');
    Route::post('/gardu', [GarduController::class, 'store'])->name('gardu.store');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/user', [UserController::class, 'index'])->name('user');
    Route::get('/user/edit/{user}', [UserController::class, 'edit'])->name('user.edit');
    Route::get('/user/create', [UserController::class, 'create'])->name('user.create');
    Route::patch('/user/update/{user}', [UserController::class, 'update'])->name('user.update');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/anomali', [AnomaliController::class, 'index'])->name('anomali');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
