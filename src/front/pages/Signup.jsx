import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userService } from "../services/APIUser";
import { Spinner } from "../components/Spinner";
import { useToast } from "../hooks/useToast";

const INITIAL_STATE = {
    email: '',
    password: '',
    user_name: '',
    first_name: '',
    last_name: '',
    img: ''
};

export const Signup = () => {
    const navigate = useNavigate();
    const [state, setState] = useState(INITIAL_STATE);
    const [error, setError] = useState('');
    const [rolType, setRolType] = useState('client');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [fieldTouched, setFieldTouched] = useState({});
    const toast = useToast();

    // Field-level validation
    const validators = {
        email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        password: {
            length: (v) => v.length >= 8,
            uppercase: (v) => /[A-Z]/.test(v),
            lowercase: (v) => /[a-z]/.test(v),
            number: (v) => /\d/.test(v),
        },
        match: () => state.password === repeatPassword && state.password.length > 0,
        user_name: (v) => v.length >= 3,
        first_name: (v) => v.length >= 2,
        last_name: (v) => v.length >= 2,
    };

    const getPasswordStrength = () => {
        const checks = [
            validators.password.length(state.password),
            validators.password.uppercase(state.password),
            validators.password.lowercase(state.password),
            validators.password.number(state.password),
        ];
        return checks.filter(Boolean).length;
    };

    const passwordStrength = getPasswordStrength();
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-[var(--accent-primary)]'];
    const strengthLabels = ['Muy débil', 'Débil', 'Media', 'Fuerte'];

    const handleChange = (event) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        setState({ ...state, [inputName]: inputValue });
        setError('');
    };

    const handleBlur = (fieldName) => {
        setFieldTouched({ ...fieldTouched, [fieldName]: true });
    };

    const validateForm = () => {
        if (!validators.user_name(state.user_name)) {
            setError('El nombre de usuario debe tener al menos 3 caracteres');
            return false;
        }
        if (!validators.first_name(state.first_name)) {
            setError('El nombre debe tener al menos 2 caracteres');
            return false;
        }
        if (!validators.last_name(state.last_name)) {
            setError('Los apellidos deben tener al menos 2 caracteres');
            return false;
        }
        if (!validators.email(state.email)) {
            setError('Por favor, introduce un email válido');
            return false;
        }
        if (!validators.password.length(state.password)) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return false;
        }
        if (!validators.password.uppercase(state.password)) {
            setError('La contraseña debe contener al menos una mayúscula');
            return false;
        }
        if (!validators.password.number(state.password)) {
            setError('La contraseña debe contener al menos un número');
            return false;
        }
        if (!validators.match()) {
            setError('Las contraseñas no coinciden');
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const result = await userService.SignupUser(state, rolType);
            if (result.success) {
                setLoading(false);
                toast.showSuccess("Cuenta creada exitosamente. ¡Inicia sesión!");
                navigate('/login');
            } else {
                setLoading(false);
                setError(result.error);
            }
        } catch (err) {
            setLoading(false);
            setError('Error al registrar usuario');
        }
    };

    // Field wrapper with validation icon
    const FieldStatus = ({ value, isValid, touched }) => {
        if (!touched || !value) return null;
        return isValid ? (
            <i className="fas fa-circle-check text-[var(--accent-primary)]"></i>
        ) : (
            <i className="fas fa-circle-xmark text-red-400"></i>
        );
    };

    const inputClass = (fieldName, isValid) => {
        const touched = fieldTouched[fieldName];
        if (touched && state[fieldName]) {
            return isValid
                ? 'ring-2 ring-[var(--accent-primary)]'
                : 'ring-2 ring-red-500';
        }
        return 'border border-[var(--border-subtle)]';
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ background: 'linear-gradient(135deg, var(--bg-primary) 0%, #0f1525 50%, var(--bg-primary) 100%)' }}>
            {/* Decorative elements */}
            <div className="absolute top-10 right-10 w-40 h-40 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, var(--accent-tertiary), transparent)' }}></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, var(--accent-secondary), transparent)' }}></div>

            <div className="relative z-10 w-full max-w-4xl animate-fade-in-up">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <Link to="/">
                        <img src="src/front/assets/img/logo-kurisu-shop.png" alt="Kurisu Shop Logo" className="h-28 w-auto" />
                    </Link>
                </div>

                <h2 className="font-display mb-6 text-center text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                    Crear cuenta
                </h2>

                {loading ? (
                    <div className="text-center my-3"><Spinner /></div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6 rounded-xl border border-[var(--border-subtle)]" style={{ backgroundColor: 'var(--bg-card)' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            {/* Username */}
                            <div>
                                <label htmlFor="user_name" className="block text-sm font-medium text-[var(--text-secondary)] font-body">Nombre de usuario</label>
                                <div className="mt-1 relative">
                                    <input
                                        id="user_name"
                                        type="text"
                                        name="user_name"
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('user_name')}
                                        value={state.user_name}
                                        required
                                        placeholder="Nombre de usuario"
                                        className={`block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none ${inputClass('user_name', validators.user_name(state.user_name))}`}
                                        style={{ backgroundColor: 'var(--bg-elevated)' }}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <FieldStatus value={state.user_name} isValid={validators.user_name(state.user_name)} touched={fieldTouched.user_name} />
                                    </span>
                                </div>
                            </div>

                            {/* First name */}
                            <div>
                                <label htmlFor="first_name" className="block text-sm font-medium text-[var(--text-secondary)] font-body">Nombre</label>
                                <div className="mt-1 relative">
                                    <input
                                        id="first_name"
                                        type="text"
                                        name="first_name"
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('first_name')}
                                        value={state.first_name}
                                        required
                                        placeholder="Tu nombre"
                                        className={`block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none ${inputClass('first_name', validators.first_name(state.first_name))}`}
                                        style={{ backgroundColor: 'var(--bg-elevated)' }}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <FieldStatus value={state.first_name} isValid={validators.first_name(state.first_name)} touched={fieldTouched.first_name} />
                                    </span>
                                </div>
                            </div>

                            {/* Last name */}
                            <div>
                                <label htmlFor="last_name" className="block text-sm font-medium text-[var(--text-secondary)] font-body">Apellidos</label>
                                <div className="mt-1 relative">
                                    <input
                                        id="last_name"
                                        type="text"
                                        name="last_name"
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('last_name')}
                                        value={state.last_name}
                                        required
                                        placeholder="Tus apellidos"
                                        className={`block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none ${inputClass('last_name', validators.last_name(state.last_name))}`}
                                        style={{ backgroundColor: 'var(--bg-elevated)' }}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <FieldStatus value={state.last_name} isValid={validators.last_name(state.last_name)} touched={fieldTouched.last_name} />
                                    </span>
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] font-body">Email</label>
                                <div className="mt-1 relative">
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('email')}
                                        value={state.email}
                                        required
                                        placeholder="tu@email.com"
                                        className={`block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none ${inputClass('email', validators.email(state.email))}`}
                                        style={{ backgroundColor: 'var(--bg-elevated)' }}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <FieldStatus value={state.email} isValid={validators.email(state.email)} touched={fieldTouched.email} />
                                    </span>
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] font-body">Contraseña</label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('password')}
                                        value={state.password}
                                        required
                                        placeholder="••••••••"
                                        className="block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] font-body"
                                        style={{ backgroundColor: 'var(--bg-elevated)' }}
                                    />
                                </div>
                                {/* Password strength */}
                                {state.password && (
                                    <div className="mt-2">
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
                                        <div className="mt-2 space-y-1">
                                            <div className="flex items-center gap-2 text-xs font-body">
                                                <i className={`fas ${validators.password.length(state.password) ? 'fa-check text-[var(--accent-primary)]' : 'fa-xmark text-red-400'}`}></i>
                                                <span className={validators.password.length(state.password) ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}>8 caracteres mínimo</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-body">
                                                <i className={`fas ${validators.password.uppercase(state.password) ? 'fa-check text-[var(--accent-primary)]' : 'fa-xmark text-red-400'}`}></i>
                                                <span className={validators.password.uppercase(state.password) ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}>Al menos una mayúscula</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-body">
                                                <i className={`fas ${validators.password.lowercase(state.password) ? 'fa-check text-[var(--accent-primary)]' : 'fa-xmark text-red-400'}`}></i>
                                                <span className={validators.password.lowercase(state.password) ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}>Al menos una minúscula</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-body">
                                                <i className={`fas ${validators.password.number(state.password) ? 'fa-check text-[var(--accent-primary)]' : 'fa-xmark text-red-400'}`}></i>
                                                <span className={validators.password.number(state.password) ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}>Al menos un número</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Repeat password */}
                            <div>
                                <label htmlFor="repeat_password" className="block text-sm font-medium text-[var(--text-secondary)] font-body">Repetir Contraseña</label>
                                <div className="mt-1 relative">
                                    <input
                                        id="repeat_password"
                                        type="password"
                                        name="repeat_password"
                                        value={repeatPassword}
                                        onChange={event => setRepeatPassword(event.target.value)}
                                        onBlur={() => handleBlur('repeat_password')}
                                        required
                                        placeholder="••••••••"
                                        className={`block w-full rounded-lg px-4 py-2.5 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none ${
                                            fieldTouched.repeat_password && repeatPassword
                                                ? (validators.match() ? 'ring-2 ring-[var(--accent-primary)]' : 'ring-2 ring-red-500')
                                                : 'border border-[var(--border-subtle)]'
                                        }`}
                                        style={{ backgroundColor: 'var(--bg-elevated)' }}
                                    />
                                    {fieldTouched.repeat_password && repeatPassword && (
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {validators.match() ? (
                                                <i className="fas fa-circle-check text-[var(--accent-primary)]"></i>
                                            ) : (
                                                <i className="fas fa-circle-xmark text-red-400"></i>
                                            )}
                                        </span>
                                    )}
                                </div>
                                {fieldTouched.repeat_password && repeatPassword && !validators.match() && (
                                    <p className="mt-1 text-xs text-red-400 font-body">Las contraseñas no coinciden</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full rounded-lg py-2.5 text-base font-semibold text-[var(--bg-primary)] btn-lift font-body"
                                style={{ backgroundColor: 'var(--accent-primary)' }}
                            >
                                Crear cuenta
                            </button>
                        </div>
                    </form>
                )}

                {error && (
                    <div className="bg-red-950/50 border border-red-500/30 text-red-400 p-3 mt-4 rounded-lg text-center font-body">
                        {error}
                    </div>
                )}

                <div className="py-6 flex items-center px-6">
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }}></div>
                    <p className="px-3 text-[var(--text-muted)] m-0 text-sm font-body">Ya tengo una cuenta</p>
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }}></div>
                </div>

                <div className="flex justify-center px-6">
                    <Link
                        to="/login"
                        className="w-full max-w-sm text-center rounded-lg py-2.5 font-semibold text-[var(--accent-secondary)] border border-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] hover:text-[var(--bg-primary)] transition-all duration-200 font-body"
                    >
                        Ir al login
                    </Link>
                </div>
            </div>
        </div>
    );
};