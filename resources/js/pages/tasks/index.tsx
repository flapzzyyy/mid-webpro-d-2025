import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tasks', href: '/tasks' },
];

type Task = {
    id: number;
    title: string;
    description?: string;
    status?: string;
    due_date?: string;
    category?: { id: number; title: string } | null;
};

type Props = {
    tasks: {
        data: Task[];
        current_page?: number;
        last_page?: number;
        total?: number;
    };
    categories: Array<{ id: number; title: string }>;
    filters?: { search?: string; filter?: string };
    flash?: { success?: string; error?: string } | string | null;
};

export default function Index({ tasks = { data: [] }, categories = [], filters = {}, flash = null }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [filter, setFilter] = useState(filters.filter || 'all');

    function onSearch(e: FormEvent) {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (filter) params.set('filter', filter);
        // simple navigation via link (full Inertia form alternative omitted for brevity)
        window.location.href = `/tasks?${params.toString()}`;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold">Tasks</h1>
                    <Link href="/tasks/create" className="btn">+ New Task</Link>
                </div>

                {flash && typeof flash === 'object' && flash.success && (
                    <div className="mb-4 text-green-600">{flash.success}</div>
                )}

                <form onSubmit={onSearch} className="flex gap-2 mb-4">
                    <input value={search} onChange={(e) => setSearch(e.target.value)} name="search" placeholder="Search title or description" className="input" />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} name="filter" className="input">
                        <option value="all">All</option>
                        <option value="completed">Completed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="not_started">Not Started</option>
                    </select>
                    <button type="submit" className="btn">Apply</button>
                </form>

                <div className="space-y-3">
                    {tasks.data.length === 0 ? (
                        <div className="p-4 border rounded">No tasks found.</div>
                    ) : (
                        tasks.data.map((t) => (
                            <div key={t.id} className="p-4 border rounded flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium">{t.title}</h3>
                                    {t.category && <div className="text-sm text-muted">{t.category.title}</div>}
                                    {t.description && <p className="mt-1 text-sm">{t.description}</p>}
                                    {t.due_date && <div className="text-xs mt-1">Due: {new Date(t.due_date).toLocaleDateString()}</div>}
                                </div>
                                <div className="text-right">
                                    <div className="mb-2 text-sm">{t.status}</div>
                                    <div className="flex flex-col gap-1">
                                        <Link href={`/tasks/${t.id}/edit`} className="text-sm underline">Edit</Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                if (confirm(`Delete task "${t.title}"?`)) {
                                                    router.delete(`/tasks/${t.id}`);
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-4 text-sm text-muted">
                    Page {tasks.current_page ?? 1} of {tasks.last_page ?? 1} — Total: {tasks.total ?? tasks.data.length}
                </div>
            </div>
        </AppLayout>
    );
}

