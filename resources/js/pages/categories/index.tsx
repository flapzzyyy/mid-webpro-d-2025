import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Pencil, Trash2, Search, X } from "lucide-react";
import { useState, useEffect } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories', href: '/categories' },
];

interface Category {
    id: number;
    title: string;
    description: string | null;
    tasks_count: number
}

interface Props {
    categories: Category[];
}

type FormData = {
    title: string;
    description: string;
};


export default function Categories({ categories }: Props) {
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


    // Search
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategories = categories.filter((category) => {
        const matchesSearch =
            category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    })

    // Paging
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;
    const maxPages = 5;

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const displayPages = Math.min(totalPages, maxPages);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    // Form
    const [form, setForm] = useState<FormData>({
        title: '',
        description: '',
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
        const category = categories.find((t) => t.id === id);
        if (!category) return;
        setEditId(category.id);
        setForm({
            title: category.title || '',
            description: category.description || '',
        });
        setMode('edit');
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'create') {
            router.post('/categories', form, {
                onSuccess: () => {
                    setForm({
                        title: '',
                        description: '',
                    });
                    setShowModal(false);
                    setMode(null);
                },
            });
        } else if (mode === 'edit') {
            router.put(`/categories/${editId}`, form, {
                onSuccess: () => {
                    setForm({
                        title: '',
                        description: '',
                    });
                    setShowModal(false);
                    setMode(null);
                    setEditId(null);
                },
            });
        }
    };

    //Delete
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (categoryToDelete) {
            router.delete(`/categories/${categoryToDelete.id}`, {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setCategoryToDelete(null);
                    if (paginatedCategories.length === 1 && currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                    }
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-500 mt-1">
                        Organize your tasks with custom categories.
                    </p>
                </div>
                <div className="flex flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setShowModal(true);
                            setMode('create');
                        }}
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition whitespace-nowrap"
                    >
                        + New Category
                    </button>
                </div>
                {paginatedCategories.length > 0 ? (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                            {paginatedCategories.map((category) => (
                                <div
                                    key={category.id}
                                    className="group border border-gray-200 rounded-xl p-5 bg-white hover:shadow-lg hover:border-gray-300 transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <h2 className="text-lg font-semibold text-gray-900">
                                                    {category.title}
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() =>
                                                    handleEdit(category.id)
                                                }
                                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(category)}
                                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                        {category.description || "No description provided."}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <span className="text-xs text-gray-500">
                                            Tasks Count: {category.tasks_count}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {filteredCategories.length > 0 && (
                            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                                <div className="text-sm text-gray-600">
                                    Showing{' '}
                                    <span className="font-medium">
                                        {startIndex + 1}
                                    </span>
                                    -
                                    <span className="font-medium">
                                        {Math.min(endIndex, filteredCategories.length)}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-medium">
                                        {filteredCategories.length}
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
                    </>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {searchQuery ? "No categories found" : "No categories yet"}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {searchQuery
                                ? "Try adjusting your search terms"
                                : "Get started by creating your first category"}
                        </p>
                    </div>
                )}
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
                                    Create New Category
                                </h2>
                            )}
                            {mode === 'edit' && (
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Edit Category
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
            {showDeleteModal && categoryToDelete && (
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
                                        Delete Category
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
                                    "{categoryToDelete.title}"
                                </span>
                                ?
                            </p>
                            <p className="text-sm text-gray-500">
                                All tasks associated with this category may be affected.
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
                                Delete Category
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
