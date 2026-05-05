import React from 'react';
import { Link } from 'react-router-dom';

export const ModalAddToCart = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
                <div
                    className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden animate-fade-in-up"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(139,92,246,0.15)' }}>
                                <i className="fas fa-check-circle text-2xl text-[var(--accent-primary)]"></i>
                            </div>
                            <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                                ¡Añadido al carrito!
                            </h3>
                        </div>

                        <div className="flex gap-4 p-3 rounded-xl border border-[var(--border-subtle)] mb-6" style={{ backgroundColor: 'var(--bg-card)' }}>
                            <img
                                src={product.image || 'https://placehold.co/80x80/1a1a25/a0a0b0?text=IMG'}
                                alt={product.name}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-[var(--text-primary)] font-display line-clamp-2 mb-1">
                                    {product.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                    {product.on_sale && product.original_price ? (
                                        <>
                                            <p className="font-mono text-[var(--accent-secondary)] font-bold">{product.price}€</p>
                                            <span className="text-xs text-[var(--text-muted)] line-through">{product.original_price}€</span>
                                        </>
                                    ) : (
                                        <p className="font-mono text-[var(--accent-primary)] font-bold">{product.price}€</p>
                                    )}
                                </div>
                                <p className="text-xs text-[var(--text-muted)] mt-1">Cantidad: {product.quantity || 1}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Link
                                to="/cart"
                                onClick={onClose}
                                className="w-full py-3 rounded-lg font-semibold text-center text-[var(--bg-primary)] btn-lift"
                                style={{ backgroundColor: 'var(--accent-primary)' }}
                            >
                                <i className="fas fa-shopping-cart mr-2"></i>
                                Ir al carrito
                            </Link>
                            <button
                                onClick={onClose}
                                className="w-full py-3 rounded-lg font-semibold text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-card)] transition-all duration-200"
                            >
                                Seguir comprando
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
