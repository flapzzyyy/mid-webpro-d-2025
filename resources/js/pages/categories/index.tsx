import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";

interface Category {
    id: number;
    title: string;
    description: string | null;
}

interface Props {
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories', href: '/categories' },
];

export default function Categories({ categories }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">Categories</h1>
                        <p className="text-gray-600 mt-1">
                            Manage all your categories here.
                        </p>
                    </div>

                    <Link
                        href="/categories/create"
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700"
                    >
                        + Create Category
                    </Link>
                </div>

                {/* Category list */}
                {categories.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition"
                            >
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    {category.title}
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    {category.description
                                        ? category.description
                                        : "No description provided."}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-12 border rounded-lg">
                        No categories found.
                    </div>
                )}
            </div>
        </AppLayout>
    );
}


