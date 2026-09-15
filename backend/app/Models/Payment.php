<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id', 'payment_type_id', 'amount', 'payment_date', 'payment_method',
        'gateway', 'gateway_reference', 'transaction_reference', 'status',
        'metadata', 'verified_at', 'recorded_by'
    ];

    protected $casts = [
        'payment_date' => 'datetime',
        'verified_at' => 'datetime',
        'amount' => 'decimal:2',
        'metadata' => 'array',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function paymentType(): BelongsTo
    {
        return $this->belongsTo(PaymentType::class);
    }
}
