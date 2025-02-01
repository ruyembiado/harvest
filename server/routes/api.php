<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RiceLandController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Authentcation
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);

// Rice Lands
Route::post('/add_rice_land', [RiceLandController::class, 'add_rice_land']);
Route::post('/rice_lands', [RiceLandController::class, 'get_rice_lands_by_user_id']);
Route::get('/get_rice_land/{id}', [RiceLandController::class, 'get_rice_land']);
Route::post('/update_rice_land', [RiceLandController::class, 'update_rice_land']);
Route::delete('/delete_rice_land', [RiceLandController::class, 'delete_rice_land_by_id']);