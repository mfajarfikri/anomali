<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BayController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AnomaliController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApprovalController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HarController;
use App\Http\Controllers\SubstationController;

Route::get('/', function () {
    return Inertia::render('Home');
});


Route::middleware(['auth', 'verified' ])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/anomali', [AnomaliController::class, 'index'])->name('anomali');
    Route::post('/anomali/create', [AnomaliController::class, 'create'])->name('anomali.create');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth','verified', 'is_role:Admin'])->group(function () {

    Route::get('har', [HarController::class, 'index'])->name('har');
    Route::post('har', [HarController::class, 'store'])->name('har.store');

    Route::get('/substation', [SubstationController::class, 'index'])->name('substation');
    Route::post('/substation/create', [SubstationController::class, 'create'])->name('substation.create');
    Route::post('/substation', [SubstationController::class, 'store'])->name('substation.store');
    Route::delete('/substation/{id}/delete', [SubstationController::class, 'destroy'])->name('substation.delete');
    Route::put('/substation/{id}', [SubstationController::class, 'update'])->name('substation.update');

    Route::get('/bay', [BayController::class, 'index'])->name('bay');
    Route::post('/bay', [BayController::class, 'store'])->name('bay.store');
    Route::post('/bay/edit/{id}', [BayController::class, 'edit'])->name('bay.edit');
    Route::get('/bay/create', [BayController::class, 'create'])->name('bay.create');
    Route::put('/bay/{id}', [BayController::class, 'update'])->name('bay.update');

    Route::get('/approval', [ApprovalController::class, 'index'])->name('approval');
    Route::get('/approval/update/{id}', [ApprovalController::class, 'update'])->name('approval.update');
    Route::post('/approval/approve/{id}', [ApprovalController::class, 'create'])->name('approval.approve');
    Route::delete('/approval/{id}/delete', [ApprovalController::class, 'destroy'])->name('approval.delete');
    Route::post('/approval/{id}/close', [ApprovalController::class, 'close'])->name('approval.close');


    Route::get('/user', [UserController::class, 'index'])->name('user');
    Route::get('/user/edit/{user}', [UserController::class, 'edit'])->name('user.edit');
    Route::post('/user/create', [UserController::class, 'create'])->name('user.create');
    Route::patch('/user/update/{user}', [UserController::class, 'update'])->name('user.update');

    Route::get('/substation/{substation}/edit', [SubstationController::class, 'edit'])->name('substation.edit');
    Route::patch('/substation/{substation}', [SubstationController::class, 'update'])->name('substation.update');
});

require __DIR__ . '/auth.php';
