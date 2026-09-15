<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Member\MemberController;
use App\Http\Controllers\Api\Payment\PaymentController;
use App\Http\Controllers\Api\Finance\LedgerController;
use App\Http\Controllers\Api\Finance\AccountingController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\SettingsController;
use App\Http\Controllers\Api\Admin\AuditLogController;
use App\Http\Controllers\Api\Public\PublicController;

// Public Routes
Route::get('/home', [PublicController::class, 'home']);
Route::get('/about', [PublicController::class, 'about']);
Route::get('/executives', [PublicController::class, 'executives']);
Route::get('/announcements', [PublicController::class, 'announcements']);
Route::get('/events', [PublicController::class, 'events']);
Route::get('/gallery', [PublicController::class, 'gallery']);
Route::post('/contact', [PublicController::class, 'contact']);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

Route::post('/payments/callback', [PaymentController::class, 'callback']);

// Authenticated Routes
Route::middleware(['auth:sanctum', 'App\Http\Middleware\TrackLastLogin'])->group(function () {
    
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

    // Member Routes (Requires Active Status)
    Route::middleware('App\Http\Middleware\EnsureMemberIsActive')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'memberDashboard']);
        Route::post('/profile/upload-photo', [AuthController::class, 'uploadPhoto']);
        
        Route::get('/ledger', [LedgerController::class, 'memberLedger']);
        Route::get('/ledger/statement', [LedgerController::class, 'downloadStatement']);
        
        Route::post('/payments/initiate', [PaymentController::class, 'initiate']);
        Route::get('/payments/verify/{ref}', [PaymentController::class, 'verify']);
        Route::get('/payments/history', [PaymentController::class, 'history']);
        
        Route::get('/receipts/{receipt}/download', [PaymentController::class, 'downloadReceipt']);
    });

    // Secretary / Admin Routes
    Route::middleware('role:Secretary|Super Admin')->group(function () {
        Route::get('/secretary/dashboard', [DashboardController::class, 'secretaryDashboard']);
        Route::get('/members', [MemberController::class, 'index']);
        Route::get('/members/pending', [MemberController::class, 'pendingApprovals']);
        Route::post('/members/{member}/approve', [MemberController::class, 'approve']);
        Route::post('/members/{member}/reject', [MemberController::class, 'reject']);
        Route::post('/members/{member}/suspend', [MemberController::class, 'suspend']);
        Route::post('/members/{member}/activate', [MemberController::class, 'activate']);
    });

    // Treasurer / Admin Routes
    Route::middleware('role:Treasurer|Super Admin')->group(function () {
        Route::get('/treasurer/dashboard', [DashboardController::class, 'treasurerDashboard']);
        Route::post('/ledger/charge', [LedgerController::class, 'chargeMember']);
        Route::post('/ledger/bulk-charge', [LedgerController::class, 'bulkCharge']);
        Route::post('/payments/record-manual', [PaymentController::class, 'recordManual']);
        
        Route::get('/accounting/cashbook', [AccountingController::class, 'cashBook']);
        Route::get('/accounting/trial-balance', [AccountingController::class, 'trialBalance']);
        Route::get('/accounting/income-expenditure', [AccountingController::class, 'incomeExpenditure']);
        Route::get('/accounting/balance-sheet', [AccountingController::class, 'balanceSheet']);
        Route::get('/reports/export', [AccountingController::class, 'exportReport']);
    });

    // Super Admin Routes
    Route::middleware('role:Super Admin')->group(function () {
        Route::get('/admin/dashboard', [DashboardController::class, 'adminDashboard']);
        Route::get('/admin/settings', [SettingsController::class, 'index']);
        Route::put('/admin/settings', [SettingsController::class, 'update']);
        Route::get('/admin/audit-logs', [AuditLogController::class, 'index']);
    });
});
