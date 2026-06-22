import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
    ListChecks,
    Filter,
    CalendarDays,
    FolderKanban,
    ChevronLeft,
    ChevronRight,
    Flag,
} from "lucide-react";
import toast from "react-hot-toast";
import NavBar from "../../components/NavBar";
import * as taskService from "../../../services/taskService";
import * as projectService from "../../../services/projectService";

const PRIORITIES = [
    { value: "", label: "Todas" },
    { value: "low", label: "Baja" },
    { value: "mid", label: "Media" },
    { value: "high", label: "Alta" },
];

const STATUSES = [
    { value: "", label: "Todos" },
    { value: "pending", label: "Pendiente" },
    { value: "in_progress", label: "En progreso" },
    { value: "completed", label: "Completada" },
];

const priorityColor = {
    low: "badge-info",
    mid: "badge-warning",
    high: "badge-error",
};

const statusColor = {
    pending: "badge-ghost",
    in_progress: "badge-info",
    completed: "badge-success",
};

const TasksPage = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize] = useState(10);
    const [filters, setFilters] = useState({
        projectId: "",
        status: "",
        priority: "",
    });

    useEffect(() => {
        projectService.getProjects().then(({ data: res }) => {
            setProjects(res.data);
        }).catch(() => {});
    }, []);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const params = { page, pageSize };
                if (filters.projectId) params.projectId = filters.projectId;
                if (filters.status) params.status = filters.status;
                if (filters.priority) params.priority = filters.priority;

                const { data: res } = await taskService.getTasks(params);
                setTasks(res.data.items);
                setTotalItems(res.data.total_items);
            } catch (err) {
                toast.error(err.response?.data?.message || "Error al cargar tareas");
            } finally {
                setLoading(false);
            }
        })();
    }, [page, filters, pageSize]);

    const totalPages = Math.ceil(totalItems / pageSize);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-base-200 via-base-100 to-primary/5">
            <NavBar />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Tareas</h1>
                        <p className="text-base-content/60 mt-1">
                            {totalItems} tarea{totalItems !== 1 ? "s" : ""} en total
                        </p>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-md border border-base-200 mb-8">
                    <div className="card-body p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Filter className="w-4 h-4 text-base-content/60" />
                            <span className="text-sm font-medium text-base-content/60">
                                Filtros
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="label py-1">
                                    <span className="label-text text-xs">
                                        Proyecto
                                    </span>
                                </label>
                                <select
                                    className="select select-bordered select-sm w-full"
                                    value={filters.projectId}
                                    onChange={(e) =>
                                        handleFilterChange("projectId", e.target.value)
                                    }
                                >
                                    <option value="">Todos los proyectos</option>
                                    {projects.map((p) => (
                                        <option key={p._id} value={p._id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="label py-1">
                                    <span className="label-text text-xs">
                                        Estado
                                    </span>
                                </label>
                                <select
                                    className="select select-bordered select-sm w-full"
                                    value={filters.status}
                                    onChange={(e) =>
                                        handleFilterChange("status", e.target.value)
                                    }
                                >
                                    {STATUSES.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="label py-1">
                                    <span className="label-text text-xs">
                                        Prioridad
                                    </span>
                                </label>
                                <select
                                    className="select select-bordered select-sm w-full"
                                    value={filters.priority}
                                    onChange={(e) =>
                                        handleFilterChange("priority", e.target.value)
                                    }
                                >
                                    {PRIORITIES.map((p) => (
                                        <option key={p.value} value={p.value}>
                                            {p.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <span className="loading loading-spinner loading-lg text-primary" />
                    </div>
                ) : tasks.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                            {tasks.map((task) => (
                                <div
                                    key={task._id}
                                    className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="card-body p-4">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-semibold truncate">
                                                    {task.title}
                                                </h3>
                                                {task.fk_project && (
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/projects/${task.fk_project._id || task.fk_project}`,
                                                            )
                                                        }
                                                        className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5"
                                                    >
                                                        <FolderKanban className="w-3 h-3" />
                                                        {task.fk_project.name ||
                                                            task.fk_project}
                                                    </button>
                                                )}
                                            </div>
                                            <span
                                                className={`badge badge-sm shrink-0 ${statusColor[task.status]}`}
                                            >
                                                {STATUSES.find(
                                                    (s) =>
                                                        s.value === task.status,
                                                )?.label || task.status}
                                            </span>
                                        </div>

                                        {task.description && (
                                            <p className="text-sm text-base-content/60 line-clamp-2 mb-3">
                                                {task.description}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-2 text-xs text-base-content/50">
                                            <span
                                                className={`badge badge-sm ${priorityColor[task.priority]}`}
                                            >
                                                <Flag className="w-3 h-3 mr-1" />
                                                {PRIORITIES.find(
                                                    (p) =>
                                                        p.value ===
                                                        task.priority,
                                                )?.label || task.priority}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CalendarDays className="w-3 h-3" />
                                                Creada:{" "}
                                                {new Date(
                                                    task.createdAt,
                                                ).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CalendarDays className="w-3 h-3" />
                                                Vence:{" "}
                                                {new Date(
                                                    task.dueDate,
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                <button
                                    onClick={() =>
                                        setPage((p) => Math.max(1, p - 1))
                                    }
                                    disabled={page <= 1}
                                    className="btn btn-outline btn-sm"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Anterior
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1,
                                    ).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`btn btn-sm ${
                                                page === p
                                                    ? "btn-primary"
                                                    : "btn-ghost"
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() =>
                                        setPage((p) =>
                                            Math.min(totalPages, p + 1),
                                        )
                                    }
                                    disabled={page >= totalPages}
                                    className="btn btn-outline btn-sm"
                                >
                                    Siguiente
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-base-content/40">
                        <ListChecks className="w-16 h-16 mb-4" />
                        <p className="text-xl font-medium">
                            {filters.projectId || filters.status || filters.priority
                                ? "Sin resultados"
                                : "No hay tareas"}
                        </p>
                        <p className="text-sm mt-1">
                            {filters.projectId || filters.status || filters.priority
                                ? "Intenta con otros filtros"
                                : "Crea proyectos y tareas para verlas aquí"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TasksPage;
