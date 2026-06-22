import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "../presentation/pages/auth/LoginPage";
import RegisterPage from "../presentation/pages/auth/RegisterPage";
import HomePage from "../presentation/pages/HomePage";
import Dashboard from "../presentation/pages/projects/Dashboard";
import ProjectsPage from "../presentation/pages/projects/ProjectsPage";
import ProjectDetailPage from "../presentation/pages/projects/ProjectDetailPage";
import TasksPage from "../presentation/pages/tasks/TasksPage";
import ProtectedRoute from "../presentation/components/ProtectedRoute";
import PublicRoute from "../presentation/components/PublicRoute";

export const appRouter = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    {
        element: <PublicRoute />,
        children: [
            { path: "/login", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
        ],
    },

    {
        element: <ProtectedRoute />,
        children: [
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/projects", element: <ProjectsPage /> },
            { path: "/projects/:id", element: <ProjectDetailPage /> },
            { path: "/tasks", element: <TasksPage /> },
        ],
    },
    { path: "*", element: <Navigate to={"/"} /> },
]);
