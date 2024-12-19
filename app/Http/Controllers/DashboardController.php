<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Status;
use App\Models\Anomali;
use App\Models\Equipment;
use App\Models\User;
use App\Models\Type;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $anomalis = Anomali::with(['status', 'equipment', 'user'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        $anomaliPerTypeStatus = DB::table('anomalis')
            ->join('types', 'anomalis.type_id', '=', 'types.id')
            ->join('statuses', 'anomalis.status_id', '=', 'statuses.id')
            ->select(
                'types.name as type_name',
                'statuses.name as status_name',
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('types.name', 'statuses.name')
            ->get();

        $anomaliPerSection = DB::table('anomalis')
            ->join('sections', 'anomalis.section_id', '=', 'sections.id')
            ->select(
                'sections.name as section_name',
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('sections.name')
            ->get();

        

        return Inertia::render('Dashboard', [
            'equipments' => Equipment::with('Anomali')->get(),
            'type' => Type::with('Anomali')->get(),
            'status' => Status::with(['Anomali'])->get(),
            'anomalis' => $anomalis,
            'anomalis_date' => Anomali::with(['Status', 'Substation', 'Equipment', 'User'])
                ->whereNotNull('date_plan_start')
                ->whereNotNull('date_plan_end')
                ->get(),
            'anomaliPerTypeStatus' => $anomaliPerTypeStatus,
            'anomaliPerSection' => $anomaliPerSection,
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
