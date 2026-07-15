import { createContext, useContext, useState, useEffect } from 'react';

// Cart item shape: { product_id, variant_id, name, variantLabel, price, quantity }
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('shopping-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('shopping-cart', JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  const addItem = (product, variant, quantity = 1) => {
    const variantId = variant?.id ?? null;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product_id === product.id && item.variant_id === variantId
      );
      if (existingIndex !== -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      const variantLabel = variant
        ? [variant.option1_value, variant.option2_value].filter(Boolean).join(' / ')
        : null;

      const newItem = {
        product_id: product.id,
        variant_id: variantId,
        name: product.name,
        variantLabel,
        price: variant?.price ?? product.price,
        quantity,
      };
      return [...prevCart, newItem];
    });

    setIsOpen(true);
  };

  const removeItem = (itemIndex) => {
    setCart((prevCart) => prevCart.filter((_, idx) => idx !== itemIndex));
  };

  const updateQuantity = (itemIndex, newQuantity) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      if (newQuantity <= 0) {
        updated.splice(itemIndex, 1);
      } else {
        updated[itemIndex] = { ...updated[itemIndex], quantity: newQuantity };
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  return (
    <CartContext.Provider
      value={{
        cart,
        isHydrated,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}