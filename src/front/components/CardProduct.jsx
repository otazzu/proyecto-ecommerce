import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { isNew as isNewProduct, getDiscountPercentage } from '../utils/productHelpers';
import { ModalAddToCart } from './ModalAddToCart';

export const CardProduct = ({ products }) => {
    return (
        <>
            {products.map((product) => (
                <CardProductItem key={product.id} product={product} />
            ))}
        </>
    );
};

const CardProductItem = ({ product }) => {
    const { addToCart } = useCart();
    const toast = useToast();
    const [showModal, setShowModal] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart(product, 1);
        toast.showSuccess(`${product.name} añadido al carrito`);

        setShowModal(true);
    };

    return (
        <div className="group font-display text-2xl/9 font-bold tracking-tight rounded-xl border border-[var(--border-subtle)] overflow-hidden w-full card-hover"
            style={{ backgroundColor: 'var(--bg-card)' }}
        >
            <Link
                to={`/product/products/${product.id}`}
                className="block"
            >
                <div className="relative overflow-hidden">
                    <img
                        src={
                            product.images && product.images.length > 0
                                ? product.images[0]
                                : "https://placehold.co/400x300/1a1a25/a0a0b0?text=Sin+Imagen"
                        }
                        className="w-full h-72 object-cover object-top transform group-hover:scale-110 transition-transform duration-500"
                        alt={product.name}
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* New badge */}
                    {product.created_at && isNewProduct(product.created_at) && (
                        <div className="absolute top-3 left-3 bg-[var(--accent-tertiary)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            NUEVO
                        </div>
                    )}

                    {/* Sale badge */}
                    {product.on_sale && (
                        <div className="absolute top-3 right-3 bg-[var(--accent-secondary)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            OFERTA
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <div className="h-14 mb-3 overflow-hidden">
                        <h5 className="text-sm font-semibold leading-tight line-clamp-2 text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-200">
                            {product.name}
                        </h5>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                            <span className="text-[var(--text-muted)] text-xs font-body">Precio</span>
                            {product.on_sale && product.original_price ? (
                                <div className="flex flex-col gap-1">
                                    <p className="font-mono text-[var(--accent-secondary)] text-xl font-bold">{product.price}€</p>
                                    <span className="text-sm text-[var(--text-muted)] line-through font-mono">{product.original_price}€</span>
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full w-fit" style={{ backgroundColor: 'rgba(255,107,157,0.15)', color: 'var(--accent-secondary)' }}>
                                        -{getDiscountPercentage(product.original_price, product.price)}%
                                    </span>
                                </div>
                            ) : (
                                <p className="font-mono text-[var(--accent-primary)] text-xl font-bold">{product.price}€</p>
                            )}
                        </div>
                        <div className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors">
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="text-sm w-full rounded-lg justify-center px-3 py-2.5 font-semibold transition-all duration-300 flex items-center gap-2 text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] hover:border-[var(--accent-primary)]"
                        style={{ backgroundColor: 'var(--bg-elevated)' }}
                    >
                        <i className="fas fa-cart-plus text-xs"></i>
                        Añadir al carrito
                    </button>
                </div>
            </Link>

            <ModalAddToCart
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                product={{
                    name: product.name,
                    price: product.price,
                    original_price: product.original_price,
                    on_sale: product.on_sale,
                    image: product.images && product.images.length > 0 ? product.images[0] : '',
                    quantity: 1,
                }}
            />
        </div>
    );
};