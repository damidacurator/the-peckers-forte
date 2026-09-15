<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GeneralLedger extends Model
{
    use HasFactory;
    
    protected $table = 'general_ledger';

    protected $fillable = [
        'account_id', 'date', 'description', 'debit', 'credit', 
        'reference', 'payment_id', 'created_by'
    ];

    protected $casts = [
        'date' => 'date',
        'debit' => 'decimal:2',
        'credit' => 'decimal:2',
    ];

    public function account()
    {
        return $this->belongsTo(ChartOfAccount::class, 'account_id');
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}
