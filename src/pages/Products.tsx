import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/api";
import type { Product } from "../types";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cada vez que cambia la categoría se vuelven a pedir los productos al backend
  useEffect(() => {
    setLoading(true);
    setError("");

    getProducts(category)
      .then((data) => setProducts(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  function handleCategoryChange(value: string) {
    if (value === "") {
      setSearchParams({}); // "Todas": se borra el query param
    } else {
      setSearchParams({ category: value });
    }
  }

  return (
    <div>
      <div className="products-header">
        <h1>Productos</h1>
        <label>
          Categoría:{" "}
          <select value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
            <option value="">Todas</option>
            <option value="bebidas">Bebidas</option>
            <option value="snacks">Snacks</option>
            <option value="golosinas">Golosinas</option>
            <option value="varios">Varios</option>
          </select>
        </label>
      </div>

      {loading && <p className="message">Cargando productos...</p>}

      {error && (
        <p className="error">
          No se pudieron cargar los productos. {error}
        </p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="message">No hay productos en esta categoría.</p>
      )}

      {!loading && !error && (
        <div className="grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
