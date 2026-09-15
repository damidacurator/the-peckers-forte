<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'transaction_reference' => $this->transaction_reference,
            'amount' => $this->amount,
            'payment_type' => $this->paymentType ? [
                'name' => $this->paymentType->name,
                'code' => $this->paymentType->code,
            ] : null,
            'payment_date' => $this->payment_date,
            'payment_method' => $this->payment_method,
            'gateway' => $this->gateway,
            'status' => $this->status,
            'member' => $this->whenLoaded('member', function() {
                return [
                    'name' => $this->member->full_name,
                    'membership_number' => $this->member->membership_number,
                ];
            }),
            'created_at' => $this->created_at,
        ];
    }
}
