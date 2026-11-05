import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="message-box">
      <h1>404</h1>
      <p>La página que buscás no existe.</p>
      <Link to="/" className="button">
        Volver al inicio
      </Link>
    </div>
  );
}
