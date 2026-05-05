import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { Spinner } from '../components/Spinner';

export const Cart = () => {
  const { cartItems, cartTotal, cartItemCount, removeFromCart, updateQuantity, clearCart } = useCart();
  const toast = useToast();

  const shippingCost = cartTotal > 50 ? 0 : 4.99;
  const total = cartTotal + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="w-28 h-28 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--bg-card)' }}>
          <i className="fas fa-bag-shopping text-5xl text-[var(--text-muted)]"></i>
        </div>
        <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-2">Tu carrito está vacío</h2>
        <p className="text-[var(--text-muted)] text-center mb-8 max-w-md">
          ¡Aún no has añadido ninguna figura a tu colección! Explora nuestro catálogo y encuentra las piezas perfectas.
        </p>
        <Link
          to="/catalog"
          className="px-8 py-3 rounded-lg font-semibold text-[var(--bg-primary)] btn-lift"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          <i className="fas fa-store mr-2"></i>
          Explorar Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
            Tu Carrito
          </h1>
          <p className="text-[var(--text-muted)]">
            {cartItemCount} {cartItemCount === 1 ? 'artículo' : 'artículos'} en tu carrito
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 animate-fade-in-up stagger-1">
            <div className="space-y-4">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-xl border border-[var(--border-subtle)] card-hover"
                  style={{ backgroundColor: 'var(--bg-card)' }}
                >
                  {/* Image */}
                  <Link to={`/product/products/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image || 'https://placehold.co/120x120/1a1a25/a0a0b0?text=IMG'}
                      alt={item.name}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/products/${item.id}`}>
                      <h3 className="font-display font-semibold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm text-[var(--accent-primary)] font-semibold mt-1">
                        {item.price}€ / unidad
                      </p>
                      {item.on_sale && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,107,157,0.15)', color: 'var(--accent-secondary)' }}>
                          ¡Precio de oferta!
                        </span>
                      )}
                    </div>
                    {item.on_sale && item.original_price && (
                      <p className="text-xs text-[var(--text-muted)] line-through font-mono mt-1">
                        Precio anterior: {item.original_price}€
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all"
                        style={{ backgroundColor: 'var(--bg-elevated)' }}
                      >
                        <i className="fas fa-minus text-xs"></i>
                      </button>
                      <span className="font-mono text-[var(--text-primary)] min-w-[24px] text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all"
                        style={{ backgroundColor: 'var(--bg-elevated)' }}
                      >
                        <i className="fas fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>

                  {/* Price + Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => {
                        removeFromCart(item.id);
                        toast.showInfo('Producto eliminado del carrito');
                      }}
                      className="text-[var(--text-muted)] hover:text-[var(--accent-secondary)] transition-colors p-1"
                    >
                      <i className="fas fa-trash-can"></i>
                    </button>
                    <div className="text-right">
                      <span className="font-mono text-lg font-bold text-[var(--text-primary)]">
                        {(item.price * item.quantity).toFixed(2)}€
                      </span>
                      {item.quantity > 1 && (
                        <p className="text-xs text-[var(--text-muted)]">
                          {item.price}€ c/u
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart */}
            <div className="mt-6 flex justify-start">
              <button
                onClick={() => {
                  clearCart();
                  toast.showInfo('Carrito vaciado');
                }}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-secondary)] transition-colors flex items-center gap-2"
              >
                <i className="fas fa-trash"></i>
                Vaciar carrito
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 animate-fade-in-up stagger-2">
            <div className="sticky top-4 rounded-xl border border-[var(--border-subtle)] p-6" style={{ backgroundColor: 'var(--bg-card)' }}>
              <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-4">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Subtotal</span>
                  <span className="font-mono text-[var(--text-primary)]">{cartTotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Envío</span>
                  <span className="font-mono text-[var(--text-primary)]">
                    {shippingCost === 0 ? (
                      <span className="text-[var(--accent-primary)]">Gratis</span>
                    ) : (
                      `${shippingCost.toFixed(2)}€`
                    )}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-[var(--text-muted)]">
                    <i className="fas fa-info-circle mr-1"></i>
                    Envío gratis en pedidos superiores a 50€
                  </p>
                )}
                <div className="border-t border-[var(--border-subtle)] pt-3">
                  <div className="flex justify-between">
                    <span className="font-display font-bold text-[var(--text-primary)]">Total</span>
                    <span className="font-mono text-xl font-bold text-[var(--accent-primary)]">{total.toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              <button
                className="w-full py-3 rounded-lg font-semibold text-[var(--bg-primary)] btn-lift"
                style={{ backgroundColor: 'var(--accent-primary)' }}
                onClick={() => toast.showInfo('Checkout próximamente disponible')}
              >
                <i className="fas fa-lock mr-2"></i>
                Finalizar Compra
              </button>

              <Link
                to="/catalog"
                className="block w-full mt-3 py-2.5 rounded-lg font-semibold text-sm text-center border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Seguir Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};