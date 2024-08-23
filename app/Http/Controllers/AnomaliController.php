<?php

namespace App\Http\Controllers;

use App\Models\Anomali;
use App\Models\Bay;
use App\Models\Bidang;
use App\Models\Substation;
use App\Models\Jenis;
use App\Models\Peralatan;
use App\Models\Section;
use App\Models\Type;
use App\Models\Voltage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnomaliController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('Anomali/Anomali')->with([
            'anomalis' => Anomali::with([])->latest()->paginate($request->perpage ?? 10),
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
            'bidang' => 'required',
            'jenis' => 'required',
            'user' => 'required',
            'peralatan' => 'required',
            'voltage' => 'required',
            'bay' => 'required',
            'date_temuan' => 'date'
        ]);

        $user = Anomali::create([
            'ticketname' => $request->ticketname
        ]);

        // dd($user);
        if ($user) {
            event(new Registered($user));
            return redirect()->route('user')->with('success', 'User created successfully');
        }

        return redirect()->back()->with('error', 'Failed to create user');
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
