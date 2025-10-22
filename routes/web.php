<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ListController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\Auth\ProvideRedirectController;
use App\Http\Controllers\Auth\ProvideCallbackController;

Route::get('/auth/{provider}/redirect', ProvideRedirectController::class)->name('auth.redirect');
Route::get('/auth/{provider}/callback', ProvideCallbackController::class)->name('auth.callback');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('/lists', ListController::class);
    Route::resource('/tasks', TaskController::class);
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
