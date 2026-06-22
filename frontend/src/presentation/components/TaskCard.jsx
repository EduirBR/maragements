import { useState } from "react";
import { useNavigate } from "react-router";
import { Pencil, Trash2, Flag, CalendarDays, FolderKanban } from "lucide-react";

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

const priorityColor = {
    low: "badge-info",
    mid: "badge-warning",
    high: "badge-error",
};

const statusColor = {
    pending: "badge-soft",
    in_progress: "badge-info",
    completed: "badge-success",
};

const TaskCard = ({ task, onEdit, onDelete, showProjectLink }) => {
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [status, setStatus] = useState(task.status);
    const [priority, setPriority] = useState(task.priority);
    const [dueDate, setDueDate] = useState(
        task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    );

    const PriorityIcon = priorityColor[priority] ? Flag : Flag;

    const saveChanges = (changes) => {
        onEdit(task._id, { status, priority, dueDate, ...changes });
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow">
            <div className="card-body p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <h4 className="font-medium truncate">{task.title}</h4>
                        {showProjectLink && task.fk_project && (
                            <button
                                onClick={() =>
                                    navigate(
                                        `/projects/${task.fk_project._id || task.fk_project}`,
                                    )
                                }
                                className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5"
                            >
                                <FolderKanban className="w-3 h-3" />
                                {task.fk_project.name || task.fk_project}
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        {onEdit && (
                            <button
                                onClick={() => setEditing(!editing)}
                                className="btn btn-ghost btn-xs"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(task._id)}
                                className="btn btn-ghost btn-xs text-error"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {task.description && (
                    <p className="text-sm text-base-content/60 mt-1 line-clamp-2">
                        {task.description}
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-base-content/50">
                    <span className="flex items-center gap-1">
                        Creado: {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        Vence: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`badge badge-sm ${priorityColor[priority]}`}>
                        <PriorityIcon className="w-3 h-3 mr-1" />
                        {PRIORITIES.find((p) => p.value === priority)?.label || priority}
                    </span>
                    <span className={`badge badge-sm ${statusColor[status]}`}>
                        {STATUSES.find((s) => s.value === status)?.label || status}
                    </span>
                </div>

                {editing && onEdit && (
                    <div className="mt-3 pt-3 border-t border-base-200 flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2">
                            <select
                                className="select select-bordered select-xs"
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    saveChanges({ status: e.target.value });
                                }}
                            >
                                {STATUSES.map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="select select-bordered select-xs"
                                value={priority}
                                onChange={(e) => {
                                    setPriority(e.target.value);
                                    saveChanges({ priority: e.target.value });
                                }}
                            >
                                {PRIORITIES.map((p) => (
                                    <option key={p.value} value={p.value}>
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label py-1">
                                <span className="label-text text-xs">
                                    Fecha de vencimiento
                                </span>
                            </label>
                            <input
                                type="date"
                                className="input input-bordered input-xs w-full"
                                value={dueDate}
                                min={today}
                                onChange={(e) => {
                                    setDueDate(e.target.value);
                                    saveChanges({ dueDate: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
