<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LedgerEntryResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'date' => $this->date,
            'description' => $this->description,
            'debit' => $this->debit,
            'credit' => $this->credit,
            'balance' => $this->balance,
            'entry_type' => $this->entry_type,
            'reference' => $this->reference,
            'created_at' => $this->created_at,
        ];
    }
}
