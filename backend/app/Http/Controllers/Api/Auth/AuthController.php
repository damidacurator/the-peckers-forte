<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Services\MembershipService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    protected MembershipService $membershipService;

    public function __construct(MembershipService $membershipService)
    {
        $this->membershipService = $membershipService;
    }

    public function register(RegisterRequest $request)
    {
        $member = $this->membershipService->register($request->validated());
        
        return response()->json([
            'message' => 'Registration successful. Waiting for approval.',
            'member_id' => $member->id
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials provided.'],
            ]);
        }

        $user = Auth::user();
        if (!$user->is_active) {
            Auth::logout();
            return response()->json(['message' => 'Account is deactivated.'], 403);
        }

        $user->load('member', 'roles');

        return response()->json([
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'is_active' => $user->is_active,
                'roles' => $user->roles->pluck('name'),
                'last_login_at' => $user->last_login_at,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
            ],
            'member' => $user->member ? [
                'id' => $user->member->id,
                'membership_number' => $user->member->membership_number,
                'surname' => $user->member->surname,
                'first_name' => $user->member->first_name,
                'full_name' => $user->member->first_name . ' ' . $user->member->surname,
                'status' => $user->member->status,
                'wing' => $user->member->wing,
            ] : null,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('member', 'roles');

        return response()->json([
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'is_active' => $user->is_active,
                'roles' => $user->roles->pluck('name'),
                'last_login_at' => $user->last_login_at,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
            ],
            'member' => $user->member ? [
                'id' => $user->member->id,
                'membership_number' => $user->member->membership_number,
                'surname' => $user->member->surname,
                'first_name' => $user->member->first_name,
                'full_name' => $user->member->first_name . ' ' . $user->member->surname,
                'status' => $user->member->status,
                'wing' => $user->member->wing,
            ] : null,
        ]);
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $member = $request->user()->member;
        if ($member) {
            $member->update($request->validated());
            return response()->json(['message' => 'Profile updated successfully']);
        }
        return response()->json(['message' => 'Member profile not found'], 404);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();
        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages(['current_password' => 'Current password is incorrect']);
        }

        $user->update(['password' => Hash::make($request->password)]);
        return response()->json(['message' => 'Password changed successfully']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $status = Password::sendResetLink($request->only('email'));
        return $status === Password::RESET_LINK_SENT
                    ? response()->json(['message' => __($status)])
                    : response()->json(['message' => __($status)], 400);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset($request->only('email', 'password', 'password_confirmation', 'token'), function ($user, $password) {
            $user->forceFill(['password' => Hash::make($password)])->setRememberToken(\Illuminate\Support\Str::random(60));
            $user->save();
        });

        return $status === Password::PASSWORD_RESET
                    ? response()->json(['message' => __($status)])
                    : response()->json(['message' => __($status)], 400);
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate(['photo' => 'required|image|max:2048']);
        $path = $request->file('photo')->store('passports', 'public');
        
        if ($member = $request->user()->member) {
            $member->update(['passport_photo' => '/storage/' . $path]);
        }
        
        return response()->json(['message' => 'Photo uploaded successfully', 'path' => '/storage/' . $path]);
    }
}
