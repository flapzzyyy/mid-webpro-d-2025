import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

type Props = {
  category?: {
    id: number;
    title: string;
    description?: string;
  };
};

export default function CreateOrEdit({ category }: Props) {
  const form = useForm({
    title: category?.title ?? '',
    description: category?.description ?? '',
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    if (category) {
      form.put(`/categories/${category.id}`);
    } else {
      form.post('/categories');
    }
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories', href: '/categories' },
    { title: category ? 'Edit' : 'Create', href: category ? `/categories/${category.id}/edit` : '/categories/create' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={category ? 'Edit Category' : 'Create Category'} />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">
          {category ? 'Edit Category' : 'Create New Category'}
        </h1>

        <form onSubmit={submit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={form.data.title}
              onChange={(e) => form.setData('title', e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Enter category title"
            />
            {form.errors.title && (
              <p className="text-sm text-red-500">{form.errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={form.data.description}
              onChange={(e) => form.setData('description', e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Optional description..."
            />
          </div>

          {/* Submit Button */}
          <div>
            <Button type="submit" disabled={form.processing}>
              {form.processing
                ? 'Saving...'
                : category
                ? 'Update Category'
                : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
