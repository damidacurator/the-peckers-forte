<?php

namespace App\Services;

use App\Models\Member;
use App\Models\LedgerEntry;
use App\Models\PaymentType;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class LedgerService
{
    public function createEntry(Member $member, array $data): LedgerEntry
    {
        $balance = $this->getBalance($member);
        $debit = $data['debit'] ?? 0;
        $credit = $data['credit'] ?? 0;
        
        $newBalance = $balance + $debit - $credit;

        return LedgerEntry::create(array_merge($data, [
            'member_id' => $member->id,
            'balance' => $newBalance,
            'created_by' => auth()->id() ?? 1
        ]));
    }

    public function chargeMember(Member $member, PaymentType $paymentType, float $amount, string $description): LedgerEntry
    {
        return $this->createEntry($member, [
            'date' => Carbon::now(),
            'description' => $description,
            'debit' => $amount,
            'entry_type' => 'charge',
            'reference' => 'CHG-' . strtoupper(Str::random(8))
        ]);
    }

    public function bulkCharge(PaymentType $paymentType, float $amount, string $description, ?string $wing = null): int
    {
        $members = Member::active();
        if ($wing) {
            $members->forWing($wing);
        }

        $count = 0;
        foreach ($members->get() as $member) {
            $this->chargeMember($member, $paymentType, $amount, $description);
            $count++;
        }
        return $count;
    }

    public function getBalance(Member $member): float
    {
        $lastEntry = LedgerEntry::where('member_id', $member->id)->orderBy('id', 'desc')->first();
        return $lastEntry ? $lastEntry->balance : 0.00;
    }

    public function getStatement(Member $member, ?Carbon $from, ?Carbon $to): Collection
    {
        $query = LedgerEntry::where('member_id', $member->id)->orderBy('date', 'asc')->orderBy('id', 'asc');
        
        if ($from) $query->where('date', '>=', $from);
        if ($to) $query->where('date', '<=', $to);

        return $query->get();
    }

    public function calculateRunningBalance(Member $member): void
    {
        $entries = LedgerEntry::where('member_id', $member->id)->orderBy('date', 'asc')->orderBy('id', 'asc')->get();
        $balance = 0.00;

        foreach ($entries as $entry) {
            $balance = $balance + $entry->debit - $entry->credit;
            $entry->update(['balance' => $balance]);
        }
    }
}
