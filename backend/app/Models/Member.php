<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Member extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'membership_number', 'surname', 'first_name', 'middle_name',
        'gender', 'date_of_birth', 'occupation', 'address', 'state', 'lga',
        'phone', 'alt_phone', 'email', 'passport_photo', 'membership_category_id',
        'branch_id', 'wing', 'registration_date', 'status', 'approved_by',
        'approved_at', 'next_of_kin_name', 'next_of_kin_phone', 'next_of_kin_relationship'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'registration_date' => 'date',
        'approved_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(MembershipCategory::class, 'membership_category_id');
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function ledgerEntries(): HasMany
    {
        return $this->hasMany(LedgerEntry::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    public function scopeForWing(Builder $query, string $wing): Builder
    {
        if ($wing === 'both') {
            return $query;
        }
        return $query->whereIn('wing', [$wing, 'both']);
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->middle_name} {$this->surname}");
    }
}
