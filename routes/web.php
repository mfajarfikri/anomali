<?php

use App\Http\Controllers\AnomaliController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GarduController;
use App\Http\Controllers\ProfileController;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::get('/gardu',  [GarduController::class, 'index'])->name('gardu');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/user', [UserController::class, 'index'])->name('user');
    Route::get('/user/edit/{user}', [UserController::class, 'edit'])->name('user.edit');
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
