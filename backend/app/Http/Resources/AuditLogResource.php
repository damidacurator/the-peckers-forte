<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AuditLogResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user' => $this->user ? [
                'name' => $this->user->name,
                'email' => $this->user->email,
            ] : null,
            'action' => $this->action,
            'model_type' => $this->model_type,
            'model_id' => $this->model_id,
            'old_values' => $this->old_values,
            'new_values' => $this->new_values,
            'ip_address' => $this->ip_address,
            'created_at' => $this->created_at,
        ];
    }
}
