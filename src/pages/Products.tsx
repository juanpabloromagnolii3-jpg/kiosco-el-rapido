import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  // Si no hay categoría se muestran todos, si hay se filtran
  const filteredProducts =
    category === "" ? products : products.filter((product) => product.category === category);

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

      {filteredProducts.length === 0 && (
        <p className="message">No hay productos en la categoría "{category}".</p>
      )}

      <div className="grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
