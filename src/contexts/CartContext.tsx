import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Cart, CartItem, Product } from '../types';
import { cartAPI } from '../services/api';

// Cart State Interface
interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  isOpen: boolean;
}

// Cart Action Types
type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'REFRESH_CART' };

// Initial State
const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  isOpen: false,
};

// Cart Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_CART':
      return { ...state, cart: action.payload, error: null };
    
    case 'ADD_ITEM':
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [...state.cart.items, action.payload],
        },
      };
    
    case 'UPDATE_ITEM':
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.map(item =>
            item.id === action.payload.id ? action.payload : item
          ),
        },
      };
    
    case 'REMOVE_ITEM':
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter(item => item.id !== action.payload),
        },
      };
    
    case 'CLEAR_CART':
      if (!state.cart) return state;
      return {
        ...state,
        cart: { ...state.cart, items: [] },
      };
    
    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.payload };
    
    case 'REFRESH_CART':
      return { ...state };
    
    default:
      return state;
  }
};

// Cart Context Interface
interface CartContextType {
  state: CartState;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  getCartSummary: () => { totalItems: number; totalQuantity: number; itemCount: number };
}

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider Props
interface CartProviderProps {
  children: ReactNode;
}

// Cart Provider Component
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart on mount
  useEffect(() => {
    refreshCart();
  }, []);

  // Add item to cart
  const addToCart = async (product: Product, quantity: number): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await cartAPI.addToCart(product.id, quantity);
      dispatch({ type: 'SET_CART', payload: response });
      
      // Open cart to show the added item
      dispatch({ type: 'SET_CART_OPEN', payload: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId: number, quantity: number): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await cartAPI.updateCartItem(itemId, quantity);
      dispatch({ type: 'SET_CART', payload: response });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update cart item';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: number): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await cartAPI.removeFromCart(itemId);
      dispatch({ type: 'SET_CART', payload: response });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove item from cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Clear entire cart
  const clearCart = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await cartAPI.clearCart();
      dispatch({ type: 'SET_CART', payload: response });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Refresh cart from server
  const refreshCart = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await cartAPI.getCart();
      dispatch({ type: 'SET_CART', payload: response });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Open cart
  const openCart = (): void => {
    dispatch({ type: 'SET_CART_OPEN', payload: true });
  };

  // Close cart
  const closeCart = (): void => {
    dispatch({ type: 'SET_CART_OPEN', payload: false });
  };

  // Get cart summary
  const getCartSummary = () => {
    if (!state.cart) {
      return { totalItems: 0, totalQuantity: 0, itemCount: 0 };
    }
    
    return {
      totalItems: state.cart.total_items || 0,
      totalQuantity: state.cart.total_quantity || 0,
      itemCount: state.cart.items.length,
    };
  };

  const contextValue: CartContextType = {
    state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    openCart,
    closeCart,
    getCartSummary,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
