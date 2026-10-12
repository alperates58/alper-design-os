<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/dashboard');
});

Route::get('/login', function () {
    return view('auth.login');
})->name('login');

Route::post('/login', function () {
    // Authenticate operator and issue session cookie
})->middleware('web');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    });

    Route::get('/records', function () {
        return view('records.index');
    });

    Route::post('/records/update', function () {
        // Business logic record update
    });
});
