<?php

namespace App\Http\Controllers;

use App\Models\TaskCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $query = TaskCategory::where('user_id', $user->id)
            ->select('id', 'title', 'description')
            ->withCount('tasks'); // 🔥 Tambahkan ini untuk menghitung jumlah task per kategori

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $categories = $query->get();

        return Inertia::render('categories/index', [
            'categories' => $categories,
            'filters' => [
                'search' => request('search', ''),
            ],
        ]);
    }

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

    public function update(Request $request, TaskCategory $category)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category->update($validated);

        return redirect()->route('categories.index')->with('success', 'Category updated successfully');
    }

    public function destroy(TaskCategory $category)
    {
        $category->delete();

        return redirect()->route('categories.index')->with('success', 'Category deleted successfully');
    }
}
