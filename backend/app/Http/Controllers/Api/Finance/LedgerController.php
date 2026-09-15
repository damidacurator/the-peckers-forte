<?php

namespace App\Http\Controllers\Api\Finance;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Http\Requests\BulkChargeRequest;
use App\Http\Resources\LedgerEntryResource;
use App\Services\LedgerService;
use App\Models\PaymentType;
use Illuminate\Http\Request;
use Carbon\Carbon;

class LedgerController extends Controller
{
    protected LedgerService $ledgerService;

    public function __construct(LedgerService $ledgerService)
    {
        $this->ledgerService = $ledgerService;
    }

    public function memberLedger(Request $request, ?Member $member = null)
    {
        $targetMember = $member ?? $request->user()->member;
        
        $from = $request->has('from') ? Carbon::parse($request->from) : null;
        $to = $request->has('to') ? Carbon::parse($request->to) : null;

        $entries = $this->ledgerService->getStatement($targetMember, $from, $to);
        return LedgerEntryResource::collection($entries);
    }

    public function downloadStatement(Request $request, ?Member $member = null)
    {
        $targetMember = $member ?? $request->user()->member;
        
        $pdfContent = "Statement PDF Content for " . $targetMember->full_name;
        return response($pdfContent, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="statement.pdf"'
        ]);
    }

    public function chargeMember(Request $request)
    {
        $request->validate([
            'member_id' => 'required|exists:members,id',
            'payment_type_id' => 'required|exists:payment_types,id',
            'amount' => 'required|numeric',
            'description' => 'required|string',
        ]);

        $member = Member::findOrFail($request->member_id);
        $paymentType = PaymentType::findOrFail($request->payment_type_id);
        
        $entry = $this->ledgerService->chargeMember($member, $paymentType, $request->amount, $request->description);
        return new LedgerEntryResource($entry);
    }

    public function bulkCharge(BulkChargeRequest $request)
    {
        $paymentType = PaymentType::findOrFail($request->payment_type_id);
        $count = $this->ledgerService->bulkCharge($paymentType, $request->amount, $request->description, $request->wing);
        
        return response()->json(['message' => "Bulk charge applied to {$count} members."]);
    }
}
