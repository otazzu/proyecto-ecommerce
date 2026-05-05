export const initialStore = () => {
  // Load cart from localStorage
  let cartItems = [];
  try {
    const stored = localStorage.getItem('cart');
    if (stored) {
      const parsed = JSON.parse(stored);
      cartItems = parsed.map(item => ({
        ...item,
        on_sale: item.on_sale || false,
        original_price: item.original_price || null,
      }));
    }
  } catch (e) {
    cartItems = [];
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    message: null,
    cart: {
      items: cartItems,
      total,
      itemCount,
    },
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'set_message':
      return {
        ...store,
        message: action.payload,
      };

    case 'ADD_TO_CART': {
      const product = action.payload;
      const existingIndex = store.cart.items.findIndex(item => item.id === product.id);
      let newItems;

      if (existingIndex !== -1) {
        newItems = store.cart.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      } else {
        newItems = [...store.cart.items, { ...product, quantity: product.quantity || 1 }];
      }

      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      localStorage.setItem('cart', JSON.stringify(newItems));
      window.dispatchEvent(new Event('cartChanged'));

      return {
        ...store,
        cart: { items: newItems, total, itemCount },
      };
    }

    case 'REMOVE_FROM_CART': {
      const productId = action.payload;
      const newItems = store.cart.items.filter(item => item.id !== productId);
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      localStorage.setItem('cart', JSON.stringify(newItems));
      window.dispatchEvent(new Event('cartChanged'));

      return {
        ...store,
        cart: { items: newItems, total, itemCount },
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity < 1) return store;

      const newItems = store.cart.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      localStorage.setItem('cart', JSON.stringify(newItems));
      window.dispatchEvent(new Event('cartChanged'));

      return {
        ...store,
        cart: { items: newItems, total, itemCount },
      };
    }

    case 'CLEAR_CART': {
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartChanged'));

      return {
        ...store,
        cart: { items: [], total: 0, itemCount: 0 },
      };
    }

    case 'LOAD_CART': {
      const items = action.payload;
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...store,
        cart: { items, total, itemCount },
      };
    }

    default:
      return store;
  }
}