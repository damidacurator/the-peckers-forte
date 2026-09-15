<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GalleryImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'album_id',
        'image_path',
        'caption',
        'sort_order',
    ];

    public function album()
    {
        return $this->belongsTo(GalleryAlbum::class, 'album_id');
    }
}
