export interface Product {
  id: number;
  name: string;
  category: "bebidas" | "snacks" | "golosinas" | "varios";
  price: number;
  stock: number;
  description: string;
  image?: string; // opcional, puede ser un emoji o URL
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Pedido que devuelve el backend al hacer POST /api/orders
export interface Order {
  id: number;
  created_at: string;
  total: number;
  items: {
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
}
