<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePasswordIsSet
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() &&
            is_null($request->user()->password) &&
            ! $request->routeIs('password.set') &&
            ! $request->routeIs('password.set.store')
        ) {
            return redirect()->route('password.set');
        }

        return $next($request);
    }
}
