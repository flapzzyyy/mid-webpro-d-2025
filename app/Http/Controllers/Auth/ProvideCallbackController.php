<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Str;

class ProvideCallbackController extends Controller
{
    public function __invoke(Request $request, string $provider)
    {
        if(!in_array($provider, ['google', 'github'])) {
            return redirect()->route('login')->withErrors(['provider'=>'Invalid provider']);
        }

        $sosmedUser = Socialite::driver($provider)->user();

        $username = $this->generateUsername($sosmedUser, $provider);

        $user = User::updateOrCreate([
            'provider_id' => $sosmedUser->id,
            'provider_name' => $provider,
        ], [
            'name' => $sosmedUser->name,
            'email' => $sosmedUser->email,
            'username' => $username,
            'provider_token' => $sosmedUser->token,
            'provider_refresh_token' => $sosmedUser->refreshToken,
            'email_verified_at' => now(),
        ]);

        Auth::login($user);

        return redirect('/dashboard');
    }

    private function generateUsername($sosmedUser, $provider)
    {
        $username = $sosmedUser->getNickname() ?? null;

        if (!$username) {
            if(!empty($sosmedUser->name)) {
                $username = Str::lower(str_replace(' ', '', $sosmedUser->name)).'_'.rand(1000, 9999);
            } else {
                $username = Str::lower(str_replace(' ', '', $sosmedUser->email)).'_'.rand(1000, 9999);
            }
        }
        $username = preg_replace('/[^a-zA-Z0-9]/', '', Str::lower($username));

        $baseUsername = $username;
        $counter = 1;
        while (User::where('username', $username)->exists()) {
            $username = $baseUsername.'_'.$counter;
            $counter++;
        }

        return $username;
    }
}
