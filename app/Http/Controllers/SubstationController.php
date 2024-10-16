<?php

namespace App\Http\Controllers;

use App\Models\Condition;
use App\Models\Substation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;


class SubstationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Substation::with(['condition', 'bay']);

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('condition') && $request->condition !== '') {
            $query->where('condition_id', $request->condition);
        }

        $substations = $query->paginate($request->perpage ?? 10);

        return Inertia::render('Substation/Substation', [
            'substations' => $substations,
            'conditions' => Condition::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:'. Substation::class
        ]);

        $substation = Substation::create([
            'name' => $request->name,
            'condition_id' => $request->condition
        ]);

        if ($substation) {
            return redirect()->route('substation')->with('success', 'Substation created successfully');
        }

        return redirect()->back()->with('error', 'Failed to create Substation');
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
    public function edit(Substation $substation)
    {
        return Inertia::render('Substation/Edit', [
            'substation' => $substation->load('condition'),
            'conditions' => Condition::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Substation $substation)
    {
        $request->validate([
            'name' => 'required|unique:substations,name,' . $substation->id,
            'condition' => 'required|exists:conditions,id',
        ]);

        $substation->update([
            'name' => $request->name,
            'condition_id' => $request->condition,
        ]);

        return redirect()->route('substation')->with('success', 'Substation updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $Substation = Substation::find($id);
        $Substation->delete();
        return back();
    }
}
