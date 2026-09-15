<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MemberListResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'membership_number' => $this->membership_number,
            'full_name' => $this->full_name,
            'phone' => $this->phone,
            'email' => $this->email,
            'wing' => $this->wing,
            'status' => $this->status,
            'category_name' => $this->category ? $this->category->name : null,
            'balance' => collect($this->ledgerEntries)->last()?->balance ?? 0,
        ];
    }
}
