<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Executive extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'name',
        'position',
        'wing',
        'photo',
        'bio',
        'start_date',
        'end_date',
        'is_current',
        'sort_order',
    ];

    protected $casts = [
        'is_current' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
