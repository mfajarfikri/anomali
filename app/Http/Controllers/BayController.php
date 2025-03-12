<?php

namespace App\Http\Controllers;

use App\Models\Bay;
use App\Models\Condition;
use Inertia\Inertia;
use App\Models\Substation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;

class BayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perpage = $request->input('perpage', 15);
        $search = $request->input('search', '');
        $substation = $request->input('substation', '');
        $condition = $request->input('condition', '');

        $query = Bay::with(['substation', 'condition'])->latest();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhereHas('substation', function($sq) use ($search) {
                      $sq->where('name', 'LIKE', "%{$search}%");
                  });
            });
        }

        if ($substation) {
            $query->where('substation_id', $substation);
        }

        if ($condition) {
            $query->where('condition_id', $condition);
        }

        $bays = $query->paginate($perpage)->appends(request()->query());

        return Inertia::render('Bay/Bay', [
            'bays' => $bays,
            'substations' => Substation::orderBy('name')->get(),
            'conditions' => Condition::all(),
            'filters' => [
                'search' => $search,
                'substation' => $substation,
                'condition' => $condition,
                'perpage' => $perpage,
            ],
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
        try {
            $validated = $request->validate([
                'bay' => 'required|string|max:255',
                'substation' => 'required|exists:substations,id',
                'condition' => 'required|exists:conditions,id'
            ]);

            Bay::create([
                'name' => $validated['bay'],
                'substation_id' => $validated['substation'],
                'condition_id' => $validated['condition']
            ]);

            return Redirect::back()->with('message', 'Bay berhasil dibuat');
        } catch (ValidationException $e) {
            return Redirect::back()->withErrors($e->errors());
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Terjadi kesalahan saat membuat bay');
        }
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
        try {
            $validated = $request->validate([
                'bay' => 'required|string|max:255',
                'substation' => 'required|exists:substations,id',
                'condition' => 'required|exists:conditions,id'
            ]);

            $bay = Bay::findOrFail($id);
            $bay->update([
                'name' => $validated['bay'],
                'substation_id' => $validated['substation'],
                'condition_id' => $validated['condition']
            ]);

            return Redirect::back()->with('message', 'Bay berhasil diperbarui');
        } catch (ValidationException $e) {
            return Redirect::back()->withErrors($e->errors());
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Terjadi kesalahan saat memperbarui bay');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bay $bay)
    {
        //
    }
}
