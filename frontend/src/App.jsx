import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { appRouter } from "./routes/app.router";

function App() {
    return (
        <AuthProvider>
            <div className="relative h-full w-full">
                <RouterProvider router={appRouter} />
            </div>
        </AuthProvider>
    );
}

export default App;
