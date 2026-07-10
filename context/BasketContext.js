import { createContext, useContext, useState, useEffect } from 'react';

const BasketContext = createContext();

export function BasketProvider({ children }) {
  const [basket, setBasket] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load basket from localStorage on initial client-side render
  useEffect(() => {
    const savedBasket = localStorage.getItem('shopping-basket');
    if (savedBasket) {
      try {
        setBasket(JSON.parse(savedBasket));
      } catch (error) {
        console.error('Failed to parse basket from localStorage:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Sync basket to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('shopping-basket', JSON.stringify(basket));
    }
  }, [basket, isHydrated]);

  const addToBasket = (product) => {
    setBasket((prevBasket) => {
      const existingItem = prevBasket.find((item) => item.id === product.id);
      if (existingItem) {
        return prevBasket.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevBasket, { ...product, quantity: 1 }];
    });
    setIsOpen(true); // Open the drawer when an item is added
  };

  const removeFromBasket = (productId) => {
    setBasket((prevBasket) => prevBasket.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, change) => {
    setBasket((prevBasket) => {
      return prevBasket
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + change;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const clearBasket = () => {
    setBasket([]);
  };

  const toggleBasket = () => setIsOpen((prev) => !prev);
  const openBasket = () => setIsOpen(true);
  const closeBasket = () => setIsOpen(false);

  return (
    <BasketContext.Provider
      value={{
        basket,
        isOpen,
        isHydrated,
        addToBasket,
        removeFromBasket,
        updateQuantity,
        clearBasket,
        toggleBasket,
        openBasket,
        closeBasket,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
}
