<?php

namespace App\Http\Controllers;

use App\Models\Bay;
use App\Models\Type;
use Inertia\Inertia;
use App\Models\Jenis;
use App\Models\Bidang;
use App\Models\Anomali;
use App\Models\Section;
use App\Models\Voltage;
use App\Models\Peralatan;
use App\Models\Substation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class AnomaliController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('Anomali/Anomali')->with([
            'anomalis' => Anomali::with(['Substation','Section','Type','User','Peralatan','Voltage','Bay','Status'])->latest()->paginate($request->perpage ?? 10),
            'substations' => Substation::all(),
            'sections' => Section::all(),
            'types' => Type::all(),
            'peralatans' => Peralatan::all(),
            'voltages' => Voltage::all(),
            'bays' => Bay::all(),
        ]);


    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $request->validate([
            'ticketname' => 'required',
            'substation' => 'required',
            'section' => 'required',
            'type' => 'required',
            'user' => 'required',
            'peralatan' => 'required',
            'voltage' => 'required',
            'bay' => 'required',
            'date_find' => 'required',
            'additional_information' => 'required'
        ]);

        $ticket = Anomali::create([
            'ticketname' => $request->ticketname,
            'substation_id' => $request->substation,
            'section_id' => $request->section,
            'type_id' => $request->type,
            'user_id' => $request->user,
            'peralatan_id' => $request->peralatan,
            'voltage_id' => $request->voltage,
            'bay_id' => $request->bay,
            'date_find' => $request->date_find,
            'additional_information' => $request->additional_information,
            'status_id' => 1
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
    public function destroy(Anomali $anomali)
    {
        //
    }
}
