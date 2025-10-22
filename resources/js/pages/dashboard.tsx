import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

type Props = {
  user: {
    name: string;
    email: string;
  };
  totalCategories: number;
  totalTasks: number;
  recentTasks: Array<{
    id: number;
    title: string;
    status: string;
    due_date?: string;
  }>;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: "Dashboard", href: "/dashboard" }];

export default function Dashboard({
                                    user,
                                    totalCategories,
                                    totalTasks,
                                    recentTasks,
                                }: Props) 
{
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-6 space-y-6">
                <h1 className="text-3xl font-semibold">Welcome, {user.name} 👋</h1>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                <div className="border rounded-xl p-4 text-center shadow-sm">
                    <h2 className="text-xl font-medium">Categories</h2>
                    <p className="text-3xl font-bold text-blue-600">{totalCategories}</p>
                </div>
                <div className="border rounded-xl p-4 text-center shadow-sm">
                    <h2 className="text-xl font-medium">Tasks</h2>
                    <p className="text-3xl font-bold text-green-600">{totalTasks}</p>
                </div>
                <div className="border rounded-xl p-4 text-center shadow-sm">
                    <h2 className="text-xl font-medium">Completed</h2>
                    <p className="text-3xl font-bold text-gray-600">
                    {recentTasks.filter((t) => t.status === "Completed").length}
                    </p>
                </div>
                </div>

                {/* Recent Tasks */}
                <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-3">Recent Tasks</h2>
                {recentTasks.length === 0 ? (
                    <p className="text-gray-500">No recent tasks yet.</p>
                ) : (
                    <div className="border rounded-xl divide-y">
                    {recentTasks.map((task) => (
                        <div
                        key={task.id}
                        className="flex justify-between items-center p-3 hover:bg-gray-50"
                        >
                        <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-gray-500">
                            {task.due_date ? `Due: ${task.due_date}` : "No due date"}
                            </p>
                        </div>
                        <span
                            className={`text-sm px-3 py-1 rounded-full ${
                            task.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : task.status === "In Progress"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {task.status}
                        </span>
                        </div>
                    ))}
                    </div>
                )}
                <div className="mt-3">
                    <Link
                    href="/tasks"
                    className="text-blue-600 underline hover:text-blue-800"
                    >
                    View All Tasks →
                    </Link>
                </div>
                </div>
            </div>
        </AppLayout>
    );
}
