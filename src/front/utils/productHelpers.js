/**
 * Determina si un producto es "nuevo" (creado hace menos de 30 días)
 */
export const isNew = (createdAt) => {
    if (!createdAt) return false;
    const now = new Date();
    const created = new Date(createdAt);
    const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
};

/**
 * Determina si un producto tiene una oferta reciente (actualizada hace menos de 30 días)
 */
export const hasRecentOffer = (saleUpdatedAt) => {
    if (!saleUpdatedAt) return false;
    const now = new Date();
    const saleDate = new Date(saleUpdatedAt);
    const diffDays = Math.floor((now - saleDate) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
};

/**
 * Calcula el porcentaje de descuento
 */
export const getDiscountPercentage = (originalPrice, currentPrice) => {
    if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0;
    return Math.round((1 - currentPrice / originalPrice) * 100);
};