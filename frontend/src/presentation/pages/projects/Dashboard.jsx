import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
    FolderKanban,
    ListChecks,
    CheckCircle2,
    TrendingUp,
    CalendarDays,
    AlertTriangle,
    ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import NavBar from "../../components/NavBar";
import { useAuth } from "../../../context/AuthContext";
import * as reportService from "../../../services/reportService";
import StatCard from "../../components/dashboard/StatCard";
import TasksByStatusChart from "../../components/dashboard/TasksByStatusChart";
import ProductivityChart from "../../components/dashboard/ProductivityChart";

const completedPeriods = [
    { key: "week", label: "Semana" },
    { key: "month", label: "Mes" },
    { key: "day", label: "Día" },
];

const Dashboard = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [pendingProjects, setPendingProjects] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [tasksByStatus, setTasksByStatus] = useState([]);
    const [productivity, setProductivity] = useState([]);
    const [period, setPeriod] = useState("week");
    const [productivityPeriod, setProductivityPeriod] = useState("month");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const sumRes = await reportService.getSummary();
                setSummary(sumRes.data.data);
            } catch (err) {
                toast.error(err.response?.data?.message || "Error al cargar resumen");
            }

            try {
                const pendRes = await reportService.getProjectsMostPending();
                setPendingProjects(pendRes.data.data);
            } catch (err) {
                toast.error(err.response?.data?.message || "Error al cargar proyectos");
            }

            try {
                const tasksRes = await reportService.getCompletedTasks(period);
                setCompletedTasks(tasksRes.data.data.tasks);
            } catch (err) {
                toast.error(err.response?.data?.message || "Error al cargar tareas");
            }

            try {
                const statusRes = await reportService.getTasksByStatus();
                const d = statusRes.data.data;
                setTasksByStatus(
                    d.labels.map((label, i) => ({
                        name: label,
                        value: d.values[i],
                    })),
                );
            } catch {
                // not critical
            }

            try {
                const prodRes = await reportService.getProductivityByDay(productivityPeriod);
                setProductivity(prodRes.data.data);
            } catch {
                // not critical
            }

            setLoading(false);
        };
        fetchData();
    }, [period, productivityPeriod]);

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200">
                <NavBar />
                <div className="flex items-center justify-center min-h-[80vh]">
                    <span className="loading loading-spinner loading-lg text-primary" />
                </div>
            </div>
        );
    }

    const stats = [
        {
            label: "Proyectos",
            value: summary?.totalProjects ?? 0,
            icon: FolderKanban,
            color: "bg-primary/10 text-primary",
        },
        {
            label: "Tareas",
            value: summary?.totalTasks ?? 0,
            icon: ListChecks,
            color: "bg-secondary/10 text-secondary",
        },
        {
            label: "Completadas",
            value: `${summary?.completedPercentage ?? 0}%`,
            icon: CheckCircle2,
            color: "bg-success/10 text-success",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-primary/5">
            <NavBar />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-base-content/60 mt-1">
                            Bienvenido, {user?.name || "usuario"}
                        </p>
                    </div>
                    <Link
                        to="/projects"
                        className="btn btn-outline btn-sm btn-primary"
                    >
                        Ver proyectos
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <TasksByStatusChart data={tasksByStatus} />
                    <ProductivityChart
                        data={productivity}
                        period={productivityPeriod}
                        onPeriodChange={setProductivityPeriod}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card bg-base-100 shadow-md border border-base-200">
                        <div className="card-body p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-semibold">
                                    Proyectos con más tareas pendientes
                                </h2>
                            </div>

                            {pendingProjects.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Proyecto</th>
                                                <th className="text-right">Pendientes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pendingProjects.map((proj, i) => (
                                                <tr key={proj.projectId}>
                                                    <td className="font-medium text-base-content/60">
                                                        {i + 1}
                                                    </td>
                                                    <td>{proj.name}</td>
                                                    <td className="text-right">
                                                        <span className="badge badge-warning badge-sm">
                                                            {proj.pendingTasks}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-base-content/40">
                                    <AlertTriangle className="w-12 h-12 mb-3" />
                                    <p className="text-lg font-medium">Sin tareas pendientes</p>
                                    <p className="text-sm">No hay proyectos con tareas pendientes</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-md border border-base-200">
                        <div className="card-body p-6">
                            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="w-5 h-5 text-primary" />
                                    <h2 className="text-xl font-semibold">Tareas completadas</h2>
                                </div>

                                <div className="flex gap-1 bg-base-200 rounded-lg p-1">
                                    {completedPeriods.map((p) => (
                                        <button
                                            key={p.key}
                                            onClick={() => setPeriod(p.key)}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                                                period === p.key
                                                    ? "bg-primary text-primary-content shadow-sm"
                                                    : "text-base-content/60 hover:text-base-content"
                                            }`}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {completedTasks.length > 0 ? (
                                <div className="space-y-3">
                                    {completedTasks.map((task) => (
                                        <div
                                            key={task._id}
                                            className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium truncate">{task.title}</p>
                                                {task.fk_project && (
                                                    <p className="text-sm text-base-content/50 truncate">
                                                        {task.fk_project.name}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="badge badge-success badge-sm shrink-0 ml-3">
                                                Hecha
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-base-content/40">
                                    <CheckCircle2 className="w-12 h-12 mb-3" />
                                    <p className="text-lg font-medium">Sin tareas completadas</p>
                                    <p className="text-sm">No hay tareas completadas en este período</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
