import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tasks', href: '/tasks' },
];

// type Task = {
//     id: number;
//     title: string;
//     description?: string;
//     status?: string;
//     due_date?: string;
//     category?: { id: number; title: string } | null;
// };

// type Props = {
//     tasks: {
//         data: Task[];
//         current_page?: number;
//         last_page?: number;
//         total?: number;
//     };
//     categories: Array<{ id: number; title: string }>;
//     filters?: { search?: string; filter?: string };
//     flash?: { success?: string; error?: string } | string | null;
// };

interface Task {
    id: number;
    title: string;
    status: "not started" | "in progress" | "completed"; // enum-like
    due_date: string | null;
}

interface TasksProps {
    tasks: Task[];
}

// export default function Index({ tasks = { data: [] }, categories = [], filters = {}, flash = null }: Props) {

export default function Tasks({ tasks }: TasksProps) {
    // const [search, setSearch] = useState(filters.search || '');
    // const [filter, setFilter] = useState(filters.filter || 'all');

    // function onSearch(e: FormEvent) {
    //     e.preventDefault();
    //     const params = new URLSearchParams();
    //     if (search) params.set('search', search);
    //     if (filter) params.set('filter', filter);
    //     // simple navigation via link (full Inertia form alternative omitted for brevity)
    //     window.location.href = `/tasks?${params.toString()}`;
    // }

    const [filter, setFilter] = useState("all");
    const filteredTasks =
    filter === "all"
        ? tasks
        : tasks.filter(
              (t) => t.status.toLowerCase() === filter.toLowerCase()
          );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold">Tasks</h1>
                    <p className="text-gray-600 mt-1">Manage all your tasks here.</p>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                                filter === "all"
                                    ? "bg-gray-800 text-white"
                                    : "bg-white hover:bg-gray-100"
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter("not started")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                                filter === "not started"
                                    ? "bg-red-600 text-white"
                                    : "bg-white hover:bg-gray-100"
                            }`}
                        >
                            Not Started
                        </button>
                        <button
                            onClick={() => setFilter("in progress")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                                filter === "in progress"
                                    ? "bg-yellow-500 text-white"
                                    : "bg-white hover:bg-gray-100"
                            }`}
                        >
                            In Progress
                        </button>
                        <button
                            onClick={() => setFilter("completed")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                                filter === "completed"
                                    ? "bg-green-600 text-white"
                                    : "bg-white hover:bg-gray-100"
                            }`}
                        >
                            Completed
                        </button>
                    </div>

                    <Link
                        href='/tasks/create'
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700"
                    >
                        + Create Task
                    </Link>
                </div>

                {filteredTasks.length > 0 ? (
                    <div className="grid gap-3">
                        {filteredTasks.map((task) => (
                            <div
                                key={task.id}
                                className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {task.title}
                                    </p>
                                    <p className="text-sm text-gray-500 capitalize">
                                        {task.status}
                                    </p>
                                    {task.due_date && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            Due:{" "}
                                            {new Date(
                                                task.due_date
                                            ).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>

                                {/* Badge status */}
                                <span
                                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                                        task.status === "completed"
                                            ? "bg-green-100 text-green-700"
                                            : task.status === "in progress"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {task.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-12 border rounded-lg">
                        No tasks found.
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

