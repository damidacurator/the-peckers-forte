<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'location' => $this->location,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'wing' => $this->wing,
            'image' => $this->image ? url($this->image) : null,
            'is_published' => $this->is_published,
            'created_at' => $this->created_at,
        ];
    }
}
