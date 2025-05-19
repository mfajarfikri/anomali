<?php

namespace App\Http\Controllers;

use App\Models\Bay;
use App\Models\Har;
use App\Models\Type;
use Inertia\Inertia;
use App\Models\Status;
use App\Models\Section;
use App\Models\Equipment;
use App\Models\Substation;
use Illuminate\Http\Request;

class HarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perpage = $request->input('perpage', 10);
        $query = Har::with(['substation', 'bay', 'equipment', 'user'])->latest();
        $har = $query->paginate($perpage);

        return Inertia::render('Har/Har', [
            'hars' => $har,
            'substations' => Substation::with('Bay')->orderBy('name', 'asc')->get(),
            'sections' => Section::orderBy('name', 'asc')->get(),
            'types' => Type::all(),
            'equipments' => Equipment::orderBy('name', 'asc')->get(),
            'bays' => Bay::all(),
            'status' => Status::all(),
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
        // return $request;

        $request->validate([
            'titlename' => 'required|string',
            'substation' => 'required|exists:substations,id',
            'bay' => 'required|exists:bays,id',
            'user' => 'required|exists:users,id',
            'equipment' => 'required|exists:equipment,id',
            'date' => 'required|date',
            'description' => 'required|string'
        ]);

        $har = Har::create([
            'titlename' => $request->titlename,
            'substation_id' => $request->substation,
            'bay_id' => $request->bay,
            'user_id' => $request->user,
            'equipment_id' => $request->equipment,
            'date' => $request->date,
            'description' => $request->description
        ]);

        if ($har) {
            return redirect()->route('har')->with('success', 'Har created successfully');
        }

        return redirect()->back()->with('error', 'Failed to create Har');
    }

    /**
     * Display the specified resource.
     */
    public function show(Har $har)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Har $har)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Har $har)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Har $har)
    {
        //
    }
}
