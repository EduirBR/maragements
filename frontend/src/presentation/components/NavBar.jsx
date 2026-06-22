import { Link, useNavigate } from "react-router";
import { LayoutDashboard, FolderKanban, ListChecks, LogOutIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NavBar = ({ buttons = [] }) => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="bg-base-300 border-b border-base-content/10">
            <div className="mx-auto max-w-7xl p-4">
                <div className="flex items-center justify-between">
                    <Link to={"/"} className="shrink-0">
                        <h1 className="text-xl md:text-3xl font-bold text-primary font-mono tracking-tight truncate">
                            Free-Maragements
                        </h1>
                    </Link>
                    <div className="flex items-center gap-1 md:gap-2">
                        {isAuthenticated && (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="btn btn-ghost btn-sm"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span className="hidden sm:inline">
                                        Dashboard
                                    </span>
                                </Link>
                                <Link
                                    to="/projects"
                                    className="btn btn-ghost btn-sm"
                                >
                                    <FolderKanban className="w-4 h-4" />
                                    <span className="hidden sm:inline">
                                        Proyectos
                                    </span>
                                </Link>
                                <Link
                                    to="/tasks"
                                    className="btn btn-ghost btn-sm"
                                >
                                    <ListChecks className="w-4 h-4" />
                                    <span className="hidden sm:inline">
                                        Tareas
                                    </span>
                                </Link>
                            </>
                        )}
                        {buttons}
                        {isAuthenticated && (
                            <button
                                onClick={handleLogout}
                                className="btn btn-ghost btn-sm"
                            >
                                <LogOutIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">Salir</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default NavBar;
