<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MemberResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'membership_number' => $this->membership_number,
            'surname' => $this->surname,
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name,
            'full_name' => $this->full_name,
            'gender' => $this->gender,
            'date_of_birth' => $this->date_of_birth,
            'age' => $this->date_of_birth ? $this->date_of_birth->age : null,
            'occupation' => $this->occupation,
            'address' => $this->address,
            'state' => $this->state,
            'lga' => $this->lga,
            'phone' => $this->phone,
            'alt_phone' => $this->alt_phone,
            'email' => $this->email,
            'passport_photo' => $this->passport_photo ? url($this->passport_photo) : null,
            'wing' => $this->wing,
            'status' => $this->status,
            'registration_date' => $this->registration_date,
            'approved_at' => $this->approved_at,
            'next_of_kin_name' => $this->next_of_kin_name,
            'next_of_kin_phone' => $this->next_of_kin_phone,
            'next_of_kin_relationship' => $this->next_of_kin_relationship,
            'membership_category' => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ] : null,
            'branch' => $this->branch ? [
                'id' => $this->branch->id,
                'name' => $this->branch->name,
            ] : null,
            'balance' => $this->ledgerEntries()->latest('id')->value('balance') ?? 0,
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }
}
