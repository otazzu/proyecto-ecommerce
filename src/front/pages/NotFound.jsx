import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, var(--accent-primary), transparent)' }}></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, var(--accent-secondary), transparent)' }}></div>

            <div className="text-center relative z-10 animate-fade-in-up">
                {/* Glitch 404 */}
                <div className="relative mb-8">
                    <h1
                        className="font-display text-[120px] md:text-[180px] font-extrabold leading-none"
                        style={{
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary), var(--accent-secondary))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        404
                    </h1>
                    {/* Glitch overlay */}
                    <h1
                        className="font-display text-[120px] md:text-[180px] font-extrabold leading-none absolute inset-0 opacity-20"
                        style={{
                            color: 'var(--accent-secondary)',
                            transform: 'translate(4px, -2px)',
                        }}
                    >
                        404
                    </h1>
                </div>

                <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4">
                    Esta página se perdió en el multiverso
                </h2>

                <p className="text-[var(--text-secondary)] font-body text-lg mb-8 max-w-md mx-auto">
                    Parece que la página que buscas no existe o ha sido movida a otra dimensión.
                </p>

                {/* Decorative element */}
                <div className="flex items-center justify-center gap-4 mb-10">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--accent-primary)]"></div>
                    <i className="fas fa-atom text-[var(--accent-primary)] text-xl animate-pulse"></i>
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--accent-primary)]"></div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/"
                        className="px-8 py-3 rounded-lg font-semibold text-[var(--bg-primary)] btn-lift font-body"
                        style={{ backgroundColor: 'var(--accent-primary)' }}
                    >
                        <i className="fas fa-home mr-2"></i>
                        Volver al Inicio
                    </Link>
                    <Link
                        to="/catalog"
                        className="px-8 py-3 rounded-lg font-semibold border border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-all duration-200 font-body"
                    >
                        <i className="fas fa-store mr-2"></i>
                        Ir al Catálogo
                    </Link>
                </div>
            </div>
        </div>
    );
};