import { useState, useEffect } from "react";
import {
    ListChecks,
    Filter,
    ChevronLeft,
    ChevronRight,
    Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import NavBar from "../../components/NavBar";
import TaskCard from "../../components/TaskCard";
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

const TasksPage = () => {
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
    const [taskForm, setTaskForm] = useState(null);
    const [submitting, setSubmitting] = useState(false);

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

    const loadTasks = async () => {
        const params = { page, pageSize };
        if (filters.projectId) params.projectId = filters.projectId;
        if (filters.status) params.status = filters.status;
        if (filters.priority) params.priority = filters.priority;
        const { data: res } = await taskService.getTasks(params);
        setTasks(res.data.items);
        setTotalItems(res.data.total_items);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data: res } = await taskService.createTask(taskForm);
            toast.success(res.message);
            setTaskForm(null);
            await loadTasks();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error al crear tarea");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditTask = async (taskId, data) => {
        try {
            const { data: res } = await taskService.updateTask(taskId, data);
            toast.success(res.message);
            await loadTasks();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error al actualizar tarea");
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!confirm("¿Eliminar esta tarea?")) return;
        try {
            await taskService.deleteTask(taskId);
            toast.success("Tarea eliminada");
            await loadTasks();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error al eliminar tarea");
        }
    };

    const today = new Date().toISOString().split("T")[0];

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
                    <button
                        onClick={() =>
                            setTaskForm({
                                title: "",
                                description: "",
                                priority: "mid",
                                dueDate: "",
                                fk_project: "",
                            })
                        }
                        className="btn btn-primary btn-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva tarea
                    </button>
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
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    showProjectLink
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteTask}
                                />
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

            {taskForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="card bg-base-100 shadow-xl w-full max-w-md">
                        <div className="card-body p-6">
                            <h3 className="text-xl font-bold mb-4">
                                Nueva tarea
                            </h3>
                            <form
                                onSubmit={handleCreateTask}
                                className="flex flex-col gap-4"
                            >
                                <div>
                                    <label className="label" htmlFor="task-title">
                                        <span className="label-text font-medium">
                                            Título
                                        </span>
                                    </label>
                                    <input
                                        id="task-title"
                                        type="text"
                                        placeholder="Título de la tarea"
                                        className="input input-bordered w-full"
                                        value={taskForm.title}
                                        onChange={(e) =>
                                            setTaskForm({
                                                ...taskForm,
                                                title: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label" htmlFor="task-desc">
                                        <span className="label-text font-medium">
                                            Descripción
                                        </span>
                                    </label>
                                    <textarea
                                        id="task-desc"
                                        placeholder="Descripción de la tarea"
                                        className="textarea textarea-bordered w-full"
                                        rows={3}
                                        value={taskForm.description}
                                        onChange={(e) =>
                                            setTaskForm({
                                                ...taskForm,
                                                description: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label" htmlFor="task-project">
                                        <span className="label-text font-medium">
                                            Proyecto
                                        </span>
                                    </label>
                                    <select
                                        id="task-project"
                                        className="select select-bordered w-full"
                                        value={taskForm.fk_project}
                                        onChange={(e) =>
                                            setTaskForm({
                                                ...taskForm,
                                                fk_project: e.target.value,
                                            })
                                        }
                                        required
                                    >
                                        <option value="">
                                            Selecciona un proyecto
                                        </option>
                                        {projects.map((p) => (
                                            <option key={p._id} value={p._id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            className="label"
                                            htmlFor="task-priority"
                                        >
                                            <span className="label-text font-medium">
                                                Prioridad
                                            </span>
                                        </label>
                                        <select
                                            id="task-priority"
                                            className="select select-bordered w-full"
                                            value={taskForm.priority}
                                            onChange={(e) =>
                                                setTaskForm({
                                                    ...taskForm,
                                                    priority: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="low">Baja</option>
                                            <option value="mid">Media</option>
                                            <option value="high">Alta</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            className="label"
                                            htmlFor="task-due"
                                        >
                                            <span className="label-text font-medium">
                                                Vence
                                            </span>
                                        </label>
                                        <input
                                            id="task-due"
                                            type="date"
                                            className="input input-bordered w-full"
                                            value={taskForm.dueDate}
                                            min={today}
                                            onChange={(e) =>
                                                setTaskForm({
                                                    ...taskForm,
                                                    dueDate: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 justify-end pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setTaskForm(null)}
                                        className="btn btn-ghost"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <span className="loading loading-spinner" />
                                        ) : (
                                            "Crear tarea"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TasksPage;
