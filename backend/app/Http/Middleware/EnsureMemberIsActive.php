<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMemberIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->member && $user->member->status !== 'active' && !$user->hasRole('Super Admin')) {
            return response()->json([
                'message' => 'Your membership is not active. Please contact the administration.'
            ], 403);
        }

        return $next($request);
    }
}
