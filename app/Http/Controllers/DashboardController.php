<?php

namespace App\Http\Controllers;

use App\Models\Anomali;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        return Inertia::render('Dashboard', [
            'anomalis' => Anomali::latest()->paginate(),
            'anomalis_new' => Anomali::where('status_id', 1)->count(),
            'anomalis_open' => Anomali::where('status_id', 2)->count(),
            'anomalis_pending' => Anomali::where('status_id', 3)->count(),
            'anomalis_close' => Anomali::where('status_id', 4)->count(),
            'anomalis_major' => Anomali::where('type_id', 1)->count(),
            'anomalis_minor' => Anomali::where('type_id', 2)->count(),
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
