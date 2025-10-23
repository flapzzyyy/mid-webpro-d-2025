<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskCategory;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $totalNotStarted = Task::whereIn('category_id', TaskCategory::where('user_id', $user->id)->pluck('id'))
            ->where('status', 'not started')
            ->count();
        $totalInProgress = Task::whereIn('category_id', TaskCategory::where('user_id', $user->id)->pluck('id'))
            ->where('status', 'in progress')
            ->count();
        $totalCompleted = Task::whereIn('category_id', TaskCategory::where('user_id', $user->id)->pluck('id'))
            ->where('status', 'completed')
            ->count();
        $totalTasks = Task::whereIn('category_id', TaskCategory::where('user_id', $user->id)->pluck('id'))
            ->count();

        $recentTasks = Task::whereIn('category_id', TaskCategory::where('user_id', $user->id)->pluck('id'))
            ->latest()
            ->take(3)
            ->get(['id', 'title', 'status', 'due_date']);
        $upcomingTasks = Task::whereIn('category_id', TaskCategory::where('user_id', $user->id)->pluck('id'))
            ->whereNotNull('due_date')
            ->whereDate('due_date', '>=', now()) // hanya yang belum lewat
            ->orderBy('due_date', 'asc')
            ->take(3)
            ->get(['id', 'title', 'status', 'due_date']);

        return Inertia::render('dashboard', [
            'totalNotStarted' => $totalNotStarted,
            'totalInProgress' => $totalInProgress,
            'totalCompleted' => $totalCompleted,
            'totalTasks' => $totalTasks,
            'recentTasks' => $recentTasks,
            'upcomingTasks' => $upcomingTasks,
        ]);
    }
}
