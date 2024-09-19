<?php

namespace App\Http\Controllers;

use App\Models\Anomali;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApprovalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('Approval/Approval', [
            'anomalis' => Anomali::with([
                'Substation',
                'Section',
                'Type',
                'User',
                'Equipment',
                'Bay',
                'Status',
                ])->whereNot('status_id', 3)->latest()->paginate($request->perpage ?? 15)
        ]);
        // ->latest()->paginate($request->perpage ?? 15)
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, String $id)
    {
    //    dd($id);

        $approve = Anomali::findOrFail($id);

        $approve->update([
            'status_id' => 2,
            'is_approve' => true,
            'approve_by' => $request->approve_by
        ]);

        return redirect()->route('approval')->with('success', 'Approve Successfully');
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
}
