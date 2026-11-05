import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  // El id de la URL viene como texto, por eso se convierte a número
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="message-box">
        <h1>Producto no encontrado</h1>
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

        {message && <p className="message">{message}</p>}

        <Link to="/products" className="button button-secondary">
          Volver al catálogo
        </Link>
      </div>
    </div>
  );
}
