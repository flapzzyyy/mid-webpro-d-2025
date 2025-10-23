<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TaskCategory;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $categoryIds = TaskCategory::where('user_id', $user->id)->pluck('id');
        $query = Task::with('category')
            ->whereIn('category_id', $categoryIds)
            ->orderBy('created_at', 'desc');

        if (request()->has('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (request()->has('filter') && request('filter') !== 'all') {
            $filter = request('filter');
            $statusMap = [
                'Completed' => 'Completed',
                'In Progress' => 'In Progress',
                'Not Started' => 'Not Started',
            ];

            if (isset($statusMap[$filter])) {
                $query->where('status', $statusMap[$filter]);
            }
        }

        $tasks = $query->get(['id', 'title', 'description', 'status', 'due_date', 'category_id']);
        $categories = TaskCategory::where('user_id', $user->id)->get();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'categories' => $categories,
            'filters' => [
                'search' => request('search', ''),
                'filter' => request('filter', 'all'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'required|string|in:Not Started,In Progress,Completed',
            'category_id' => 'required|exists:categories,id',
        ]);

        Task::create($validated);
        return redirect()->route('tasks.index')->with('success', 'Task created successfully.');
    }

    public function update(Request $request, \App\Models\Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'required|string|in:Not Started,In Progress,Completed',
            'category_id' => 'required|exists:categories,id',
        ]);

        $task->update($validated);
        return redirect()->route('tasks.index')->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully');
    }
}