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
        $query = User::with(['substation', 'role'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhereHas('substation', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      })
                      ->orWhereHas('role', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
                });
            });

        $users = $query->paginate($request->input('perpage', 10));

        return Inertia::render('User/User', [
            'users' => $users,
            'substations' => Substation::all(),
            'roles' => Role::all(),
            'filters' => $request->only(['search', 'perpage']),
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
