<?php

namespace App\Services;

use App\Models\Member;
use App\Models\Payment;
use App\Models\PaymentType;
use App\Models\Receipt;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PaymentService
{
    protected LedgerService $ledgerService;
    protected NotificationService $notificationService;

    public function __construct(LedgerService $ledgerService, NotificationService $notificationService)
    {
        $this->ledgerService = $ledgerService;
        $this->notificationService = $notificationService;
    }

    public function initiateRexPay(Member $member, PaymentType $paymentType, float $amount): array
    {
        // Integration with Accelerex RexPay API
        $reference = 'REX-' . strtoupper(Str::random(10));
        
        $payment = Payment::create([
            'member_id' => $member->id,
            'payment_type_id' => $paymentType->id,
            'amount' => $amount,
            'payment_date' => Carbon::now(),
            'payment_method' => 'card',
            'gateway' => 'rexpay',
            'transaction_reference' => $reference,
            'status' => 'pending',
        ]);

        return [
            'payment_id' => $payment->id,
            'reference' => $reference,
            'checkout_url' => env('APP_URL') . '/payment-checkout-mock' // Mock URL
        ];
    }

    public function verifyPayment(string $reference): Payment
    {
        $payment = Payment::where('transaction_reference', $reference)->firstOrFail();
        
        if ($payment->status === 'pending') {
            // Mock API Verification
            $this->processSuccessfulPayment($payment);
        }
        
        return $payment;
    }

    public function handleCallback(array $data): void
    {
        if (isset($data['reference']) && isset($data['status']) && $data['status'] === 'success') {
            $this->verifyPayment($data['reference']);
        }
    }

    public function recordManualPayment(array $data): Payment
    {
        $payment = Payment::create([
            'member_id' => $data['member_id'],
            'payment_type_id' => $data['payment_type_id'],
            'amount' => $data['amount'],
            'payment_date' => $data['payment_date'],
            'payment_method' => $data['payment_method'],
            'transaction_reference' => 'MAN-' . strtoupper(Str::random(10)),
            'status' => 'successful',
            'recorded_by' => auth()->id() ?? 1,
            'verified_at' => Carbon::now()
        ]);

        $this->processSuccessfulPayment($payment);

        return $payment;
    }

    public function processSuccessfulPayment(Payment $payment): void
    {
        if ($payment->status !== 'successful') {
            $payment->update(['status' => 'successful', 'verified_at' => Carbon::now()]);
            
            // Create Ledger Entry
            $this->ledgerService->createEntry($payment->member, [
                'payment_id' => $payment->id,
                'date' => Carbon::now(),
                'description' => 'Payment for ' . $payment->paymentType->name,
                'credit' => $payment->amount,
                'entry_type' => 'payment',
                'reference' => $payment->transaction_reference
            ]);

            // Generate Receipt
            $receipt = Receipt::create([
                'receipt_number' => 'RCT-' . date('Ymd') . '-' . rand(1000, 9999),
                'payment_id' => $payment->id,
                'member_id' => $payment->member_id,
                'date' => Carbon::now(),
                'amount' => $payment->amount,
                'status' => 'generated'
            ]);

            $this->notificationService->sendPaymentConfirmation($payment);
        }
    }
}
