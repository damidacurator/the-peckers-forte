<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'wing' => $this->wing,
            'is_public' => $this->is_public,
            'file_url' => url($this->file_path),
            'file_size' => $this->file_size,
            'uploaded_by' => $this->uploaded_by ? \App\Models\User::find($this->uploaded_by)?->name : null,
            'created_at' => $this->created_at,
        ];
    }
}
