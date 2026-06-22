import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";

const PublicRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    return <Outlet />;
};

export default PublicRoute;
