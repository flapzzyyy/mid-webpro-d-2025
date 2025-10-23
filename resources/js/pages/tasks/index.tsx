import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, Search, Trash2, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tasks', href: '/tasks' },
];

interface Task {
    id: number;
    title: string;
    description: string | null;
    status: string;
    due_date: string | null;
    category_id: string;
    category: {
        id: number;
        title: string;
    }
}

interface Category {
    id: number;
    title: string;
}

interface Props {
    tasks: Task[];
    categories: Category[];
}

type FormData = {
    title: string;
    description: string;
    category_id: string;
    due_date: string;
    status: string;
};

export default function Tasks({ tasks, categories }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit' | null>(null);
    const [editId, setEditId] = useState<number | null>(null);

    const { url } = usePage();

    useEffect(() => {
        if (url.includes("?modal=create")) {
            setShowModal(true);
            setMode("create");
        }
    }, [url]);


    // Search & Filter
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === 'all' || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Paging
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;
    const maxPages = 5;

    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
    const displayPages = Math.min(totalPages, maxPages);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    // Form
    const [form, setForm] = useState<FormData>({
        title: '',
        description: '',
        category_id: '',
        due_date: '',
        status: 'Not Started',
    });

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEdit = (id: number) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;
        setEditId(task.id);
        setForm({
            title: task.title || '',
            description: task.description || '',
            category_id: task.category.id.toString() || '',
            due_date: task.due_date || '',
            status: task.status || 'Not Started',
        });
        setMode('edit');
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'create') {
            router.post('/tasks', form, {
                onSuccess: () => {
                    setForm({
                        title: '',
                        description: '',
                        category_id: '',
                        due_date: '',
                        status: 'Not Started',
                    });
                    setShowModal(false);
                    setMode(null);
                },
            });
        } else if (mode === 'edit') {
            router.put(`/tasks/${editId}`, form, {
                onSuccess: () => {
                    setForm({
                        title: '',
                        description: '',
                        category_id: '',
                        due_date: '',
                        status: 'Not Started',
                    });
                    setShowModal(false);
                    setMode(null);
                    setEditId(null);
                },
            });
        }
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Category | null>(null);

    const handleDeleteClick = (task: Task) => {
        setTaskToDelete(task);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (taskToDelete) {
            router.delete(`/tasks/${taskToDelete.id}`, {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setTaskToDelete(null);
                    if (paginatedTasks.length === 1 && currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                    }
                },
            });
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            Completed: 'bg-green-100 text-green-700',
            'In Progress': 'bg-yellow-100 text-yellow-700',
            'Not Started': 'bg-red-100 text-red-700',
        };
        return (
            styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700'
        );
    };

    const getStatusLabel = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="mx-auto max-w-7xl p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
                    <p className="mt-1 text-gray-500">
                        Manage your tasks and stay organized
                    </p>
                </div>
                <div className="mb-6 flex flex-row gap-4">
                    <div className="relative flex-1">
                        <Search
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-gray-800 focus:outline-none"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="min-w-[180px] rounded-lg border border-gray-300 bg-white px-2 py-2 focus:border-transparent focus:ring-2 focus:ring-gray-800 focus:outline-none"
                    >
                        <option value="all">Filter by status</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Not Started">Not Started</option>
                    </select>
                    <button
                        onClick={() => {
                            setShowModal(true);
                            setMode('create');
                        }}
                        className="rounded-lg bg-gray-900 px-6 py-2 font-medium whitespace-nowrap text-white transition hover:bg-gray-700"
                    >
                        + New Task
                    </button>
                </div>
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        List
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Due Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {paginatedTasks.length > 0 ? (
                                    paginatedTasks.map((task) => (
                                        <tr
                                            key={task.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {task.title}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs truncate text-sm text-gray-600">
                                                    {task.description || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                                                {task.category.title ||
                                                    'Uncategorized'}
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                                                {task.due_date
                                                    ? new Date(
                                                          task.due_date,
                                                      ).toLocaleDateString()
                                                    : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(task.status)}`}
                                                >
                                                    {getStatusLabel(
                                                        task.status,
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(task.id)
                                                        }
                                                        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteClick(task)
                                                        }
                                                        className="rounded-lg p-2 text-gray-600 transition hover:bg-red-50 hover:text-red-600"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-12 text-center text-gray-500"
                                        >
                                            No tasks found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {filteredTasks.length > 0 && (
                        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                            <div className="text-sm text-gray-600">
                                Showing{' '}
                                <span className="font-medium">
                                    {startIndex + 1}
                                </span>
                                -
                                <span className="font-medium">
                                    {Math.min(endIndex, filteredTasks.length)}
                                </span>{' '}
                                of{' '}
                                <span className="font-medium">
                                    {filteredTasks.length}
                                </span>{' '}
                                results
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`rounded px-3 py-1 text-sm transition ${
                                        currentPage === 1
                                            ? 'cursor-not-allowed text-gray-400'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    &lt;
                                </button>
                                {Array.from(
                                    { length: displayPages },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`rounded px-3 py-1 text-sm font-medium transition ${
                                            currentPage === page
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`rounded px-3 py-1 text-sm transition ${
                                        currentPage === totalPages
                                            ? 'cursor-not-allowed text-gray-400'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    &gt;
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => {
                        setShowModal(false);
                        setMode(null);
                        setEditId(null);
                    }}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            {mode === 'create' && (
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Create New Task
                                </h2>
                            )}
                            {mode === 'edit' && (
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Edit Task
                                </h2>
                            )}
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setMode(null);
                                    setEditId(null);
                                }}
                                className="text-gray-400 transition hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 px-6 py-5"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Title{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-gray-800 focus:outline-none"
                                    placeholder="Enter task title"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleInputChange}
                                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-gray-800 focus:outline-none"
                                    rows={3}
                                    placeholder="Enter task description"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Category{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category_id"
                                    value={form.category_id}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-gray-800 focus:outline-none"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    name="due_date"
                                    value={form.due_date}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-gray-800 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-gray-800 focus:outline-none"
                                >
                                    <option value="Not Started">
                                        Not Started
                                    </option>
                                    <option value="In Progress">
                                        In Progress
                                    </option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showDeleteModal && taskToDelete && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={() => setShowDeleteModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-100 rounded-full">
                                    <Trash2 className="text-red-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Delete Task
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        This action cannot be undone
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 mb-2">
                                Are you sure you want to delete{" "}
                                <span className="font-semibold text-gray-900">
                                    "{taskToDelete.title}"
                                </span>
                                ?
                            </p>
                            <p className="text-sm text-gray-500">
                                This task will be permanently deleted and cannot be recovered.
                            </p>
                        </div>
                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                            >
                                Delete Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
