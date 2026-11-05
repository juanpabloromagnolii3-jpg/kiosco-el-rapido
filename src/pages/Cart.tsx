import { useState } from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";

export default function Cart() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [orderMessage, setOrderMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Envía el pedido al backend (POST /api/orders)
  async function handleCheckout() {
    setLoading(true);
    setError("");
    setOrderMessage("");

    try {
      const order = await createOrder(items);
      setOrderMessage(
        `¡Pedido #${order.id} realizado con éxito! Total: $${order.total.toLocaleString("es-AR")}. Gracias por tu compra.`,
      );
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
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

        {error && <p className="error">No se pudo realizar el pedido. {error}</p>}

        <div className="cart-buttons">
          <button className="button button-secondary" onClick={clearCart} disabled={loading}>
            Vaciar carrito
          </button>
          <button className="button" onClick={handleCheckout} disabled={loading}>
            {loading ? "Enviando pedido..." : "Finalizar pedido"}
          </button>
        </div>
      </div>
    </div>
  );
}
