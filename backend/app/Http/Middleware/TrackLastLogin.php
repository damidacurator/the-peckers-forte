<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;

class TrackLastLogin
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (auth()->check()) {
            $user = auth()->user();
            
            // Only update if it hasn't been updated in the last 5 minutes to prevent spamming queries
            if (!$user->last_login_at || $user->last_login_at->diffInMinutes(Carbon::now()) > 5) {
                $user->update([
                    'last_login_at' => Carbon::now(),
                    'last_login_ip' => $request->ip(),
                ]);
            }
        }

        return $response;
    }
}
