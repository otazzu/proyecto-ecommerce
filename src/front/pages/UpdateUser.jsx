import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../services/APIUser";
import { Spinner } from "../components/Spinner";
import { ManageAddresses } from "../components/ManageAddresses";
import { useToast } from "../hooks/useToast";

const INITIAL_STATE = {
    email: "",
    password: "",
    user_name: "",
    first_name: "",
    last_name: "",
    img: "",
};

export const UpdateUser = () => {
    const navigate = useNavigate();
    const [state, setState] = useState(INITIAL_STATE);
    const [error, setError] = useState("");
    const [rolType, setRolType] = useState("client");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [fieldTouched, setFieldTouched] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const toast = useToast();

    const defaultImg = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    // Validators
    const validators = {
        email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        user_name: (v) => v.length >= 3,
        first_name: (v) => v.length >= 2,
        last_name: (v) => v.length >= 2,
        passwordLength: (v) => !v || v.length >= 8,
        passwordUppercase: (v) => !v || /[A-Z]/.test(v),
        passwordLowercase: (v) => !v || /[a-z]/.test(v),
        passwordNumber: (v) => !v || /\d/.test(v),
        passwordsMatch: () => !state.password || state.password === repeatPassword,
    };

    const getPasswordStrength = () => {
        if (!state.password) return 0;
        let score = 0;
        if (state.password.length >= 8) score++;
        if (/[A-Z]/.test(state.password)) score++;
        if (/[a-z]/.test(state.password)) score++;
        if (/\d/.test(state.password)) score++;
        return score;
    };

    const passwordStrength = getPasswordStrength();
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-[var(--accent-primary)]'];
    const strengthLabels = ['Muy débil', 'Débil', 'Media', 'Fuerte'];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await userService.getCurrentUser();
                if (response && response.success && response.data) {
                    setState({
                        email: response.data.email || "",
                        password: "",
                        user_name: response.data.user_name || "",
                        first_name: response.data.first_name || "",
                        last_name: response.data.last_name || "",
                        img: response.data.img || "",
                    });
                    setRolType(response.data.role || "client");
                    if (response.data.img) {
                        setImagePreview(response.data.img);
                    }
                } else if (response && !response.success) {
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("user");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error al obtener datos del usuario:", error);
                setError("Error al cargar los datos del usuario");
            }
        };
        fetchUserData();
    }, [navigate]);

    const validateForm = () => {
        if (!state.password) return true;

        if (!validators.passwordLength(state.password)) {
            setError("La contraseña debe tener al menos 8 caracteres");
            return false;
        }
        if (!validators.passwordUppercase(state.password)) {
            setError("La contraseña debe contener al menos una mayúscula");
            return false;
        }
        if (!validators.passwordNumber(state.password)) {
            setError("La contraseña debe contener al menos un número");
            return false;
        }
        if (!validators.passwordsMatch()) {
            setError("Las contraseñas no coinciden");
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!validateForm()) return;

        setLoading(true);
        try {
            const result = await userService.updateUser(state, rolType);
            setLoading(false);
            if (result.success) {
                sessionStorage.setItem("user", JSON.stringify(result.data.user));
                window.dispatchEvent(new Event("userChanged"));
                toast.showSuccess("Perfil actualizado correctamente");
                navigate("/");
            } else {
                setError(result.error);
            }
        } catch (error) {
            setLoading(false);
            setError("Error al modificar usuario");
        }
    };

    const handleChange = (event) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        setState({ ...state, [inputName]: inputValue });
        setError("");
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setState((prev) => ({ ...prev, img: reader.result }));
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBlur = (fieldName) => {
        setFieldTouched({ ...fieldTouched, [fieldName]: true });
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="container mx-auto max-w-4xl px-4 py-8">
                {/* Tabs */}
                <div className="mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <nav className="flex justify-center space-x-8">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm font-body transition-colors ${activeTab === "profile"
                                ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
                                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                            }`}
                        >
                            Editar Perfil
                        </button>
                        <button
                            onClick={() => setActiveTab("addresses")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm font-body transition-colors ${activeTab === "addresses"
                                ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
                                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                            }`}
                        >
                            Administrar Direcciones
                        </button>
                    </nav>
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <>
                        {/* Image preview */}
                        <div className="flex flex-col items-center mb-8 animate-fade-in-up">
                            <div className="relative">
                                <img
                                    src={imagePreview || state.img || defaultImg}
                                    className="rounded-full border-2 w-28 h-28 object-cover"
                                    style={{ borderColor: 'var(--accent-primary)' }}
                                    alt="imagen de usuario"
                                />
                                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center text-[var(--bg-primary)]"
                                    style={{ backgroundColor: 'var(--accent-primary)' }}>
                                    <i className="fas fa-camera text-xs"></i>
                                </div>
                            </div>
                        </div>

                        <h2 className="font-display mb-5 text-center text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                            Modificar Perfil
                        </h2>

                        {loading ? (
                            <div className="text-center my-3"><Spinner /></div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5 px-6 py-6 rounded-xl border border-[var(--border-subtle)]"
                                style={{ backgroundColor: 'var(--bg-card)' }}
                            >
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)] font-body">
                                        Seleccionar imagen
                                    </label>
                                    <input
                                        id="img"
                                        name="img"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-sm text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--bg-elevated)] file:text-[var(--accent-primary)] hover:file:bg-[var(--accent-primary)] hover:file:text-[var(--bg-primary)] cursor-pointer file:transition-colors"
                                />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="user_name" className="block text-sm font-medium text-[var(--text-secondary)] font-body">
                                            Nombre de usuario
                                        </label>
                                        <input
                                            id="user_name"
                                            type="text"
                                            name="user_name"
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('user_name')}
                                            value={state.user_name}
                                            required
                                            className="block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] font-body"
                                            style={{ backgroundColor: 'var(--bg-elevated)' }}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="first_name" className="block text-sm font-medium text-[var(--text-secondary)] font-body">
                                            Nombre
                                        </label>
                                        <input
                                            id="first_name"
                                            type="text"
                                            name="first_name"
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('first_name')}
                                            value={state.first_name}
                                            required
                                            className="block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] font-body"
                                            style={{ backgroundColor: 'var(--bg-elevated)' }}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="last_name" className="block text-sm font-medium text-[var(--text-secondary)] font-body">
                                            Apellidos
                                        </label>
                                        <input
                                            id="last_name"
                                            type="text"
                                            name="last_name"
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('last_name')}
                                            value={state.last_name}
                                            required
                                            className="block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] font-body"
                                            style={{ backgroundColor: 'var(--bg-elevated)' }}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] font-body">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                onChange={handleChange}
                                                onBlur={() => handleBlur('email')}
                                                value={state.email}
                                                required
                                                className="block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] font-body pr-10"
                                                style={{ backgroundColor: 'var(--bg-elevated)' }}
                                            />
                                            {fieldTouched.email && state.email && (
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    {validators.email(state.email) ? (
                                                        <i className="fas fa-circle-check text-[var(--accent-primary)]"></i>
                                                    ) : (
                                                        <i className="fas fa-circle-xmark text-red-400"></i>
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] font-body">
                                            Contraseña (Opcional)
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            onChange={handleChange}
                                            value={state.password}
                                            placeholder="Dejar vacío para no cambiar"
                                            className="block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] font-body"
                                            style={{ backgroundColor: 'var(--bg-elevated)' }}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="repeat_password" className="block text-sm font-medium text-[var(--text-secondary)] font-body">
                                            Repetir Contraseña
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="repeat_password"
                                                type="password"
                                                name="repeat_password"
                                                value={repeatPassword}
                                                onChange={(event) => setRepeatPassword(event.target.value)}
                                                placeholder="Repetir contraseña"
                                                className="block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] font-body pr-10"
                                                style={{ backgroundColor: 'var(--bg-elevated)' }}
                                            />
                                            {repeatPassword && state.password && (
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    {validators.passwordsMatch() ? (
                                                        <i className="fas fa-circle-check text-[var(--accent-primary)]"></i>
                                                    ) : (
                                                        <i className="fas fa-circle-xmark text-red-400"></i>
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Password strength indicator */}
                                {state.password && (
                                    <div className="mt-2 px-1">
                                        <div className="flex gap-1 mb-1">
                                            {[1, 2, 3, 4].map(i => (
                                                <div
                                                    key={i}
                                                    className={`h-1.5 flex-1 rounded-full ${passwordStrength >= i ? strengthColors[passwordStrength - 1] : 'bg-[var(--bg-elevated)]'}`}
                                                ></div>
                                            ))}
                                        </div>
                                        <p className="text-xs font-body" style={{ color: passwordStrength >= 4 ? 'var(--accent-primary)' : passwordStrength >= 3 ? '#fbbf24' : '#ef4444' }}>
                                            Fortaleza: {strengthLabels[passwordStrength - 1] || 'Muy débil'}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full rounded-lg py-2.5 text-base font-semibold text-[var(--bg-primary)] btn-lift font-body"
                                        style={{ backgroundColor: 'var(--accent-primary)' }}
                                    >
                                        Actualizar
                                    </button>
                                </div>
                                <div>
                                    <Link
                                        to={"/"}
                                        className="block w-full text-center rounded-lg py-2.5 font-semibold text-[var(--accent-secondary)] border border-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] hover:text-[var(--bg-primary)] transition-all duration-200 font-body"
                                    >
                                        Cancelar
                                    </Link>
                                </div>
                            </form>
                        )}

                        {error && (
                            <div className="bg-red-950/50 border border-red-500/30 text-red-400 p-3 mt-4 rounded-lg text-center font-body">
                                {error}
                            </div>
                        )}
                    </>
                )}

                {activeTab === "addresses" && <ManageAddresses />}
            </div>
        </div>
    );
};