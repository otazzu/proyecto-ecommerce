import React from "react";

export const Terms = () => {
    return (
        <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="container mx-auto max-w-3xl">
                <div className="text-center mb-12 animate-fade-in-up">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <i className="fas fa-file-contract text-3xl" style={{ color: 'var(--accent-primary)' }}></i>
                        <h1 className="font-display text-4xl font-bold text-[var(--text-primary)]">Términos y Condiciones</h1>
                    </div>
                    <p className="text-[var(--text-secondary)] font-body">
                        Última actualización: Enero 2025
                    </p>
                </div>

                <div className="space-y-6">
                    {[
                        {
                            title: "1. Aceptación de los Términos",
                            content: "Al acceder y utilizar el sitio web de Kurisu Shop, aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguno de estos términos, te rogamos que no utilices nuestro sitio web."
                        },
                        {
                            title: "2. Productos y Disponibilidad",
                            content: "Nos esforzamos por mostrar los productos con la mayor precisión posible. Sin embargo, los colores y dimensiones pueden variar ligeramente según la configuración de tu pantalla. Nos reservamos el derecho de limitar las cantidades y modificar los precios sin previo aviso. La disponibilidad de los productos está sujeta a cambios."
                        },
                        {
                            title: "3. Precios y Pagos",
                            content: "Todos los precios se muestran en euros (€) e incluyen el IVA aplicable. Kurisu Shop se reserva el derecho de modificar los precios en cualquier momento. Los pagos se procesan de forma segura a través de nuestros proveedores de pago certificados."
                        },
                        {
                            title: "4. Envíos",
                            content: "Los plazos de envío son estimados y pueden variar según el destino y la disponibilidad del producto. No nos hacemos responsables de retrasos causados por fuerzas mayores, problemas aduaneros o situaciones fuera de nuestro control. Los gastos de envío se calculan durante el proceso de compra."
                        },
                        {
                            title: "5. Devoluciones y Reembolsos",
                            content: "Puedes solicitar la devolución de un producto dentro de los 14 días siguientes a la recepción, siempre que esté en su embalaje original y en perfectas condiciones. Los productos dañados deben ser notificados dentro de las 48 horas siguientes a la recepción. El reembolso se procesará en un plazo de 5-10 días laborables tras recibir el producto devuelto."
                        },
                        {
                            title: "6. Propiedad Intelectual",
                            content: "Todo el contenido del sitio web, incluyendo textos, imágenes, logotipos, diseños y código fuente, es propiedad de Kurisu Shop y está protegido por las leyes de propiedad intelectual. Queda prohibida su reproducción sin autorización expresa."
                        },
                        {
                            title: "7. Protección de Datos",
                            content: "En cumplimiento del Reglamento General de Protección de Datos (RGPD), informamos que los datos personales recopilados durante el proceso de compra serán tratados conforme a nuestra Política de Privacidad. Puedes ejercer tus derechos de acceso, rectificación y supresión contactándonos directamente."
                        },
                        {
                            title: "8. Limitación de Responsabilidad",
                            content: "Kurisu Shop no se hace responsable de los daños indirectos, incidentales o consecuentes que puedan derivarse del uso de nuestros productos o servicios. Nuestra responsabilidad máxima se limita al importe pagado por el producto en cuestión."
                        },
                        {
                            title: "9. Modificaciones",
                            content: "Kurisu Shop se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en el sitio web. Se recomienda revisar esta página periódicamente."
                        },
                        {
                            title: "10. Contacto",
                            content: "Para cualquier consulta relacionada con estos Términos y Condiciones, puedes contactarnos en soporte@kurisushop.com."
                        }
                    ].map((section, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-[var(--border-subtle)] p-6"
                            style={{ backgroundColor: 'var(--bg-card)' }}
                        >
                            <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-3">{section.title}</h2>
                            <p className="text-[var(--text-secondary)] font-body leading-relaxed">{section.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};