<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'two_factor_secret',
        'two_factor_confirmed_at',
        'last_login_at',
        'last_login_ip',
        'failed_login_attempts',
        'locked_until',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'two_factor_confirmed_at' => 'datetime',
        'last_login_at' => 'datetime',
        'locked_until' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function member()
    {
        return $this->hasOne(Member::class);
    }
}
