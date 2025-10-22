<?php

namespace App\Http\Controllers;

use App\Models\TaskCategory;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Ambil total list dan task milik user
        $totalCategories = TaskCategory::where('user_id', $user->id)->count();
        $totalTasks = Task::whereIn('category_id', TaskCategory::where('user_id', $user->id)->pluck('id'))->count();

        // Ambil 5 task terbaru milik user
        $recentTasks = Task::whereIn('category_id', TaskCategory::where('user_id', $user->id)->pluck('id'))
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'status', 'due_date']);

        return Inertia::render('dashboard', [
            'user' => $user,
            'totalCategories' => $totalCategories,
            'totalTasks' => $totalTasks,
            'recentTasks' => $recentTasks,
        ]);
    }
}