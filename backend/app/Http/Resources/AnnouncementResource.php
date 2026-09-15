<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AnnouncementResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'type' => $this->type,
            'wing' => $this->wing,
            'image' => $this->image ? url($this->image) : null,
            'is_published' => $this->is_published,
            'published_at' => $this->published_at,
            'expires_at' => $this->expires_at,
            'author' => $this->creator ? $this->creator->name : null,
            'created_at' => $this->created_at,
        ];
    }
}
