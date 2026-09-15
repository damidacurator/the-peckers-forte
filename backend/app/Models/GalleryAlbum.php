<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GalleryAlbum extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'cover_image',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    public function images()
    {
        return $this->hasMany(GalleryImage::class, 'album_id')->orderBy('sort_order');
    }
}
