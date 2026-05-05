import React from "react";
import { Link } from "react-router-dom";
import { useToast } from "../hooks/useToast";

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    const toast = useToast();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleContactClick = (e) => {
        e.preventDefault();
        toast.showInfo("Esta es una demo. El botón de contacto es solo decorativo para hacer la página vistosa.");
    };

    return (
        <footer className="relative w-full mt-auto border-t" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
            {/* Decorative gradient line */}
            <div className="h-px" style={{ background: 'linear-gradient(to right, transparent, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary), transparent)' }}></div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Column 1: About */}
                    <div>
                        <h3 className="font-display text-2xl font-bold mb-4" style={{ color: 'var(--accent-primary)' }}>
                            Kurisu Shop
                        </h3>
                        <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed font-body">
                            Tu tienda de confianza para figuras de colección de anime.
                            Calidad premium, envíos seguros y las mejores figuras del mercado.
                        </p>
                        <div className="flex gap-3">
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}
                                aria-label="Twitter"
                            >
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}
                                aria-label="Instagram"
                            >
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}
                                aria-label="Facebook"
                            >
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://discord.com" target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}
                                aria-label="Discord"
                            >
                                <i className="fab fa-discord"></i>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="font-display font-bold text-lg mb-4 text-[var(--text-primary)]">Enlaces Rápidos</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" onClick={scrollToTop} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm flex items-center gap-2 font-body">
                                    <i className="fas fa-home w-4"></i>
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/catalog" onClick={scrollToTop} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm flex items-center gap-2 font-body">
                                    <i className="fas fa-store w-4"></i>
                                    Catálogo
                                </Link>
                            </li>
                            <li>
                                <Link to="/newproducts" onClick={scrollToTop} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm flex items-center gap-2 font-body">
                                    <i className="fas fa-star w-4"></i>
                                    Novedades
                                </Link>
                            </li>
                            <li>
                                <Link to="/updateuser" onClick={scrollToTop} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm flex items-center gap-2 font-body">
                                    <i className="fas fa-user w-4"></i>
                                    Mi Perfil
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Help & Support */}
                    <div>
                        <h4 className="font-display font-bold text-lg mb-4 text-[var(--text-primary)]">Ayuda y Soporte</h4>
                        <ul className="space-y-2">
                            <li>
                                <button onClick={handleContactClick} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm flex items-center gap-2 font-body bg-transparent border-none p-0 cursor-pointer">
                                    <i className="fas fa-envelope w-4"></i>
                                    Contacto
                                </button>
                            </li>
                            <li>
                                <Link to="/faq" onClick={scrollToTop} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm flex items-center gap-2 font-body">
                                    <i className="fas fa-question-circle w-4"></i>
                                    Preguntas Frecuentes
                                </Link>
                            </li>
                            <li>
                                <Link to="/shipping" onClick={scrollToTop} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm flex items-center gap-2 font-body">
                                    <i className="fas fa-shipping-fast w-4"></i>
                                    Envíos y Devoluciones
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" onClick={scrollToTop} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm flex items-center gap-2 font-body">
                                    <i className="fas fa-file-contract w-4"></i>
                                    Términos y Condiciones
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Separator */}
            <div className="border-t" style={{ borderColor: 'var(--border-subtle)' }}></div>

            {/* Copyright */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[var(--text-muted)] text-sm font-body">
                        &copy; {currentYear} Kurisu Shop. Todos los derechos reservados.
                    </p>

                    <div className="flex items-center gap-6 text-sm font-body">
                        <Link to="/privacy" onClick={scrollToTop} className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
                            Política de Privacidad
                        </Link>
                        <Link to="/cookies" onClick={scrollToTop} className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
                            Cookies
                        </Link>
                    </div>

                    <button
                        onClick={scrollToTop}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 glow-accent-subtle"
                        style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--bg-primary)' }}
                        aria-label="Volver arriba"
                    >
                        <i className="fas fa-arrow-up"></i>
                    </button>
                </div>
            </div>
        </footer>
    );
};