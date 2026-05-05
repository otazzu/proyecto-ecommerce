import React from "react";

export const Cookies = () => {
    return (
        <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="container mx-auto max-w-3xl">
                <div className="text-center mb-12 animate-fade-in-up">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <i className="fas fa-cookie-bite text-3xl" style={{ color: 'var(--accent-primary)' }}></i>
                        <h1 className="font-display text-4xl font-bold text-[var(--text-primary)]">Política de Cookies</h1>
                    </div>
                    <p className="text-[var(--text-secondary)] font-body">
                        Última actualización: Enero 2025
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border border-[var(--border-subtle)] p-6" style={{ backgroundColor: 'var(--bg-card)' }}>
                        <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-3">¿Qué son las Cookies?</h2>
                        <p className="text-[var(--text-secondary)] font-body leading-relaxed">
                            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, tablet o móvil) cuando visitas un sitio web. Permiten que el sitio recuerde tus acciones y preferencias durante un período de tiempo, para que no tengas que volver a configurarlos cada vez que navegues por el sitio o cambies de página.
                        </p>
                    </div>

                    <div className="rounded-xl border border-[var(--border-subtle)] p-6" style={{ backgroundColor: 'var(--bg-card)' }}>
                        <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-3">Tipos de Cookies que Utilizamos</h2>

                        <div className="space-y-4 mt-4">
                            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                <h3 className="font-semibold text-[var(--text-primary)] font-display mb-1">Cookies Técnicas (Necesarias)</h3>
                                <p className="text-[var(--text-secondary)] text-sm font-body">Son esenciales para el funcionamiento del sitio web. Permiten la navegación básica, el acceso a áreas seguras y la funcionalidad del carrito de compra. Sin estas cookies, el sitio no puede funcionar correctamente.</p>
                            </div>

                            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                <h3 className="font-semibold text-[var(--text-primary)] font-display mb-1">Cookies de Análisis</h3>
                                <p className="text-[var(--text-secondary)] text-sm font-body">Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web, recopilando información de forma anónima. Utilizamos esta información para mejorar la experiencia del usuario y optimizar el rendimiento del sitio.</p>
                            </div>

                            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                <h3 className="font-semibold text-[var(--text-primary)] font-display mb-1">Cookies de Funcionalidad</h3>
                                <p className="text-[var(--text-secondary)] text-sm font-body">Permiten recordar tus preferencias (como el idioma o la región) y ofrecen funcionalidades mejoradas y personalizadas. Pueden ser establecidas por nosotros o por proveedores externos.</p>
                            </div>

                            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                <h3 className="font-semibold text-[var(--text-primary)] font-display mb-1">Cookies de Marketing</h3>
                                <p className="text-[var(--text-secondary)] text-sm font-body">Se utilizan para rastrear visitantes a través de los sitios web. La intención es mostrar anuncios relevantes y atractivos para el usuario individual, y más valiosos para los editores y anunciantes externos.</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-[var(--border-subtle)] p-6" style={{ backgroundColor: 'var(--bg-card)' }}>
                        <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-3">Cómo Gestionar las Cookies</h2>
                        <p className="text-[var(--text-secondary)] font-body leading-relaxed mb-4">
                            Puedes gestionar tus preferencias de cookies de diversas formas:
                        </p>
                        <ul className="space-y-2 text-[var(--text-secondary)] font-body">
                            <li className="flex items-start gap-2">
                                <i className="fas fa-check text-[var(--accent-primary)] mt-1 text-sm"></i>
                                <span><strong className="text-[var(--text-primary)]">Configuración del navegador:</strong> La mayoría de los navegadores permiten configurar el tratamiento de cookies. Puedes configurar tu navegador para rechazar todas las cookies, aceptar solo ciertas cookies, o eliminar las cookies existentes.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <i className="fas fa-check text-[var(--accent-primary)] mt-1 text-sm"></i>
                                <span><strong className="text-[var(--text-primary)]">Herramientas de opt-out:</strong> Algunas redes publicitarias ofrecen herramientas para excluirse de la publicidad personalizada.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <i className="fas fa-check text-[var(--accent-primary)] mt-1 text-sm"></i>
                                <span><strong className="text-[var(--text-primary)]">Contacto directo:</strong> Para cualquier consulta sobre cookies, puedes contactarnos en soporte@kurisushop.com.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-xl border border-[var(--border-subtle)] p-6" style={{ backgroundColor: 'var(--bg-card)' }}>
                        <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-3">Nota Importante</h2>
                        <p className="text-[var(--text-secondary)] font-body leading-relaxed">
                            La desactivación de cookies técnicas puede afectar el funcionamiento del sitio web. Desactivar las cookies no eliminará las ya existentes en tu dispositivo. Para eliminar las cookies existentes, deberás hacerlo a través de la configuración de tu navegador.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};