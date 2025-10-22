import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories', href: '/tasks' },
];

type Props = {
    categories: Array<{
        id: number;
        title: string;
        description?: string;
        tasks_count?: number;
    }>;
    flash?: { success?: string; error?: string } | string | null;
};

export default function Index({ categories = [], flash = null }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold">Categories</h1>
                    <Link href="/categories/create" className="btn">
                        + New Category
                    </Link>
                </div>

                {typeof flash === 'string' && (
                    <div className="mb-4 text-green-600">{flash}</div>
                )}
                {flash && typeof flash === 'object' && flash.success && (
                    <div className="mb-4 text-green-600">{flash.success}</div>
                )}

                <div className="grid gap-4 md:grid-cols-3">
                    {categories.length === 0 ? (
                        <div className="col-span-3 p-6 border rounded">No categories yet.</div>
                    ) : (
                        categories.map((c) => (
                            <div key={c.id} className="p-4 border rounded">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-lg font-medium">{c.title}</h2>
                                    <div className="text-sm text-muted">{c.tasks_count ?? 0} tasks</div>
                                </div>
                                {c.description && <p className="mt-2 text-sm">{c.description}</p>}
                                <div className="mt-4 flex gap-2">
                                    <Link href={`/categories/${c.id}/edit`} className="text-sm underline">Edit</Link>
                                    <Link href={`/categories/${c.id}`} className="text-sm underline">View</Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            if (confirm(`Delete category "${c.title}"? This action cannot be undone.`)) {
                                                router.delete(`/categories/${c.id}`);
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

