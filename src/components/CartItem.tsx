import { useCart } from "../context/CartContext";
import type { CartItem as CartItemType } from "../types";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  return (
    <div className="cart-item">
      <img src={product.image} alt={product.name} className="cart-item-image" />
      <div className="cart-item-info">
        <h3>{product.name}</h3>
        <p>${product.price.toLocaleString("es-AR")} c/u</p>
      </div>
      <div className="quantity">
        <button onClick={() => updateQuantity(product.id, quantity - 1)}>-</button>
        <span>{quantity}</span>
        <button onClick={() => updateQuantity(product.id, quantity + 1)}>+</button>
      </div>
      <p className="subtotal">${(product.price * quantity).toLocaleString("es-AR")}</p>
      <button className="button-delete" onClick={() => removeFromCart(product.id)}>
        Eliminar
      </button>
    </div>
  );
}
