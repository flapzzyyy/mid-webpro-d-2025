<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TaskCategory;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Task::with('category')
            ->whereHas('category', function ($query) {
                $query->where('user_id', Auth::id());
            })->orderBy('created_at', 'desc');

        // search
        if (request()->has('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // filter by status (mapping dari parameter 'filter')
        if (request()->has('filter') && request('filter') !== 'all') {
            $filter = request('filter');
            $statusMap = [
                'completed' => 'Completed',
                'in_progress' => 'In Progress',
                'not_started' => 'Not Started',
            ];
            if (isset($statusMap[$filter])) {
                $query->where('status', $statusMap[$filter]);
            }
        }

        $tasks = $query->paginate(10);
        $categories = TaskCategory::where('user_id', Auth::id())->get();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'categories' => $categories,
            'filters' => [
                'search' => request('search', ''),
                'filter' => request('filter', 'all'),
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // Ambil semua list milik user yang login
        $categories = \App\Models\TaskCategory::where('user_id', Auth::id())->get();

        // Jika dikirim ?list_id=... dari URL (misal dari tombol di halaman list)
        $selectedList = $request->get('category_id');

        return \Inertia\Inertia::render('tasks/create', [
            'categories' => $categories,
            'selectedList' => $selectedList,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'required|string|in:Not Started,In Progress,Completed',
            'category_id' => 'required|exists:categories,id',
        ]);

        \App\Models\Task::create($validated);

        return redirect()->route('tasks.index')->with('success', 'Task created successfully.');
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
    public function edit(\App\Models\Task $task)
    {
        // Ambil semua list milik user (buat dropdown)
        $categories = \App\Models\TaskCategory::where('user_id', Auth::id())->get();

        return \Inertia\Inertia::render('tasks/create', [
            'task' => $task,
            'categories' => $categories,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
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


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();
        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully');
    }
}