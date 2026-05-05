import React from "react";

export const FAQ = () => {
    const faqs = [
        {
            q: "¿Cuánto tarda el envío?",
            a: "Los envíos nacionales suelen tardar entre 3-5 días laborables. Los envíos internacionales pueden tardar entre 7-15 días laborables dependiendo del destino."
        },
        {
            q: "¿Puedo devolver un producto?",
            a: "Sí, puedes solicitar una devolución dentro de los 14 días siguientes a la recepción del producto, siempre que esté en su embalaje original y en perfectas condiciones."
        },
        {
            q: "¿Los productos son originales?",
            a: "Todos nuestros productos son 100% originales y provienen directamente de los fabricantes autorizados. Garantizamos la autenticidad de cada figura."
        },
        {
            q: "¿Cómo puedo realizar un pedido?",
            a: "Simplemente añade los productos que desees al carrito, accede a la página de checkout y sigue los pasos para completar tu compra. Necesitarás estar registrado para poder finalizar el pedido."
        },
        {
            q: "¿Qué métodos de pago aceptáis?",
            a: "Aceptamos Visa, Mastercard, PayPal y Stripe. Todos los pagos están protegidos con encriptación SSL."
        },
        {
            q: "¿Qué hago si mi producto llega dañado?",
            a: "Si tu producto llega dañado, contáctanos en un plazo de 48 horas con fotografías del daño y te enviaremos un reemplazo o reembolso."
        },
        {
            q: "¿Hacéis envíos internacionales?",
            a: "Sí, realizamos envíos a la mayoría de países europeos. Para otros destinos, contáctanos para verificar la disponibilidad."
        }
    ];

    return (
        <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="container mx-auto max-w-3xl">
                <div className="text-center mb-12 animate-fade-in-up">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <i className="fas fa-question-circle text-3xl" style={{ color: 'var(--accent-primary)' }}></i>
                        <h1 className="font-display text-4xl font-bold text-[var(--text-primary)]">Preguntas Frecuentes</h1>
                    </div>
                    <p className="text-[var(--text-secondary)] font-body">
                        Encuentra respuestas a las preguntas más comunes sobre Kurisu Shop
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <details
                            key={index}
                            className="rounded-xl border border-[var(--border-subtle)] overflow-hidden group"
                            style={{ backgroundColor: 'var(--bg-card)' }}
                        >
                            <summary className="flex items-center justify-between p-5 cursor-pointer text-[var(--text-primary)] font-display font-semibold hover:text-[var(--accent-primary)] transition-colors">
                                <span>{faq.q}</span>
                                <i className="fas fa-chevron-down text-[var(--text-muted)] group-open:rotate-180 transition-transform duration-200"></i>
                            </summary>
                            <div className="px-5 pb-5 text-[var(--text-secondary)] font-body leading-relaxed">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </div>
    );
};