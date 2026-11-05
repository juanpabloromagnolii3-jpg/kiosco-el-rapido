import type { CartItem, Order, Product } from "../types";

// Dirección del backend. Se puede cambiar con la variable VITE_API_URL en un archivo .env
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Hace la petición y, si algo falla, lanza un error con un mensaje claro para el usuario
async function request(url: string, options?: RequestInit) {
  let response: Response;

  try {
    response = await fetch(url, options);
  } catch {
    // fetch falla cuando no hay conexión con el servidor (apagado, CORS, sin internet)
    throw new Error("No se pudo conectar con el servidor. Revisá que el backend esté funcionando.");
  }

  if (!response.ok) {
    // FastAPI manda el motivo del error en "detail"
    let message = `Error del servidor (${response.status})`;
    try {
      const data = await response.json();
      if (typeof data.detail === "string") {
        message = data.detail;
      } else if (Array.isArray(data.detail)) {
        message = "Los datos enviados no son válidos.";
      }
    } catch {
      // la respuesta no era JSON: se deja el mensaje genérico
    }
    throw new Error(message);
  }

  return response.json();
}

export function getProducts(category?: string): Promise<Product[]> {
  if (category) {
    return request(`${API_URL}/api/products?category=${category}`);
  }
  return request(`${API_URL}/api/products`);
}

export function getProductById(id: number): Promise<Product> {
  return request(`${API_URL}/api/products/${id}`);
}

export function createOrder(items: CartItem[]): Promise<Order> {
  const body = {
    items: items.map((item) => ({ product_id: item.product.id, quantity: item.quantity })),
  };

  return request(`${API_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
