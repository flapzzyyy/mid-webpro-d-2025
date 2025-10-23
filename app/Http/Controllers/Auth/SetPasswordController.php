<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class SetPasswordController extends Controller
{
    public function create()
    {
        if (auth()->user()->password !== null) {
            return redirect()->route('/dashboard');
        }

        return Inertia::render('auth/set-password');
    }

    public function store(Request $request)
    {
        $request->validate([
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('dashboard');
    }
}
