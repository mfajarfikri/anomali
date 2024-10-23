<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Status;
use App\Models\Anomali;
use App\Models\Equipment;
use App\Models\Substation;
use App\Models\Type;
use Illuminate\Container\Attributes\Auth;
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
        $anomaliPerBulan = Anomali::select(
            DB::raw("strftime('%m', created_at) as bulan"),
            DB::raw("strftime('%Y', created_at) as tahun"),
            DB::raw('COUNT(*) as jumlah')
        )
        ->groupBy('tahun', 'bulan')
        ->orderBy('tahun', 'asc')
        ->orderBy('bulan', 'asc')
        ->get()
        ->map(function ($item) {
            $item->bulan_tahun = Carbon::createFromDate($item->tahun, $item->bulan, 1)->format('M Y');
            return $item;
        });

        $anomaliPerType = Anomali::select('type_id', DB::raw('COUNT(*) as jumlah'))
            ->groupBy('type_id')
            ->with('type') // Memastikan relasi 'type' dimuat
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->type->name, // Mengambil nama tipe
                    'jumlah' => $item->jumlah
                ];
            });

        $anomaliPerTypeStatus = Anomali::select('type_id', 'status_id', DB::raw('COUNT(*) as jumlah'))
            ->groupBy('type_id', 'status_id')
            ->with(['type', 'status'])
            ->get()
            ->groupBy('type_id')
            ->map(function ($group) {
                $type = $group->first()->type;
                $statusCounts = $group->groupBy('status_id')->map(function ($statusGroup) {
                    return [
                        'name' => $statusGroup->first()->status->name,
                        'jumlah' => $statusGroup->sum('jumlah')
                    ];
                })->values();
                return [
                    'name' => $type->name,
                    'data' => $statusCounts
                ];
            })->values();

        return Inertia::render('Dashboard', [
            'equipments' => Equipment::with('Anomali')->get(),
            'type' => Type::with('Anomali')->get(),
            'status' => Status::with(['Anomali'])->get(),
            'anomalis' => Anomali::with(['Status'])->get(),
            'anomalis_date' => Anomali::with(['Status', 'Substation', 'Equipment', 'User'])->nonEmptyColumns(['date_plan_start', 'date_plan_end'])->get(),
            'anomaliPerBulan' => $anomaliPerBulan,
            'anomaliPerType' => $anomaliPerType,
            'anomaliPerTypeStatus' => $anomaliPerTypeStatus,
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
