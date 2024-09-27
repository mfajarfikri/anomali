<?php

namespace App\Http\Controllers;

use App\Models\Bay;
use App\Models\Type;
use Inertia\Inertia;
use App\Models\Anomali;
use App\Models\Document;
use App\Models\Section;
use App\Models\Equipment;
use App\Models\Substation;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnomaliController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request,)
    {
        // dd(session());

        return Inertia::render('Anomali/Anomali')->with([
            'anomalis' => Anomali::with(['Substation','Section','Type','User','Equipment','Bay','Status'])->latest()->paginate($request->perpage ?? 15),
            'substations' => Substation::with('Bay')->orderBy('name', 'asc')->get(),
            'sections' => Section::orderBy('name', 'asc')->get(),
            'types' => Type::all(),
            'equipments' => Equipment::orderBy('name', 'asc')->get(),
            'bays' => Bay::all(),
        ]);


    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {

        // dd($request->file('file')->getClientOriginalName());

        $request->validate([
            'titlename' => 'required|string',
            'substation' => 'required',
            'section' => 'required',
            'type' => 'required',
            'user' => 'required',
            'equipment' => 'required',
            'bay' => 'required',
            'date_find' => 'required|date',
            'additional_information' => 'required',
            'file' => 'required|file|mimes:jpg,png,pdf|max:3048'
        ]);

        $path = $request->file('file')->store('lampiranAnomali', 'public');
        $file = $request->file('file')->getClientOriginalName();

        $ticket = Anomali::create([
            'titlename' => $request->titlename,
            'substation_id' => $request->substation,
            'section_id' => $request->section,
            'type_id' => $request->type,
            'user_id' => $request->user,
            'equipment_id' => $request->equipment,
            'bay_id' => $request->bay,
            'date_find' => $request->date_find,
            'additional_information' => $request->additional_information,
            'status_id' => 1,
            'is_approve' => false,
            'attachment_filename' => $file,
            'attachment_path' => $path
        ]);
        if ($ticket) {
            return redirect()->route('anomali')->with('success', 'Anomalies created successfully');
        }

        return redirect()->back()->with('error', 'Failed to create anomalies');

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
    public function show(Anomali $anomali)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Anomali $anomali)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Anomali $anomali)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        dd($id);
        $anomali = Anomali::find($id);
        $anomali->delete();
        return back();
    }
}
