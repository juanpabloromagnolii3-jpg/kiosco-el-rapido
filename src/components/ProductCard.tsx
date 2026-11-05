import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { Product } from "../types";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();

  return (
    <div className="card">
      <Link to={`/products/${product.id}`}>
        <img src={product.image} alt={product.name} className="card-image" />
      </Link>
      <div className="card-body">
        <span className="category">{product.category}</span>
        <Link to={`/products/${product.id}`} className="card-title">
          {product.name}
        </Link>
        <p className="price">${product.price.toLocaleString("es-AR")}</p>
        <p className="stock">Stock: {product.stock}</p>
        <button className="button" onClick={() => addToCart(product, 1)}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
