import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { LucideClipboardSignature, Mail, Lock, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import NavBar from "../../components/NavBar";
import NavButton from "../../components/NavButton";
import { useAuth } from "../../../context/AuthContext";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Ingresa un email válido");
            return;
        }
        setSubmitting(true);
        try {
            await login({ email, password });
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-base-200 via-base-100 to-primary/5">
            <NavBar
                buttons={[
                    <NavButton
                        icon={<LucideClipboardSignature />}
                        to={"/register"}
                        text={"Registrate"}
                    />,
                ]}
            />

            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-md mx-auto">
                    <div className="card bg-base-100 shadow-xl border border-base-200">
                        <div className="card-body p-8">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <LogIn className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-3xl font-bold">
                                    Bienvenido
                                </h2>
                                <p className="text-base-content/60 mt-1">
                                    Inicia sesión para continuar
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div>
                                    <label className="label" htmlFor="email">
                                        <span className="label-text font-medium">
                                            Email
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="someuser@example.com"
                                            className="input input-bordered w-full pl-11 focus:outline-offset-0"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label" htmlFor="password">
                                        <span className="label-text font-medium">
                                            Contraseña
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="***********"
                                            className="input input-bordered w-full pl-11 focus:outline-offset-0"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <span className="loading loading-spinner" />
                                    ) : (
                                        "Inicia Sesión"
                                    )}
                                </button>
                            </form>

                            <p className="text-center text-sm text-base-content/60 mt-6">
                                No tienes una cuenta?{" "}
                                <Link
                                    to="/register"
                                    className="text-primary font-semibold hover:underline"
                                >
                                    Registrate
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
