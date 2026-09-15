<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'address', 'state', 'lga', 'phone', 'email', 'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function members()
    {
        return $this->hasMany(Member::class);
    }
}
