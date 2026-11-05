import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { CartItem, Product } from "../types";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Al iniciar, se carga el carrito guardado en localStorage (si hay uno)
  const [items, setItems] = useState<CartItem[]>(
    JSON.parse(localStorage.getItem("carrito") || "[]"),
  );

  // Cada vez que cambia el carrito, se guarda en localStorage
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(items));
  }, [items]);

  function addToCart(product: Product, quantity: number) {
    const existing = items.find((item) => item.product.id === product.id);

    if (existing) {
      // Si el producto ya está, se suma la cantidad (sin pasar el stock)
      const newQuantity = Math.min(existing.quantity + quantity, product.stock);
      setItems(
        items.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQuantity } : item,
        ),
      );
    } else {
      setItems([...items, { product, quantity: Math.min(quantity, product.stock) }]);
    }
  }

  function removeFromCart(productId: number) {
    setItems(items.filter((item) => item.product.id !== productId));
  }

  function updateQuantity(productId: number, quantity: number) {
    // Si la cantidad llega a 0, se elimina el producto del carrito
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(
      items.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item,
      ),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
}
