import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

type Props = {
  category: {
    id: number;
    title: string;
    description?: string;
  };
  tasks: Array<{
    id: number;
    title: string;
    status: string;
    due_date?: string;
  }>;
};

export default function Show({ category, tasks }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "categories", href: "/categories" },
    { title: category.title, href: `/categories/${category.id}` },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={category.title} />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">{category.title}</h1>
        {category.description && (
          <p className="text-gray-600 mb-4">{category.description}</p>
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Tasks</h2>
          <Link
            href={`/tasks/create?category_id=${category.id}`}
            className="text-sm underline"
          >
            + Add Task
          </Link>
        </div>

        {tasks.length === 0 ? (
          <div className="p-4 border rounded text-gray-500">No tasks yet.</div>
        ) : (
          <div className="space-y-2">
            {tasks.map((t) => (
              <div key={t.id} className="p-3 border rounded">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t.title}</span>
                  <span className="text-sm text-gray-500">{t.status}</span>
                </div>
                {t.due_date && (
                  <p className="text-xs text-gray-400">Due: {t.due_date}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
