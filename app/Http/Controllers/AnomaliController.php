<?php

namespace App\Http\Controllers;

use App\Models\anomali;
use App\Models\Type;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnomaliController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Anomali/anomali', [
            'anomali' => anomali::latest()->paginate(10),
            'types' => Type::all(),
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
    public function show(anomali $anomali)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(anomali $anomali)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, anomali $anomali)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(anomali $anomali)
    {
        //
    }
}
