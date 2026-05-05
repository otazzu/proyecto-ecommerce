import React, { useState } from "react";
import { Link } from "react-router-dom";

export const EditProductCard = ({ product, onStatusChange, index = 0 }) => {
    const [isToggling, setIsToggling] = useState(false);

    const handleToggle = async () => {
        setIsToggling(true);
        try {
            await onStatusChange(product.id, product.status);
        } finally {
            setIsToggling(false);
        }
    };

    const staggerDelay = Math.min(index * 50, 400);

    const imageSrc =
        product.images && product.images.length > 0
            ? product.images[0]
            : "https://placeholder.pics/svg/300x200";

    const categoryLabel =
        product.technical_details?.collection ||
        product.technical_details?.anime_series ||
        null;

    return (
        <div
            className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border-subtle)] card-hover group animate-fade-in-up"
            style={{ backgroundColor: 'var(--bg-card)', animationDelay: `${staggerDelay}ms` }}
        >
            {/* Product Image */}
            <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg">
                <img
                    src={imageSrc}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0 px-3">
                <h3 className="font-display text-[var(--text-primary)] font-semibold text-sm leading-tight truncate">
                    {product.name}
                </h3>
                <p className="font-mono text-[var(--text-muted)] text-xs mt-1">
                    SKU-{String(product.id).padStart(4, "0")}
                </p>
                {categoryLabel && (
                    <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] rounded-full">
                        {categoryLabel}
                    </span>
                )}
            </div>

            {/* Right Section: Status LED + Toggle + Edit (compact) */}
            <div className="flex items-center gap-3 flex-shrink-0">
                {/* LED + Toggle stacked */}
                <div className="flex flex-col items-center gap-1.5">
                    <span
                        className={`led-indicator ${product.status ? "active" : "inactive"}`}
                        title={product.status ? "Activo" : "Inactivo"}
                        aria-label={product.status ? "Producto activo" : "Producto inactivo"}
                    />
                    {isToggling && (
                        <div className="w-3 h-3 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
                    )}
                    <button
                        className={`status-toggle ${product.status ? "active" : "inactive"}`}
                        onClick={handleToggle}
                        disabled={isToggling}
                        role="switch"
                        aria-checked={product.status}
                        aria-label={`Cambiar estado de ${product.name}`}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleToggle();
                            }
                        }}
                    >
                        <span
                            className={`inline-block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                                product.status ? "translate-x-5" : "translate-x-1"
                            }`}
                        />
                    </button>
                </div>

                {/* Edit Button */}
                <Link
                    to={`/selectproducttomodify/${product.id}`}
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:shadow-[0_0_10px_rgba(0,212,170,0.2)] transition-all duration-200"
                    style={{ backgroundColor: 'var(--bg-elevated)' }}
                    aria-label={`Editar ${product.name}`}
                >
                    <i className="fa-solid fa-pen-to-square text-xs" />
                </Link>
            </div>
        </div>
    );
};