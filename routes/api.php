<?php

use App\Models\WorkSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TeamMemberController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\WorkSessionController;

Route::post('/login', [AuthController::class, 'login']);




Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{project}', [ProjectController::class, 'show']);
    Route::put('/projects/{project}', [ProjectController::class, 'update']);
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
    Route::put('/projects/{project}/start', [ProjectController::class, 'start']);
    Route::put('/projects/{project}/pause', [ProjectController::class, 'pause']);
    Route::put('/projects/{project}/resume', [ProjectController::class, 'resume']);
    Route::put('/projects/{project}/complete', [ProjectController::class, 'complete']);
Route::get('/team-members', [TeamMemberController::class, 'index']);
Route::post('/team-members', [TeamMemberController::class, 'store']);
    Route::put('/team-members/{teamMember}', [TeamMemberController::class, 'update']);
    Route::delete('/team-members/{teamMember}', [TeamMemberController::class, 'destroy']);
    Route::get('/team-members/{teamMember}/sessions', [TeamMemberController::class, 'sessions']);

Route::get('/projects/{project}/team-work', [WorkSessionController::class, 'index']);
Route::get('/projects/{project}/finished-sessions', [WorkSessionController::class, 'finishedSessions']);
Route::post('/projects/{project}/team-members/{teamMember}/start-work', [WorkSessionController::class, 'start']);
Route::put('/work-sessions/{workSession}/finish-work', [WorkSessionController::class, 'finish']);
Route::get('/projects/{project}/activity-logs', [ProjectController::class, 'getActivityLogs']);
Route::post('/projects/{project}/activity-logs', [ProjectController::class, 'storeActivityLog']);
Route::get('/projects/{project}/payments', [ProjectController::class, 'getPayments']);
Route::post('/projects/{project}/payments', [ProjectController::class, 'storePayment']);
    });