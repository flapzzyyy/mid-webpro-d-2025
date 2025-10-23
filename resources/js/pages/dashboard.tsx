import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" }
];

type Props = {
    totalNotStarted: number;
    totalInProgress: number;
    totalCompleted: number;
    totalTasks: number;

    recentTasks: Array<{
        id: number;
        title: string;
        status: string;
        created_at: string;
    }>;
    
    upcomingTasks: Array<{
        id: number;
        title: string;
        status: string;
        due_date: string;
    }>;
};


export default function Dashboard({ totalNotStarted, totalInProgress, totalCompleted, totalTasks, recentTasks, upcomingTasks }: Props) 
{
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">Dashboard</h1>
                        <p className="text-gray-600 mt-1">Welcome back! Here's your overview.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href={`/tasks?modal=create`} className="px-4 py-2 text-sm font-medium bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">+ Create Task</Link>
                        <Link href={`/categories?modal=create`} className="px-4 py-2 text-sm font-medium bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">+ Create Category</Link>
                    </div>
                </div>
                <div className="grid gap-4 grid-rows-3 grid-cols-4">
                    <div className="bg-red-50 border rounded-xl p-4 text-center">
                        <h2 className="font-medium text-red-700">Not Started Tasks</h2>
                        <p className="text-3xl font-bold text-red-600 my-6 pt">{totalNotStarted}</p>
                        <p className="text-sm text-gray-500 mt-1">Waiting to start</p>
                    </div>
                    <div className="bg-yellow-50 border rounded-xl p-4 text-center">
                        <h2 className="font-medium text-yellow-700">In Progress Tasks</h2>
                        <p className="text-3xl font-bold text-yellow-600 my-6">{totalInProgress}</p>
                        <p className="text-sm text-gray-500 mt-1">Is running</p>
                    </div>
                    <div className="bg-green-50 border rounded-xl p-4 text-center">
                        <h2 className="font-medium text-green-700">Completed Tasks</h2>
                        <p className="text-3xl font-bold text-green-600 my-6">{totalCompleted}</p>
                        <p className="text-sm text-gray-500 mt-1">Finished</p>
                    </div>
                    <div className="bg-blue-50 border rounded-xl p-4 text-center">
                        <h2 className="font-medium text-blue-700">Total Tasks</h2>
                        <p className="text-3xl font-bold text-blue-600 my-6">{totalTasks}</p>
                        <p className="text-sm text-gray-500 mt-1">All your tasks</p>
                    </div>
                    <div className="bg-gray-50 border rounded-xl p-4 row-span-2 col-span-2">
                        <h2 className="text-lg font-bold mb-1">Upcoming Tasks</h2>
                        <p className="text-sm text-gray-500 mb-4">Plan ahead with tasks due soon.</p>
                        {upcomingTasks.length > 0 ? (
                            <ul className="space-y-2">
                                {upcomingTasks.map((task) => (
                                    <li 
                                        key={task.id} 
                                        className="bg-white p-3 border rounded-lg hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-800">{task.title}</p>
                                            <p className="text-sm text-gray-500 capitalize">{task.status}</p>
                                        </div>
                                        <div className="text-right text-xs text-gray-400">
                                            <p>Due date</p>
                                            <p>{new Date(task.due_date).toLocaleDateString()}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            ) : (
                            <p className="text-sm text-gray-400">No upcoming tasks.</p>
                        )}
                    </div>
                    <div className="bg-gray-50 border rounded-xl p-4 row-span-2 col-span-2">
                        <h2 className="text-lg font-bold mb-1">Recent Tasks</h2>
                        <p className="text-sm text-gray-500 mb-4">Keep up with your most recent tasks.</p>
                        {recentTasks.length > 0 ? (
                            <ul className="space-y-2">
                                {recentTasks.map((task) => (
                                    <li 
                                        key={task.id} 
                                        className="bg-white p-3 border rounded-lg hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-800">{task.title}</p>
                                            <p className="text-sm text-gray-500 capitalize">{task.status}</p>
                                        </div>
                                        <div className="text-right text-xs text-gray-400">
                                            <p>Created at</p>
                                            <p>{new Date(task.created_at.replace(" ", "T")).toLocaleDateString()}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            ) : (
                            <p className="text-sm text-gray-400">No recent tasks.</p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}