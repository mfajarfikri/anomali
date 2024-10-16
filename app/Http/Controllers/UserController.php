<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Substation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Auth\Events\Registered;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::with(['Role', 'Substation'])->latest();

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%")
                  ->orWhereHas('Substation', function ($subQuery) use ($searchTerm) {
                      $subQuery->where('name', 'like', "%{$searchTerm}%");
                  })
                  ->orWhereHas('Role', function ($subQuery) use ($searchTerm) {
                      $subQuery->where('name', 'like', "%{$searchTerm}%");
                  });
            });
        }

        return Inertia::render('User/User', [
            'users' => $query->paginate($request->perpage ?? 15),
            'substations' => Substation::orderBy('name', 'asc')->get(),
            'roles' => Role::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {

        // dd($request);
        $request->validate([
            'name' => 'required|string|max:255|unique:' . User::class,
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'substation_id' => 'required',
            'role_id' => 'required',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'substation_id' => $request->substation_id,
            'role_id' => $request->role_id,
            'password' => Hash::make($request->password),
        ]);

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
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('User/Edit', [
            'user' => $user->load('role', 'substation'),
            'substations' => Substation::orderBy('name', 'asc')->get(),
            'roles' => Role::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'substation_id' => 'required|exists:substations,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user->update([
            'substation_id' => $request->substation_id,
            'role_id' => $request->role_id,
        ]);

        return redirect()->route('user')->with('success', 'Data pengguna berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
