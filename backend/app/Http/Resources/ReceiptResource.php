<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ReceiptResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'receipt_number' => $this->receipt_number,
            'date' => $this->date,
            'amount' => $this->amount,
            'status' => $this->status,
            'payment' => new PaymentResource($this->whenLoaded('payment')),
            'download_url' => url('/api/receipts/' . $this->id . '/download'),
        ];
    }
}
