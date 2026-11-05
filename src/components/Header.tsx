import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          Kiosco <span>El Rápido</span>
        </Link>
        <nav className="nav">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/products">Productos</NavLink>
          <NavLink to="/cart">Carrito ({totalItems})</NavLink>
        </nav>
      </div>
    </header>
  );
}
