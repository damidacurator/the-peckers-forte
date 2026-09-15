<?php

namespace App\Http\Controllers\Api\Finance;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AccountingController extends Controller
{
    protected ReportService $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function cashBook(Request $request)
    {
        $from = $request->has('from') ? Carbon::parse($request->from) : null;
        $to = $request->has('to') ? Carbon::parse($request->to) : null;
        return response()->json($this->reportService->cashBook($from, $to));
    }

    public function trialBalance(Request $request)
    {
        $asAt = $request->has('as_at') ? Carbon::parse($request->as_at) : null;
        return response()->json($this->reportService->trialBalance($asAt));
    }

    public function incomeExpenditure(Request $request)
    {
        $from = $request->has('from') ? Carbon::parse($request->from) : null;
        $to = $request->has('to') ? Carbon::parse($request->to) : null;
        return response()->json($this->reportService->incomeAndExpenditure($from, $to));
    }

    public function balanceSheet(Request $request)
    {
        $asAt = $request->has('as_at') ? Carbon::parse($request->as_at) : null;
        return response()->json($this->reportService->balanceSheet($asAt));
    }

    public function exportReport(Request $request)
    {
        $type = $request->get('type', 'cashbook');
        $format = $request->get('format', 'excel');
        
        $path = $format === 'pdf' 
            ? $this->reportService->exportToPdf($type, $request->all())
            : $this->reportService->exportToExcel($type, $request->all());
            
        return response()->json(['download_url' => url($path)]);
    }
}
