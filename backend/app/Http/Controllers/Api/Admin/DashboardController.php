<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function adminDashboard()
    {
        return response()->json([
            'total_members' => Member::count(),
            'active_members' => Member::active()->count(),
            'pending_approvals' => Member::pending()->count(),
            'total_revenue' => Payment::where('status', 'successful')->sum('amount'),
            'recent_activity' => \App\Models\AuditLog::with('user')->latest('id')->take(10)->get()
        ]);
    }

    public function treasurerDashboard()
    {
        $now = Carbon::now();
        return response()->json([
            'income_today' => Payment::where('status', 'successful')->whereDate('payment_date', $now->today())->sum('amount'),
            'income_week' => Payment::where('status', 'successful')->whereBetween('payment_date', [$now->startOfWeek(), $now->endOfWeek()])->sum('amount'),
            'income_month' => Payment::where('status', 'successful')->whereMonth('payment_date', $now->month)->sum('amount'),
            'income_year' => Payment::where('status', 'successful')->whereYear('payment_date', $now->year)->sum('amount'),
            'outstanding' => Member::whereHas('ledgerEntries')->get()->sum(fn($m) => $m->ledgerEntries()->latest('id')->value('balance') < 0 ? abs($m->ledgerEntries()->latest('id')->value('balance')) : 0)
        ]);
    }

    public function secretaryDashboard()
    {
        return response()->json([
            'pending_approvals' => Member::pending()->count(),
            'new_members_this_month' => Member::whereMonth('created_at', Carbon::now()->month)->count(),
            'total_branches' => \App\Models\Branch::count(),
        ]);
    }

    public function memberDashboard(Request $request)
    {
        $member = $request->user()->member;
        return response()->json([
            'balance' => collect($member->ledgerEntries)->last()?->balance ?? 0,
            'recent_payments' => $member->payments()->latest()->take(5)->get(),
            'notifications' => $request->user()->unreadNotifications,
        ]);
    }
}
