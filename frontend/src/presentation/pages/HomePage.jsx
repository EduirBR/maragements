import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import {
    FolderKanban,
    ListChecks,
    BarChart3,
    ArrowRight,
    LogIn,
    UserPlus,
    LayoutDashboard,
} from "lucide-react";
import NavBar from "../components/NavBar";

const features = [
    {
        label: "Proyectos",
        desc: "Crea y organiza proyectos con fechas límite",
        icon: FolderKanban,
    },
    {
        label: "Tareas",
        desc: "Gestiona tareas con prioridades y estados",
        icon: ListChecks,
    },
    {
        label: "Reportes",
        desc: "Visualiza tu productividad con gráficos",
        icon: BarChart3,
    },
];

const HomePage = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-linear-to-br from-base-200 via-base-100 to-primary/5">
            <NavBar />

            <main>
                <section className="container mx-auto px-4 py-24 text-center">
                    <div className="max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <FolderKanban className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Free-Maragements
                        </h1>
                        <p className="text-lg text-base-content/70 mb-8">
                            Gestiona tus proyectos y tareas de forma sencilla.
                            Organiza, prioriza y visualiza tu productividad en
                            un solo lugar.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            {user ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="btn btn-primary btn-lg w-full sm:w-auto"
                                    >
                                        <LayoutDashboard className="w-5 h-5" />
                                        Ir al Dashboard
                                    </Link>
                                    <Link
                                        to="/projects"
                                        className="btn btn-outline btn-lg w-full sm:w-auto"
                                    >
                                        <FolderKanban className="w-5 h-5" />
                                        Gestionar Proyectos
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="btn btn-primary btn-lg w-full sm:w-auto"
                                    >
                                        <LogIn className="w-5 h-5" />
                                        Iniciar sesión
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn btn-outline btn-lg w-full sm:w-auto"
                                    >
                                        <UserPlus className="w-5 h-5" />
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                <section className="container mx-auto px-4 pb-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {features.map((f) => (
                            <div
                                key={f.label}
                                className="card bg-base-100 shadow-md border border-base-200"
                            >
                                <div className="card-body items-center text-center p-6">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                                        <f.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-lg">
                                        {f.label}
                                    </h3>
                                    <p className="text-sm text-base-content/60">
                                        {f.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="border-t border-base-200 py-6">
                <div className="container mx-auto px-4 text-center text-sm text-base-content/40">
                    Free-Maragements &copy; {new Date().getFullYear()}
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
