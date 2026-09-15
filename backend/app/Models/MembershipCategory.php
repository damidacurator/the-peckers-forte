<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MembershipCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'registration_fee', 'annual_dues', 
        'monthly_contribution', 'description', 'wing', 'is_active'
    ];

    protected $casts = [
        'registration_fee' => 'decimal:2',
        'annual_dues' => 'decimal:2',
        'monthly_contribution' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }
}
