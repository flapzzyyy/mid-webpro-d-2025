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
            <Head title="Dashboard" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold">Categories</h1>
                    <p className="text-gray-600 mt-1">Manage all your categories here.</p>
                </div>
            </div>
        </AppLayout>
    );
}

