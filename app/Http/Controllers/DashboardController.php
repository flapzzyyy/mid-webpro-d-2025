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
        $categoryIds = TaskCategory::where('user_id', $user->id)->pluck('id');

        $totalNotStarted = Task::whereIn('category_id', $categoryIds)
            ->where('status', 'not started')
            ->count();
        $totalInProgress = Task::whereIn('category_id', $categoryIds)
            ->where('status', 'in progress')
            ->count();
        $totalCompleted = Task::whereIn('category_id', $categoryIds)
            ->where('status', 'completed')
            ->count();
        $totalTasks = Task::whereIn('category_id', $categoryIds)
            ->count();

        $recentTasks = Task::whereIn('category_id', $categoryIds)
            ->where('status', '<>', 'Completed')
            ->latest()
            ->take(3)
            ->get(['id', 'title', 'status', 'created_at']);
        $upcomingTasks = Task::whereIn('category_id', $categoryIds)
            ->where('status', '<>', 'Completed')
            ->whereNotNull('due_date')
            ->whereDate('due_date', '>=', now())
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
