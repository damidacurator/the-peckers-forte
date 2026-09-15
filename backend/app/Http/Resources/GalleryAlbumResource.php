<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GalleryAlbumResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'cover_image' => $this->cover_image ? url($this->cover_image) : null,
            'is_published' => $this->is_published,
            'images_count' => $this->whenCounted('images'),
            'images' => $this->whenLoaded('images'),
        ];
    }
}
