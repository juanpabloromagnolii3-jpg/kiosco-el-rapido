import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <h1>¡Bienvenido a Kiosco El Rápido!</h1>
      <p>Bebidas, snacks, golosinas y todo lo que necesitás, a la vuelta de tu casa.</p>
      <Link to="/products" className="button button-big">
        Ver catálogo
      </Link>
    </div>
  );
}
