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
