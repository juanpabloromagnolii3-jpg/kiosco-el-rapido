import { useState } from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [orderMessage, setOrderMessage] = useState("");

  // Parte 1: el pedido solo se simula (no llama a ninguna API).
  // En la Parte 2 esta función va a enviar el pedido a POST /api/orders.
  function handleCheckout() {
    setOrderMessage("¡Pedido realizado con éxito! Gracias por tu compra.");
    clearCart();
  }

  if (items.length === 0) {
    return (
      <div className="message-box">
        {orderMessage ? <p className="success">{orderMessage}</p> : <h1>Tu carrito está vacío</h1>}
        <Link to="/products" className="button">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Carrito</h1>

      {items.map((item) => (
        <CartItem key={item.product.id} item={item} />
      ))}

      <div className="cart-summary">
        <p>Productos: {totalItems}</p>
        <p className="total">Total: ${totalPrice.toLocaleString("es-AR")}</p>
        <div className="cart-buttons">
          <button className="button button-secondary" onClick={clearCart}>
            Vaciar carrito
          </button>
          <button className="button" onClick={handleCheckout}>
            Finalizar pedido
          </button>
        </div>
      </div>
    </div>
  );
}
