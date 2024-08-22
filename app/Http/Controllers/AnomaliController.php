<?php

namespace App\Http\Controllers;

use App\Models\Anomali;
use App\Models\Bay;
use App\Models\Bidang;
use App\Models\Gardu;
use App\Models\Jenis;
use App\Models\Peralatan;
use App\Models\Voltage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnomaliController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Anomali/Anomali')->with([
            'anomali' => Anomali::latest(),
            'gardus' => Gardu::all(),
            'bidangs' => Bidang::all(),
            'jenis' => Jenis::all(),
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
            'name' => 'required|string|max:255|unique:' . User::class,
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'gardu_id' => 'required',
            'role_id' => 'required',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'gardu_id' => $request->gardu_id,
            'role_id' => $request->role_id,
            'password' => Hash::make($request->password),
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
