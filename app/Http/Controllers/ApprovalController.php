<?php

namespace App\Http\Controllers;

use App\Models\Anomali;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ApprovalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perpage = $request->input('perpage', 15);
        
        // Tambahkan pengecekan dan update status anomali yang expired
        $today = now()->startOfDay();
        Anomali::where('status_id', 2)
            ->where('date_plan_end', '<', $today)
            ->update([
                'is_approve' => false,
                'status_id' => 4,
            ]);

        $query = Anomali::with([
            'Substation',
            'Section',
            'Type',
            'User',
            'Equipment',
            'Bay',
            'Status',
        ])->whereIn('status_id', [1, 2, 4]);

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('titlename', 'like', "%{$searchTerm}%")
                  ->orWhereHas('Substation', function ($q) use ($searchTerm) {
                      $q->where('name', 'like', "%{$searchTerm}%");
                  })
                  ->orWhereHas('Section', function ($q) use ($searchTerm) {
                      $q->where('name', 'like', "%{$searchTerm}%");
                  })
                  ->orWhereHas('User', function ($q) use ($searchTerm) {
                      $q->where('name', 'like', "%{$searchTerm}%");
                  })
                  ->orWhereHas('Equipment', function ($q) use ($searchTerm) {
                      $q->where('name', 'like', "%{$searchTerm}%");
                  })
                  ->orWhereHas('Bay', function ($q) use ($searchTerm) {
                      $q->where('name', 'like', "%{$searchTerm}%");
                  });
            });
        }

        // Perbaikan untuk handle 'all'
        if ($perpage === 'all') {
            $data = $query->latest()->get();
            $total = $data->count();
            return Inertia::render('Approval/Approval', [
                'anomalis' => [
                    'data' => $data,
                    'from' => $total > 0 ? 1 : 0,
                    'to' => $total,
                    'total' => $total,
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => $total,
                    'links' => []
                ]
            ]);
        }

        // Jika bukan 'all', gunakan pagination normal
        $anomalis = $query->latest()->paginate((int)$perpage);

        return Inertia::render('Approval/Approval', [
            'anomalis' => $anomalis
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, String $id)
    {
    //    dd($request);
        $request->validate([
            'date_plan_start' => 'required',
            'date_plan_end' => 'required',
        ]);

        $approve = Anomali::findOrFail($id);

        $approve->update([
            'status_id' => 2,
            'is_approve' => true,
            'date_plan_start' => $request->date_plan_start,
            'date_plan_end' => $request->date_plan_end,
            'approve_by' => $request->approve_by
        ]);

        return redirect()->route('approval')->with( 'post', 'Approve Successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        dd($request);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $anomali = Anomali::find($id);
        $anomali->delete();
        return back();
    }

    public function close(Request $request, $id)
    {
        // dd($request->action);
        $request->validate([
            'date_execution' => 'required|date',
            'action' => 'required|string',
            'officialReport' => 'required|file|mimes:pdf|max:3072',
        ]);

        $anomaly = Anomali::findOrFail($id);

        $file = $request->file('officialReport');
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $fileName = pathinfo($originalName, PATHINFO_FILENAME);
        $safeFileName = preg_replace("/[^A-Za-z0-9]/", '_', $fileName);
        $newFileName = $safeFileName . '_' . time() . '.' . $extension;

        $path = $file->storeAs('Official Reports', $newFileName, 'public');

        $anomaly->update([
            'status_id' => 3,
            'date_execution' => $request->date_execution,
            'action' => $request->action,
            'official_report' => $newFileName,
            'report_path' => $path
        ]);

        return redirect()->route('approval')->with( 'post', 'Close Successfully');
    }
}
