import React from "react";

export const Privacy = () => {
    return (
        <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="container mx-auto max-w-3xl">
                <div className="text-center mb-12 animate-fade-in-up">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <i className="fas fa-shield-halved text-3xl" style={{ color: 'var(--accent-primary)' }}></i>
                        <h1 className="font-display text-4xl font-bold text-[var(--text-primary)]">Política de Privacidad</h1>
                    </div>
                    <p className="text-[var(--text-secondary)] font-body">
                        Última actualización: Enero 2025
                    </p>
                </div>

                <div className="space-y-6">
                    {[
                        {
                            title: "1. Responsable del Tratamiento",
                            content: "El responsable del tratamiento de los datos personales es Kurisu Shop, con domicilio en España. Puedes contactarnos en soporte@kurisushop.com para cualquier consulta relacionada con la protección de tus datos personales."
                        },
                        {
                            title: "2. Datos que Recopilamos",
                            content: "Recopilamos los siguientes datos personales: nombre y apellidos, dirección de correo electrónico, dirección de envío, número de teléfono (opcional) y datos de navegación. Los datos de pago son procesados directamente por nuestros proveedores de pago y no son almacenados en nuestros servidores."
                        },
                        {
                            title: "3. Finalidad del Tratamiento",
                            content: "Utilizamos tus datos personales para: procesar y gestionar tus pedidos, enviar comunicaciones relacionadas con tu compra, gestionar devoluciones y reclamaciones, enviar información promocional (previo consentimiento), y mejorar nuestros servicios y la experiencia del usuario."
                        },
                        {
                            title: "4. Base Legal",
                            content: "El tratamiento de tus datos se basa en: la ejecución del contrato de compra, el consentimiento expreso para comunicaciones comerciales, el interés legítimo para mejorar nuestros servicios, y el cumplimiento de obligaciones legales."
                        },
                        {
                            title: "5. Conservación de Datos",
                            content: "Los datos personales se conservarán durante el tiempo necesario para cumplir con la finalidad para la que fueron recopilados, y durante los plazos legalmente establecidos. Los datos relacionados con compras se conservarán durante al menos 5 años por obligaciones fiscales."
                        },
                        {
                            title: "6. Derechos del Usuario",
                            content: "De acuerdo con el RGPD, tienes derecho a: acceder a tus datos personales, rectificar datos inexactos, solicitar la supresión de tus datos, oponerte al tratamiento, solicitar la limitación del tratamiento, y solicitar la portabilidad de tus datos. Puedes ejercer estos derechos contactándonos en soporte@kurisushop.com."
                        },
                        {
                            title: "7. Cookies",
                            content: "Nuestro sitio web utiliza cookies para mejorar la experiencia del usuario. Puedes consultar nuestra Política de Cookies para obtener más información sobre las cookies que utilizamos y cómo gestionarlas."
                        },
                        {
                            title: "8. Seguridad",
                            content: "Implementamos medidas de seguridad técnicas y organizativas adecuadas para proteger tus datos personales contra el acceso no autorizado, la alteración, la divulgación o la destrucción. Utilizamos encriptación SSL para proteger las transmisiones de datos."
                        },
                        {
                            title: "9. Terceros",
                            content: "No compartimos tus datos personales con terceros, excepto cuando sea necesario para la ejecución del contrato (proveedores de envío, procesadores de pago) o cuando lo exija la ley. Todos los terceros están sujetos a acuerdos de protección de datos."
                        },
                        {
                            title: "10. Contacto",
                            content: "Para cualquier consulta relacionada con nuestra Política de Privacidad, puedes contactarnos en soporte@kurisushop.com. También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD)."
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