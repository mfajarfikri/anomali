<?php

namespace App\Http\Controllers;

use Closure;
use App\Models\Bay;
use App\Models\Type;
use Inertia\Inertia;
use App\Models\Status;
use App\Models\Anomali;
use App\Models\Section;
use App\Models\Equipment;
use App\Models\Substation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnomaliController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perpage = $request->input('perpage', 15);

        // Tambahkan pengecekan dan update status anomali yang melewati batas
        $today = now()->startOfDay();
        Anomali::where('status_id', 2) // Status Approve
            ->where('date_plan_end', '<', $today)
            ->update([
                'status_id' => 4, // Status Pending
            ]);

        $query = Anomali::with(['Substation', 'Section', 'Type', 'User', 'Equipment', 'Bay', 'Status'])->latest();

        if ($request->filled('substation')) {
            $query->where('substation_id', $request->substation);
        }


        if ($request->filled('section')) {
            $query->where('section_id', $request->section);
        }

        if ($request->filled('type')) {
            $query->where('type_id', $request->type);
        }

        if ($request->filled('equipment')) {
            $query->where('equipment_id', $request->equipment);
        }

        if ($request->filled('status')) {
            $query->whereHas('status', function ($q) use ($request) {
                $q->where('name', $request->status);
            });
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('date_find', [$request->start_date, $request->end_date]);
        } elseif ($request->filled('start_date')) {
            $query->where('date_find', '>=', $request->start_date);
        } elseif ($request->filled('end_date')) {
            $query->where('date_find', '<=', $request->end_date);
        }

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('titlename', 'LIKE', "%{$searchTerm}%")
                  ->orWhereHas('Substation', function ($q) use ($searchTerm) {
                      $q->where('name', 'LIKE', "%{$searchTerm}%");
                  })
                  ->orWhereHas('Section', function ($q) use ($searchTerm) {
                      $q->where('name', 'LIKE', "%{$searchTerm}%");
                  })
                  ->orWhereHas('Type', function ($q) use ($searchTerm) {
                      $q->where('name', 'LIKE', "%{$searchTerm}%");
                  })
                  ->orWhereHas('User', function ($q) use ($searchTerm) {
                      $q->where('name', 'LIKE', "%{$searchTerm}%");
                  })
                  ->orWhereHas('Equipment', function ($q) use ($searchTerm) {
                      $q->where('name', 'LIKE', "%{$searchTerm}%");
                  })
                  ->orWhereHas('Bay', function ($q) use ($searchTerm) {
                      $q->where('name', 'LIKE', "%{$searchTerm}%");
                  })
                  ->orWhereHas('Status', function ($q) use ($searchTerm) {
                      $q->where('name', 'LIKE', "%{$searchTerm}%");
                  });
            });
        }

        $anomalis = $query->paginate($perpage);

        return Inertia::render('Anomali/Anomali', [
            'anomalis' => $anomalis,
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
    public function create(Request $request)
    {
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

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $fileName = pathinfo($originalName, PATHINFO_FILENAME);
        $safeFileName = preg_replace("/[^A-Za-z0-9]/", '_', $fileName);
        $newFileName = $safeFileName . '_' . time() . '.' . $extension;

        $path = $file->storeAs('lampiranAnomali', $newFileName, 'public');

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
            'attachment_filename' => $newFileName,
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
