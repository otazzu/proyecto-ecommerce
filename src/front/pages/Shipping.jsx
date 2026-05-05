import React from "react";

export const Shipping = () => {
    return (
        <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="container mx-auto max-w-3xl">
                <div className="text-center mb-12 animate-fade-in-up">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <i className="fas fa-shipping-fast text-3xl" style={{ color: 'var(--accent-primary)' }}></i>
                        <h1 className="font-display text-4xl font-bold text-[var(--text-primary)]">Envíos y Devoluciones</h1>
                    </div>
                    <p className="text-[var(--text-secondary)] font-body">
                        Toda la información sobre nuestros envíos y política de devoluciones
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Shipping */}
                    <div className="rounded-xl border border-[var(--border-subtle)] p-6" style={{ backgroundColor: 'var(--bg-card)' }}>
                        <h2 className="font-display text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <i className="fas fa-truck" style={{ color: 'var(--accent-primary)' }}></i>
                            Política de Envíos
                        </h2>

                        <div className="space-y-4 text-[var(--text-secondary)] font-body leading-relaxed">
                            <div>
                                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Envío Nacional (España)</h3>
                                <p>Los envíos nacionales se realizan en un plazo de <strong className="text-[var(--accent-primary)]">3-5 días laborables</strong>. El coste de envío es de <strong>4,99€</strong> para pedidos inferiores a 50€. Para pedidos superiores a 50€, el envío es <strong className="text-[var(--accent-primary)]">gratuito</strong>.</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Envío Internacional (Europa)</h3>
                                <p>Los envíos internacionales a Europa se realizan en un plazo de <strong className="text-[var(--accent-primary)]">7-15 días laborables</strong>. El coste varía según el destino y se calcula automáticamente durante el checkout.</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Embalaje</h3>
                                <p>Todas nuestras figuras se envían en un embalaje especialmente diseñado para proteger el producto durante el transporte. Utilizamos material de relleno de alta calidad para garantizar que tu figura llegue en perfectas condiciones.</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Seguimiento del Envío</h3>
                                <p>Una vez enviado tu pedido, recibirás un correo electrónico con el número de seguimiento para que puedas comprobar el estado de tu envío en cualquier momento.</p>
                            </div>
                        </div>
                    </div>

                    {/* Returns */}
                    <div className="rounded-xl border border-[var(--border-subtle)] p-6" style={{ backgroundColor: 'var(--bg-card)' }}>
                        <h2 className="font-display text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <i className="fas fa-rotate-left" style={{ color: 'var(--accent-secondary)' }}></i>
                            Política de Devoluciones
                        </h2>

                        <div className="space-y-4 text-[var(--text-secondary)] font-body leading-relaxed">
                            <div>
                                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Plazo de Devolución</h3>
                                <p>Puedes solicitar una devolución dentro de los <strong className="text-[var(--accent-secondary)]">14 días</strong> siguientes a la recepción del producto. El producto debe estar en su embalaje original y en perfectas condiciones.</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Producto Dañado</h3>
                                <p>Si tu producto llega dañado, contáctanos en un plazo de <strong>48 horas</strong> con fotografías del daño. Te enviaremos un reemplazo o reembolso sin coste adicional.</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Proceso de Devolución</h3>
                                <ol className="list-decimal list-inside space-y-1.5 ml-2">
                                    <li>Contacta con nuestro equipo de soporte</li>
                                    <li>Recibirás instrucciones de envío</li>
                                    <li>Empaqueta el producto en su embalaje original</li>
                                    <li>Envía el paquete según las instrucciones</li>
                                    <li>Recibirás tu reembolso en 5-10 días laborables</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};