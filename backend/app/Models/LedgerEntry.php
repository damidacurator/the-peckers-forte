<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LedgerEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id', 'payment_id', 'date', 'description', 
        'debit', 'credit', 'balance', 'entry_type', 'reference', 'created_by'
    ];

    protected $casts = [
        'date' => 'date',
        'debit' => 'decimal:2',
        'credit' => 'decimal:2',
        'balance' => 'decimal:2',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
