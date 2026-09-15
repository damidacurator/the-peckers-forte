<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Http\Resources\AuditLogResource;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::with('user')->latest('id');

        if ($request->has('user_id')) $query->where('user_id', $request->user_id);
        if ($request->has('action')) $query->where('action', $request->action);
        if ($request->has('model_type')) $query->where('model_type', $request->model_type);
        if ($request->has('date_from')) $query->whereDate('created_at', '>=', Carbon::parse($request->date_from));
        if ($request->has('date_to')) $query->whereDate('created_at', '<=', Carbon::parse($request->date_to));

        return AuditLogResource::collection($query->paginate(20));
    }
}
