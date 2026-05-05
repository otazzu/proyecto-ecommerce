import { useCallback } from 'react';
import useGlobalReducer from './useGlobalReducer';

export const useCart = () => {
  const { store, dispatch } = useGlobalReducer();

  const addToCart = useCallback((product, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        on_sale: product.on_sale || false,
        original_price: product.original_price || null,
        quantity,
      },
    });
  }, [dispatch]);

  const removeFromCart = useCallback((productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  }, [dispatch]);

  const updateQuantity = useCallback((productId, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity },
    });
  }, [dispatch]);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, [dispatch]);

  const cartItems = store?.cart?.items || [];
  const cartTotal = store?.cart?.total || 0;
  const cartItemCount = store?.cart?.itemCount || 0;

  return {
    cartItems,
    cartTotal,
    cartItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};