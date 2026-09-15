<?php

namespace App\Services;

use App\Models\LedgerEntry;
use App\Models\GeneralLedger;
use App\Models\Member;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class ReportService
{
    public function cashBook(?Carbon $from, ?Carbon $to): array
    {
        $query = GeneralLedger::with('account')->orderBy('date', 'asc');
        
        if ($from) $query->where('date', '>=', $from);
        if ($to) $query->where('date', '<=', $to);
        
        $entries = $query->get();
        $totalDebit = $entries->sum('debit');
        $totalCredit = $entries->sum('credit');

        return [
            'entries' => $entries,
            'total_debit' => $totalDebit,
            'total_credit' => $totalCredit,
            'net_flow' => $totalDebit - $totalCredit,
        ];
    }

    public function trialBalance(?Carbon $asAt): array
    {
        $query = GeneralLedger::with('account');
        if ($asAt) {
            $query->where('date', '<=', $asAt);
        }

        $balances = $query->get()->groupBy('account_id')->map(function ($entries) {
            $debit = $entries->sum('debit');
            $credit = $entries->sum('credit');
            $account = $entries->first()->account;
            
            // Determine normal balance based on account type
            $balance = 0;
            if (in_array($account->type, ['asset', 'expense'])) {
                $balance = $debit - $credit;
            } else {
                $balance = $credit - $debit;
            }
            
            return [
                'account' => $account,
                'debit_total' => $debit,
                'credit_total' => $credit,
                'balance' => $balance
            ];
        })->values();

        return [
            'accounts' => $balances,
            'total_debit' => $balances->sum('debit_total'),
            'total_credit' => $balances->sum('credit_total'),
        ];
    }

    public function incomeAndExpenditure(?Carbon $from, ?Carbon $to): array
    {
        $query = GeneralLedger::whereHas('account', function($q) {
            $q->whereIn('type', ['income', 'expense']);
        });

        if ($from) $query->where('date', '>=', $from);
        if ($to) $query->where('date', '<=', $to);

        $entries = $query->get();
        $incomes = $entries->where('account.type', 'income')->sum('credit') - $entries->where('account.type', 'income')->sum('debit');
        $expenses = $entries->where('account.type', 'expense')->sum('debit') - $entries->where('account.type', 'expense')->sum('credit');

        return [
            'total_income' => $incomes,
            'total_expense' => $expenses,
            'surplus_deficit' => $incomes - $expenses,
        ];
    }

    public function balanceSheet(?Carbon $asAt): array
    {
        $tb = $this->trialBalance($asAt);
        
        $assets = collect($tb['accounts'])->where('account.type', 'asset');
        $liabilities = collect($tb['accounts'])->where('account.type', 'liability');
        $equity = collect($tb['accounts'])->where('account.type', 'equity');

        return [
            'assets' => [
                'items' => $assets,
                'total' => $assets->sum('balance')
            ],
            'liabilities' => [
                'items' => $liabilities,
                'total' => $liabilities->sum('balance')
            ],
            'equity' => [
                'items' => $equity,
                'total' => $equity->sum('balance')
            ]
        ];
    }

    public function memberReport(array $filters): Collection
    {
        $query = Member::query();
        if (isset($filters['status'])) $query->where('status', $filters['status']);
        if (isset($filters['wing'])) $query->where('wing', $filters['wing']);
        return $query->get();
    }

    public function outstandingReport(): Collection
    {
        // Get members with negative balance
        return Member::whereHas('ledgerEntries', function($q) {
            // Complex logic for outstanding, simplified here
        })->get();
    }

    public function exportToExcel(string $reportType, array $params): string
    {
        return "storage/exports/{$reportType}_" . time() . ".xlsx";
    }

    public function exportToPdf(string $reportType, array $params): string
    {
        return "storage/exports/{$reportType}_" . time() . ".pdf";
    }
}
