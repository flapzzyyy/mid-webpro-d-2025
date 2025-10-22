import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { FormEvent } from "react";
import { type BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";

type Props = {
  task?: {
    id: number;
    title: string;
    description?: string;
    due_date?: string;
    status: string;
    category_id: number;
  };
  categories: Array<{ id: number; title: string }>;
};

export default function CreateOrEdit({ task, categories }: Props) {
  const form = useForm({
    title: task?.title ?? "",
    description: task?.description ?? "",
    due_date: task?.due_date ?? "",
    status: task?.status ?? "Not Started",
    category_id: task?.category_id ?? (categories.length > 0 ? categories[0].id : ""),
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    if (task) {
      form.put(`/tasks/${task.id}`);
    } else {
      form.post("/tasks");
    }
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Tasks", href: "/tasks" },
    {
      title: task ? "Edit" : "Create",
      href: task ? `/tasks/${task.id}/edit` : "/tasks/create",
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={task ? "Edit Task" : "Create Task"} />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">
          {task ? "Edit Task" : "Create New Task"}
        </h1>

        <form onSubmit={submit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={form.data.title}
              onChange={(e) => form.setData("title", e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Enter task title"
            />
            {form.errors.title && (
              <p className="text-sm text-red-500">{form.errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={form.data.description}
              onChange={(e) => form.setData("description", e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Optional description..."
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              value={form.data.due_date}
              onChange={(e) => form.setData("due_date", e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={form.data.status}
              onChange={(e) => form.setData("status", e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={form.data.category_id}
              onChange={(e) => form.setData("category_id", Number(e.target.value))}
              className="w-full border rounded p-2"
            >
              {categories.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div>
            <Button type="submit" disabled={form.processing}>
              {form.processing
                ? "Saving..."
                : task
                ? "Update Task"
                : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
