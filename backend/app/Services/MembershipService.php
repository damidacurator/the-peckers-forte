<?php

namespace App\Services;

use App\Models\Member;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MembershipService
{
    public function register(array $data): Member
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['first_name'] . ' ' . $data['surname'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            $user->assignRole('Ordinary Member');

            $member = Member::create([
                'user_id' => $user->id,
                'surname' => $data['surname'],
                'first_name' => $data['first_name'],
                'middle_name' => $data['middle_name'] ?? null,
                'gender' => $data['gender'],
                'date_of_birth' => $data['date_of_birth'],
                'occupation' => $data['occupation'] ?? null,
                'address' => $data['address'],
                'state' => $data['state'],
                'lga' => $data['lga'],
                'phone' => $data['phone'],
                'alt_phone' => $data['alt_phone'] ?? null,
                'email' => $data['email'],
                'membership_category_id' => $data['membership_category_id'],
                'wing' => $data['wing'],
                'status' => 'pending',
                'registration_date' => Carbon::now(),
            ]);

            return $member;
        });
    }

    public function approve(Member $member, User $approver): void
    {
        $member->update([
            'status' => 'active',
            'membership_number' => $this->generateMembershipNumber(),
            'approved_by' => $approver->id,
            'approved_at' => Carbon::now(),
        ]);
    }

    public function generateMembershipNumber(): string
    {
        $prefix = \App\Models\Setting::where('key', 'membership_id_prefix')->value('value') ?? 'TPF';
        $year = date('Y');
        $lastMember = Member::whereYear('approved_at', $year)->orderBy('id', 'desc')->first();
        $nextNum = $lastMember ? ((int) substr($lastMember->membership_number, -4)) + 1 : 1;
        return sprintf("%s-%s-%04d", $prefix, $year, $nextNum);
    }

    public function suspend(Member $member): void
    {
        $member->update(['status' => 'suspended']);
    }

    public function activate(Member $member): void
    {
        $member->update(['status' => 'active']);
    }

    public function getStats(): array
    {
        return [
            'total' => Member::count(),
            'active' => Member::active()->count(),
            'pending' => Member::pending()->count(),
            'suspended' => Member::where('status', 'suspended')->count(),
        ];
    }
}
