<?php

namespace App\Http\Controllers;

use App\Models\Bay;
use App\Models\Condition;
use Inertia\Inertia;
use App\Models\Substation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class BayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('Bay/Bay', [
            'bays' => Bay::with(['Substation', 'Condition'])->orderBy('substation_id', 'asc')->paginate($request->perpage ?? 15),
            'substations' => Substation::all(),
            'conditions' => Condition::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        // dd($request);

        $request->validate([
            'bay' => 'required'
        ]);

        Bay::create([
            'name' => $request->bay,
            'substation_id' => $request->substation,
            'condition_id' => $request->condition
        ]);
        return Redirect::route('bay')->with('success', 'berhasil');
    }

    /**
     * Display the specified resource.
     */
    public function show(Bay $bay)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $bay = Bay::findOrFail($id);

        return response()->json([
            'bay' => $bay,
            'substation' => $bay->substation,
            'condition' => $bay->condition
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'bayEdit' => 'required',
            'substationEdit' => 'required',
            'conditionEdit' => 'required'
        ]);

        $bay = Bay::findOrFail($id);
        $bay->update([
            'name' => $request->bayEdit,
            'substation_id' => $request->substationEdit,
            'condition_id' => $request->conditionEdit
        ]);

        return Redirect::route('bay')->with('success', 'Bay berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bay $bay)
    {
        //
    }
}
