<?php

namespace App\Http\Controllers\Api\Member;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Http\Requests\ApproveMemberRequest;
use App\Http\Resources\MemberResource;
use App\Http\Resources\MemberListResource;
use App\Services\MembershipService;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    protected MembershipService $membershipService;

    public function __construct(MembershipService $membershipService)
    {
        $this->membershipService = $membershipService;
    }

    public function index(Request $request)
    {
        $query = Member::query()->with(['category', 'ledgerEntries']);

        if ($request->has('status')) $query->where('status', $request->status);
        if ($request->has('wing')) $query->forWing($request->wing);
        if ($request->has('branch_id')) $query->where('branch_id', $request->branch_id);
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('surname', 'like', "%$search%")
                  ->orWhere('first_name', 'like', "%$search%")
                  ->orWhere('membership_number', 'like', "%$search%");
            });
        }

        return MemberListResource::collection($query->paginate($request->get('per_page', 15)));
    }

    public function show(Member $member)
    {
        return new MemberResource($member->load(['user', 'category', 'branch']));
    }

    public function pendingApprovals()
    {
        $members = Member::pending()->with('category')->get();
        return MemberListResource::collection($members);
    }

    public function approve(ApproveMemberRequest $request, Member $member)
    {
        $this->membershipService->approve($member, $request->user());
        return response()->json(['message' => 'Member approved successfully', 'member' => new MemberResource($member->refresh())]);
    }

    public function reject(Request $request, Member $member)
    {
        $request->validate(['reason' => 'required|string']);
        $member->delete(); // Soft delete for rejection
        return response()->json(['message' => 'Member application rejected']);
    }

    public function suspend(Member $member)
    {
        $this->membershipService->suspend($member);
        return response()->json(['message' => 'Member suspended successfully']);
    }

    public function activate(Member $member)
    {
        $this->membershipService->activate($member);
        return response()->json(['message' => 'Member activated successfully']);
    }
}
