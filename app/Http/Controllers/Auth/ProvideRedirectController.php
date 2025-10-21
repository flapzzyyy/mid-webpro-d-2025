<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class ProvideRedirectController extends Controller
{
    public function __invoke(Request $request, string $provider)
    {
        if (! in_array($provider, ['google', 'github'])) {
            return redirect()->route('login')->withErrors(['provider' => 'Invalid provider']);
        }

        try {
            return Socialite::driver($provider)->redirect();
        } catch (\Exception $e) {
            return redirect()->route('login')->withErrors(['provider' => 'Something went wrong']);
        }
    }
}
