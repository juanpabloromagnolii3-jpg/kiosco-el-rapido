import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductById } from "../services/api";
import type { Product } from "../types";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  // Cada vez que cambia el id de la URL se pide el producto al backend
  useEffect(() => {
    setLoading(true);
    setError("");
    setProduct(null);

    // El id de la URL viene como texto, por eso se convierte a número
    const productId = Number(id);
    if (isNaN(productId)) {
      setError("Producto no encontrado");
      setLoading(false);
      return;
    }

    getProductById(productId)
      .then((data) => setProduct(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="message">Cargando producto...</p>;
  }

  if (error || !product) {
    return (
      <div className="message-box">
        <p className="error">{error}</p>
        <Link to="/products" className="button">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    if (quantity < 1 || quantity > product.stock) {
      setMessage(`La cantidad tiene que estar entre 1 y ${product.stock}.`);
      return;
    }
    addToCart(product, quantity);
    setMessage(`Agregaste ${quantity} unidad(es) al carrito.`);
  };

  return (
    <div className="detail">
      <img src={product.image} alt={product.name} className="detail-image" />
      <div className="detail-info">
        <span className="category">{product.category}</span>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p className="price">${product.price.toLocaleString("es-AR")}</p>
        <p>Stock: {product.stock}</p>

        {product.stock > 0 ? (
          <div className="add-form">
            <label>
              Cantidad:{" "}
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </label>
            <button className="button" onClick={handleAdd}>
              Agregar al carrito
            </button>
          </div>
        ) : (
          <p className="error">Sin stock</p>
        )}

        {message && <p className="message">{message}</p>}

        <Link to="/products" className="button button-secondary">
          Volver al catálogo
        </Link>
      </div>
    </div>
  );
}
