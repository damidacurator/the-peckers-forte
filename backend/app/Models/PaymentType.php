<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'code', 'category', 'wing', 'is_recurring', 
        'frequency', 'default_amount', 'is_active'
    ];

    protected $casts = [
        'is_recurring' => 'boolean',
        'default_amount' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
