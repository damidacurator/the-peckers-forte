<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    protected string $formspreeEndpoint;

    public function __construct()
    {
        $this->formspreeEndpoint = config('services.formspree.endpoint', 'https://formspree.io/f/moeqgrqd');
    }

    protected function dispatchEmail(string $subject, array $data): bool
    {
        try {
            $payload = array_merge([
                'subject' => $subject,
                '_replyto' => $data['email'] ?? 'noreply@thepeckersforte.com',
            ], $data);

            $response = Http::timeout(10)->post($this->formspreeEndpoint, $payload);
            return $response->successful();
        } catch (\Throwable $e) {
            Log::error('Formspree dispatch failed: ' . $e->getMessage());
            return false;
        }
    }

    public function sendPaymentConfirmation($payment): void
    {
        $this->dispatchEmail('Payment Confirmation - THE PECKERS FORTE', [
            'payment_reference' => $payment->transaction_reference ?? '',
            'amount' => $payment->amount ?? 0,
            'status' => $payment->status ?? 'successful',
        ]);
    }

    public function sendReceiptEmail($receipt): void
    {
        $this->dispatchEmail('Payment Receipt Generated', [
            'receipt_number' => $receipt->receipt_number ?? '',
            'amount' => $receipt->amount ?? 0,
        ]);
    }

    public function sendRegistrationApproved($member): void
    {
        $this->dispatchEmail('Membership Registration Approved - Welcome to THE PECKERS FORTE', [
            'member_name' => ($member->first_name ?? '') . ' ' . ($member->surname ?? ''),
            'membership_number' => $member->membership_number ?? '',
            'email' => $member->email ?? '',
        ]);
    }

    public function sendPaymentReminder($member, float $amount): void
    {
        $this->dispatchEmail('Payment Due Reminder - THE PECKERS FORTE', [
            'member_name' => ($member->first_name ?? '') . ' ' . ($member->surname ?? ''),
            'membership_number' => $member->membership_number ?? '',
            'amount_due' => $amount,
        ]);
    }
}

