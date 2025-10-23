<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $categories = TaskCategory::where('user_id', $user->id)
            ->get(['id', 'title', 'description']);

        return inertia('categories/index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return inertia('categories/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        TaskCategory::create([
            ...$validated,
            'user_id' => Auth::id(),
        ]);

        return redirect()->route('categories.index')->with('success', 'Category created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(TaskCategory $category)
    {
        // Ambil semua task yang terkait dengan list ini
        $tasks = $category->tasks()->orderBy('created_at', 'desc')->get();

        return Inertia::render('categories/show', [
            'category' => $category,
            'tasks' => $tasks,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TaskCategory $category)
    {
        return Inertia::render('categories/create', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TaskCategory $category)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        $category->update($validated);

        return redirect()->route('categories.index')->with('success', 'Category updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TaskCategory $category)
    {
        $category->delete();

        return redirect()->route('categories.index')->with('success', 'Category deleted successfully');
    }
}
