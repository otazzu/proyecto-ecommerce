import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';

export const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, cartTotal, cartItemCount, removeFromCart, updateQuantity } = useCart();
  const toast = useToast();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[9000] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 z-[9001] w-full max-w-md h-full overflow-hidden flex flex-col"
        style={{ backgroundColor: 'var(--bg-secondary)', borderLeft: '1px solid var(--border-subtle)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
          <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
            <i className="fas fa-shopping-bag mr-2 text-[var(--accent-primary)]"></i>
            Tu Carrito
            {cartItemCount > 0 && (
              <span className="ml-2 text-sm font-normal text-[var(--text-muted)]">
                ({cartItemCount} {cartItemCount === 1 ? 'artículo' : 'artículos'})
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
          >
            <i className="fas fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
                <i className="fas fa-bag-shopping text-3xl text-[var(--text-muted)]"></i>
              </div>
              <p className="text-[var(--text-secondary)] font-display font-semibold mb-2">Tu carrito está vacío</p>
              <p className="text-[var(--text-muted)] text-sm mb-6">¡Explora nuestro catálogo y añade figuras increíbles!</p>
              <Link
                to="/catalog"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg font-semibold text-sm text-[var(--bg-primary)] btn-lift"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                Ver Catálogo
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl border border-[var(--border-subtle)] card-hover"
                  style={{ backgroundColor: 'var(--bg-card)' }}
                >
                  {/* Image */}
                  <Link to={`/product/products/${item.id}`} onClick={onClose} className="flex-shrink-0">
                    <img
                      src={item.image || 'https://placehold.co/80x80/1a1a25/a0a0b0?text=IMG'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/products/${item.id}`} onClick={onClose}>
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] font-display line-clamp-1 hover:text-[var(--accent-primary)] transition-colors">
                        {item.name}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm text-[var(--accent-primary)] font-semibold mt-1">
                        {item.price}€
                      </p>
                      {item.on_sale && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,107,157,0.15)', color: 'var(--accent-secondary)' }}>
                          ¡Oferta!
                        </span>
                      )}
                    </div>
                    {item.on_sale && item.original_price && (
                      <p className="text-xs text-[var(--text-muted)] line-through font-mono mt-0.5">
                        Antes: {item.original_price}€
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        style={{ backgroundColor: 'var(--bg-elevated)' }}
                        disabled={item.quantity <= 1}
                      >
                        <i className="fas fa-minus text-xs"></i>
                      </button>
                      <span className="font-mono text-sm text-[var(--text-primary)] min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
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
                      className="text-[var(--text-muted)] hover:text-[var(--accent-secondary)] transition-colors"
                    >
                      <i className="fas fa-trash-can text-xs"></i>
                    </button>
                    <span className="font-mono text-sm font-semibold text-[var(--text-primary)]">
                      {(item.price * item.quantity).toFixed(2)}€
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-[var(--border-subtle)]" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[var(--text-secondary)] font-body">Subtotal</span>
              <span className="font-mono text-lg font-bold text-[var(--text-primary)]">{cartTotal.toFixed(2)}€</span>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                to="/cart"
                onClick={onClose}
                className="w-full py-2.5 rounded-lg text-center font-semibold text-sm border border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-all duration-200"
              >
                Ver Carrito Completo
              </Link>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-lg font-semibold text-sm text-[var(--bg-primary)] btn-lift"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};