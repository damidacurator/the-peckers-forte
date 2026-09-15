<?php

namespace App\Http\Controllers\Api\Payment;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\PaymentType;
use App\Models\Receipt;
use App\Http\Requests\InitiatePaymentRequest;
use App\Http\Requests\RecordManualPaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Services\PaymentService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    protected PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function initiate(InitiatePaymentRequest $request)
    {
        $member = $request->user()->member;
        $paymentType = PaymentType::findOrFail($request->payment_type_id);
        
        $data = $this->paymentService->initiateRexPay($member, $paymentType, $request->amount);
        
        return response()->json($data);
    }

    public function verify(string $reference)
    {
        $payment = $this->paymentService->verifyPayment($reference);
        return new PaymentResource($payment);
    }

    public function callback(Request $request)
    {
        $this->paymentService->handleCallback($request->all());
        return response()->json(['status' => 'success']);
    }

    public function history(Request $request)
    {
        $query = Payment::with('paymentType')->where('member_id', $request->user()->member->id)->orderBy('id', 'desc');
        
        if ($request->has('status')) $query->where('status', $request->status);
        
        return PaymentResource::collection($query->paginate(15));
    }

    public function recordManual(RecordManualPaymentRequest $request)
    {
        $payment = $this->paymentService->recordManualPayment($request->validated());
        return new PaymentResource($payment);
    }

    public function downloadReceipt(Receipt $receipt)
    {
        if ($receipt->member_id !== auth()->user()->member->id && !auth()->user()->hasRole('Super Admin')) {
            abort(403);
        }
        
        // Mock PDF response
        $pdfContent = "Receipt PDF Content for " . $receipt->receipt_number;
        return response($pdfContent, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$receipt->receipt_number.'.pdf"'
        ]);
    }
}
