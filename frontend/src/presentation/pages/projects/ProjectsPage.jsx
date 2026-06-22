import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
    FolderKanban,
    Plus,
    Search,
    CalendarDays,
    FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import NavBar from "../../components/NavBar";
import * as projectService from "../../../services/projectService";

const statusColor = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = (due - now) / (1000 * 60 * 60 * 24);
    if (diff < 0) return "badge-error";
    if (diff <= 3) return "badge-warning";
    return "badge-success";
};

const ProjectsPage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        dueDate: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchProjects = async (q) => {
        try {
            const params = q ? { search: q } : {};
            const { data: res } = await projectService.getProjects(params);
            setProjects(res.data);
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Error al cargar proyectos",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const { data: res } = await projectService.getProjects();
                setProjects(res.data);
            } catch (err) {
                toast.error(
                    err.response?.data?.message || "Error al cargar proyectos",
                );
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        fetchProjects(search);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data: res } = await projectService.createProject(form);
            toast.success(res.message);
            setShowForm(false);
            setForm({ name: "", description: "", dueDate: "" });
            fetchProjects(search);
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Error al crear proyecto",
            );
        } finally {
            setSubmitting(false);
        }
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="min-h-screen bg-linear-to-br from-base-200 via-base-100 to-primary/5">
            <NavBar />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Proyectos</h1>
                        <p className="text-base-content/60 mt-1">
                            Gestiona tus proyectos
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn btn-outline btn-sm btn-primary"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo proyecto
                    </button>
                </div>

                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex w-full max-w-md gap-0">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                            <input
                                type="text"
                                placeholder="Buscar proyectos..."
                                className="input input-bordered w-full pl-11 rounded-r-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary btn-outline rounded-l-none"
                        >
                            Buscar
                        </button>
                    </div>
                </form>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <span className="loading loading-spinner loading-lg text-primary" />
                    </div>
                ) : projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project._id}
                                onClick={() =>
                                    navigate(`/projects/${project._id}`)
                                }
                                className="card bg-base-100 shadow-md border border-base-200 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer"
                            >
                                <div className="card-body p-6">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                            <FolderKanban className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-lg truncate">
                                                {project.name}
                                            </h3>
                                            <span
                                                className={`badge badge-sm ${statusColor(project.dueDate)}`}
                                            >
                                                <CalendarDays className="w-3 h-3 mr-1" />
                                                {new Date(
                                                    project.dueDate,
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {project.description && (
                                        <p className="text-sm text-base-content/60 line-clamp-2">
                                            {project.description}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-2 mt-2 text-xs text-base-content/40">
                                        <FileText className="w-3.5 h-3.5" />
                                        Ver tareas y detalles
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-base-content/40">
                        <FolderKanban className="w-16 h-16 mb-4" />
                        <p className="text-xl font-medium">
                            {search ? "Sin resultados" : "No hay proyectos"}
                        </p>
                        <p className="text-sm mt-1">
                            {search
                                ? "Intenta con otro término de búsqueda"
                                : "Crea tu primer proyecto"}
                        </p>
                    </div>
                )}
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="card bg-base-100 shadow-xl w-full max-w-md">
                        <div className="card-body p-6">
                            <h3 className="text-xl font-bold mb-4">
                                Nuevo proyecto
                            </h3>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="label" htmlFor="name">
                                        <span className="label-text font-medium">
                                            Nombre
                                        </span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Nombre del proyecto"
                                        className="input input-bordered w-full"
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                name: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label" htmlFor="desc">
                                        <span className="label-text font-medium">
                                            Descripción
                                        </span>
                                    </label>
                                    <textarea
                                        id="desc"
                                        placeholder="Descripción del proyecto"
                                        className="textarea textarea-bordered w-full"
                                        rows={3}
                                        value={form.description}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="label" htmlFor="dueDate">
                                        <span className="label-text font-medium">
                                            Fecha límite
                                        </span>
                                    </label>
                                    <input
                                        id="dueDate"
                                        type="date"
                                        className="input input-bordered w-full"
                                        value={form.dueDate}
                                        min={today}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                dueDate: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 justify-end pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
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
                                            "Crear"
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

export default ProjectsPage;
