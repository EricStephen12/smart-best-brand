'use client'

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'

interface CartItem {
  id: string
  product_variant_id: string
  variant: any
  product: any
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; product: any; variant: any; quantity?: number }
  | { type: 'REMOVE_ITEM'; itemId: string }
  | { type: 'UPDATE_QUANTITY'; itemId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'LOAD_CART'; items: CartItem[] }

interface CartContextType {
  state: CartState
  addToCart: (product: any, variant: any, quantity?: number) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'LOAD_CART':
      return { ...state, items: action.items }

    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product_variant_id === action.variant.id)

      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product_variant_id === action.variant.id
            ? { ...item, quantity: item.quantity + (action.quantity || 1) }
            : item
        )
      } else {
        const newItem: CartItem = {
          id: `${Date.now()}-${action.variant.id}`,
          product_variant_id: action.variant.id,
          variant: action.variant,
          product: action.product,
          quantity: action.quantity || 1
        }
        newItems = [...state.items, newItem]
      }

      localStorage.setItem('sbb-cart', JSON.stringify(newItems))
      return {
        ...state,
        items: newItems,
        isOpen: true
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.itemId)
      localStorage.setItem('sbb-cart', JSON.stringify(newItems))
      return {
        ...state,
        items: newItems
      }
    }

    case 'UPDATE_QUANTITY': {
      let newItems;
      if (action.quantity <= 0) {
        newItems = state.items.filter(item => item.id !== action.itemId)
      } else {
        newItems = state.items.map(item =>
          item.id === action.itemId
            ? { ...item, quantity: action.quantity }
            : item
        )
      }
      localStorage.setItem('sbb-cart', JSON.stringify(newItems))
      return {
        ...state,
        items: newItems
      }
    }

    case 'CLEAR_CART':
      localStorage.removeItem('sbb-cart')
      return {
        ...state,
        items: []
      }

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      }

    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  isOpen: false
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    const savedCart = localStorage.getItem('sbb-cart')
    if (savedCart) {
      try {
        dispatch({ type: 'LOAD_CART', items: JSON.parse(savedCart) })
      } catch (e) {
        console.error('Failed to parse cart')
      }
    }
  }, [])

  const addToCart = (product: any, variant: any, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', product, variant, quantity })
  }

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', itemId })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', itemId, quantity })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  return (
    <CartContext.Provider value={{
      state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
