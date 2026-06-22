import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import {
    FolderKanban,
    CalendarDays,
    Pencil,
    Trash2,
    Plus,
    ArrowLeft,
    AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import NavBar from "../../components/NavBar";
import TaskCard from "../../components/TaskCard";
import * as projectService from "../../../services/projectService";
import * as taskService from "../../../services/taskService";

const statusColor = {
    pending: "badge-soft",
    in_progress: "badge-info",
    completed: "badge-success",
};

const PRIORITIES = [
    { value: "low", label: "Baja" },
    { value: "mid", label: "Media" },
    { value: "high", label: "Alta" },
];

const STATUSES = [
    { value: "pending", label: "Pendiente" },
    { value: "in_progress", label: "En progreso" },
    { value: "completed", label: "Completada" },
];

const ProjectDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editForm, setEditForm] = useState(null);
    const [taskForm, setTaskForm] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");

    const loadTasks = useCallback(async () => {
        try {
            const params = { projectId: id, pageSize: 100 };
            if (
                statusFilter === "pending" ||
                statusFilter === "in_progress" ||
                statusFilter === "completed"
            ) {
                params.status = statusFilter;
            } else if (statusFilter === "not_completed") {
                params.ignore_status = "completed";
            }
            if (priorityFilter === "low" || priorityFilter === "mid" || priorityFilter === "high") {
                params.priority = priorityFilter;
            }
            const { data: res } = await taskService.getTasks(params);
            setTasks(res.data.items);
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Error al cargar tareas",
            );
        }
    }, [id, statusFilter, priorityFilter]);

    useEffect(() => {
        (async () => {
            try {
                const { data: res } = await projectService.getProject(id);
                setProject(res.data);
                await loadTasks();
            } catch (err) {
                toast.error(
                    err.response?.data?.message || "Error al cargar datos",
                );
                navigate("/projects");
            } finally {
                setLoading(false);
            }
        })();
    }, [id, navigate, loadTasks]);

    const handleEditProject = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data: res } = await projectService.updateProject(
                id,
                editForm,
            );
            toast.success(res.message);
            setProject(res.data);
            setEditForm(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Error al actualizar");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!confirm("¿Eliminar este proyecto y todas sus tareas?")) return;
        try {
            await projectService.deleteProject(id);
            toast.success("Proyecto eliminado");
            navigate("/projects");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error al eliminar");
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data: res } = await taskService.createTask({
                ...taskForm,
                fk_project: id,
            });
            toast.success(res.message);
            setTaskForm(null);
            loadTasks();
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
            loadTasks();
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Error al actualizar tarea",
            );
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!confirm("¿Eliminar esta tarea?")) return;
        try {
            await taskService.deleteTask(taskId);
            toast.success("Tarea eliminada");
            loadTasks();
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Error al eliminar tarea",
            );
        }
    };

    const today = new Date().toISOString().split("T")[0];

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200">
                <NavBar />
                <div className="flex justify-center py-20">
                    <span className="loading loading-spinner loading-lg text-primary" />
                </div>
            </div>
        );
    }

    if (!project) return null;

    const statusFilters = [
        { value: "all", label: "Todas" },
        { value: "pending", label: "Pendientes" },
        { value: "in_progress", label: "En progreso" },
        { value: "completed", label: "Completadas" },
        { value: "not_completed", label: "No completadas" },
    ];

    const priorityFilters = [
        { value: "all", label: "Todas" },
        { value: "low", label: "Baja" },
        { value: "mid", label: "Media" },
        { value: "high", label: "Alta" },
    ];

    const filteredTasks =
        statusFilter === "all"
            ? tasks
            : statusFilter === "not_completed"
              ? tasks.filter((t) => t.status !== "completed")
              : tasks.filter((t) => t.status === statusFilter);

    const groupedTasks = {
        pending: filteredTasks.filter((t) => t.status === "pending"),
        in_progress: tasks.filter((t) => t.status === "in_progress"),
        completed: tasks.filter((t) => t.status === "completed"),
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-base-200 via-base-100 to-primary/5">
            <NavBar />

            <div className="container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate("/projects")}
                    className="btn btn-ghost btn-sm mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a proyectos
                </button>

                <div className="card bg-base-100 shadow-md border border-base-200 mb-8">
                    <div className="card-body p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                    <FolderKanban className="w-7 h-7 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">
                                        {project.name}
                                    </h1>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-base-content/60">
                                        <CalendarDays className="w-4 h-4" />
                                        <span>
                                            {new Date(
                                                project.dueDate,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        setEditForm({
                                            name: project.name,
                                            description:
                                                project.description || "",
                                            dueDate: project.dueDate
                                                ? new Date(project.dueDate)
                                                      .toISOString()
                                                      .split("T")[0]
                                                : "",
                                        })
                                    }
                                    className="btn btn-outline btn-sm"
                                >
                                    <Pencil className="w-4 h-4" />
                                    Editar
                                </button>
                                <button
                                    onClick={handleDeleteProject}
                                    className="btn btn-outline btn-error btn-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar
                                </button>
                            </div>
                        </div>

                        {project.description && (
                            <p className="text-base-content/70 mt-4 max-w-2xl">
                                {project.description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <h2 className="text-xl font-semibold">Tareas</h2>
                    <button
                        onClick={() =>
                            setTaskForm({
                                title: "",
                                description: "",
                                priority: "mid",
                                dueDate: "",
                            })
                        }
                        className="btn btn-primary btn-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva tarea
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {statusFilters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setStatusFilter(f.value)}
                            className={`btn btn-sm ${
                                statusFilter === f.value
                                    ? "btn-primary"
                                    : "btn-ghost"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-sm font-medium text-base-content/60 self-center mr-1">
                        Prioridad:
                    </span>
                    {priorityFilters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setPriorityFilter(f.value)}
                            className={`btn btn-sm ${
                                priorityFilter === f.value
                                    ? "btn-primary"
                                    : "btn-ghost"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {filteredTasks.length > 0 ? (
                    <div className="flex flex-col gap-8">
                        {["pending", "in_progress", "completed"].map(
                            (status) => {
                                const items = groupedTasks[status];
                                if (items.length === 0) return null;
                                return (
                                    <div key={status}>
                                        <h3 className="font-medium text-base-content/60 mb-3 flex items-center gap-2">
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    status === "pending"
                                                        ? "bg-base-300"
                                                        : status ===
                                                            "in_progress"
                                                          ? "bg-info"
                                                          : "bg-success"
                                                }`}
                                            />
                                            {
                                                STATUSES.find(
                                                    (s) => s.value === status,
                                                ).label
                                            }{" "}
                                            ({items.length})
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                            {items.map((task) => (
                                                <TaskCard
                                                    key={task._id}
                                                    task={task}
                                                    onEdit={handleEditTask}
                                                    onDelete={handleDeleteTask}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            },
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-base-content/40">
                        <AlertTriangle className="w-12 h-12 mb-3" />
                        <p className="text-lg font-medium">Sin tareas</p>
                        <p className="text-sm">
                            Crea la primera tarea para este proyecto
                        </p>
                    </div>
                )}
            </div>

            {editForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="card bg-base-100 shadow-xl w-full max-w-md">
                        <div className="card-body p-6">
                            <h3 className="text-xl font-bold mb-4">
                                Editar proyecto
                            </h3>
                            <form
                                onSubmit={handleEditProject}
                                className="flex flex-col gap-4"
                            >
                                <div>
                                    <label
                                        className="label"
                                        htmlFor="edit-name"
                                    >
                                        <span className="label-text font-medium">
                                            Nombre
                                        </span>
                                    </label>
                                    <input
                                        id="edit-name"
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={editForm.name}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                name: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        className="label"
                                        htmlFor="edit-desc"
                                    >
                                        <span className="label-text font-medium">
                                            Descripción
                                        </span>
                                    </label>
                                    <textarea
                                        id="edit-desc"
                                        className="textarea textarea-bordered w-full"
                                        rows={3}
                                        value={editForm.description}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="label" htmlFor="edit-due">
                                        <span className="label-text font-medium">
                                            Fecha límite
                                        </span>
                                    </label>
                                    <input
                                        id="edit-due"
                                        type="date"
                                        className="input input-bordered w-full"
                                        value={editForm.dueDate}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                dueDate: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 justify-end pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditForm(null)}
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
                                            "Guardar"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

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
                                    <label
                                        className="label"
                                        htmlFor="task-title"
                                    >
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
                                    <label
                                        className="label"
                                        htmlFor="task-desc"
                                    >
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
                                            {PRIORITIES.map((p) => (
                                                <option
                                                    key={p.value}
                                                    value={p.value}
                                                >
                                                    {p.label}
                                                </option>
                                            ))}
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

export default ProjectDetailPage;
