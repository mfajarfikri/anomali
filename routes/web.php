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

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/anomali', [AnomaliController::class, 'index'])->name('anomali');
    Route::post('/anomali/create', [AnomaliController::class, 'create'])->name('anomali.create');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'is_role:Admin'])->group(function () {
    Route::get('/gardu', [GarduController::class, 'index'])->name('gardu');
    Route::get('/gardu/create', [GarduController::class, 'create'])->name('gardu.create');
    Route::post('/gardu', [GarduController::class, 'store'])->name('gardu.store');
    Route::delete('/gardu/{id}/delete', [GarduController::class, 'destroy'])->name('gardu.delete');

    Route::get('/user', [UserController::class, 'index'])->name('user');
    Route::get('/user/edit/{user}', [UserController::class, 'edit'])->name('user.edit');
    Route::post('/user/create', [UserController::class, 'create'])->name('user.create');
    Route::patch('/user/update/{user}', [UserController::class, 'update'])->name('user.update');
});

require __DIR__ . '/auth.php';
