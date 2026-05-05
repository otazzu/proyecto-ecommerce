import React, { useState, useEffect } from "react";
import { userService } from '../services/APIUser';
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { useToast } from "../hooks/useToast";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    // Email validation
    const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    const showEmailError = emailTouched && email && !isValidEmail(email);

    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if (user) {
            navigate("/");
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isValidEmail(email)) {
            setError("Por favor, introduce un email válido");
            return;
        }
        setError("");
        setLoading(true);
        const result = await userService.LoginUser({ email, password });
        setLoading(false);
        if (result.success) {
            toast.showSuccess("¡Bienvenido de vuelta!");
            navigate("/");
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, var(--bg-primary) 0%, #0f1525 50%, var(--bg-primary) 100%)' }}>
            {/* Decorative elements */}
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, var(--accent-primary), transparent)' }}></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, var(--accent-secondary), transparent)' }}></div>

            <div className="relative z-10 w-full max-w-sm animate-fade-in-up">
                {/* Logo */}
                <div className="sm:mx-auto sm:w-full sm:max-w-sm flex justify-center mb-6">
                    <Link to="/">
                        <img src="src/front/assets/img/logo-kurisu-shop.png" alt="Kurisu Shop Logo" className="h-32 w-auto" />
                    </Link>
                </div>

                <h2 className="font-display mb-6 text-center text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                    Iniciar sesión
                </h2>

                {error && (
                    <div className="bg-red-950/50 border border-red-500/30 text-red-400 p-3 my-4 rounded-lg text-center text-sm font-body">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center my-3"><Spinner /></div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6 rounded-xl border border-[var(--border-subtle)]" style={{ backgroundColor: 'var(--bg-card)' }}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] font-body">
                                Email
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={event => setEmail(event.target.value)}
                                    onBlur={() => setEmailTouched(true)}
                                    required
                                    placeholder="tu@email.com"
                                    className={`block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 transition-colors font-body ${
                                        showEmailError
                                            ? 'ring-2 ring-red-500 focus:ring-red-500'
                                            : email && isValidEmail(email) ? 'ring-2 ring-[var(--accent-primary)] focus:ring-[var(--accent-primary)]'
                                            : 'border border-[var(--border-subtle)] focus:ring-[var(--accent-primary)]'
                                    }`}
                                    style={{ backgroundColor: 'var(--bg-elevated)' }}
                                />
                                {email && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {isValidEmail(email) ? (
                                            <i className="fas fa-circle-check text-[var(--accent-primary)]"></i>
                                        ) : showEmailError ? (
                                            <i className="fas fa-circle-xmark text-red-400"></i>
                                        ) : null}
                                    </span>
                                )}
                            </div>
                            {showEmailError && (
                                <p className="mt-1 text-xs text-red-400 font-body">Formato de email no válido</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] font-body">
                                Contraseña
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={event => setPassword(event.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-colors font-body"
                                    style={{ backgroundColor: 'var(--bg-elevated)' }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg py-2.5 text-base font-semibold text-[var(--bg-primary)] btn-lift font-body"
                            style={{ backgroundColor: 'var(--accent-primary)' }}
                        >
                            Iniciar sesión
                        </button>
                    </form>
                )}

                <div className="py-6 flex items-center px-6">
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }}></div>
                    <p className="px-3 text-[var(--text-muted)] m-0 text-sm font-body">¿Eres nuevo?</p>
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }}></div>
                </div>

                <div className="flex justify-center px-6">
                    <Link
                        to="/signup"
                        className="w-full text-center rounded-lg py-2.5 font-semibold text-[var(--accent-secondary)] border border-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] hover:text-[var(--bg-primary)] transition-all duration-200 font-body"
                    >
                        Ir al registro
                    </Link>
                </div>
            </div>
        </div>
    );
};