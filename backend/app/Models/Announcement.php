<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'content', 'type', 'wing', 'image', 
        'is_published', 'published_at', 'expires_at', 'created_by'
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopePublished(Builder $query)
    {
        return $query->where('is_published', true)->where(function($q) {
            $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
        });
    }
}
