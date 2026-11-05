# Mini-App – Kiosco El Rápido

Aplicación de un kiosco de barrio. El cliente puede ver el catálogo de productos, filtrarlos, ver el detalle de cada uno, agregar productos a un carrito y simular un pedido.

El proyecto se divide en dos partes. La primera es solo frontend (React + TypeScript). La segunda agrega el backend (FastAPI + SQLite + Pydantic).

---

## PARTE 1 – Frontend (React + TypeScript)

### Objetivo

Construir una SPA completa que use:

- `useState` y `useEffect`
- `useContext` (carrito de compras)
- React Router (`BrowserRouter`, `Routes`, `Route`, `Outlet`, `Link` / `NavLink`)
- Path params (`useParams`)
- Query params (`useSearchParams`)
- Layout compartido (Header + Footer) que se renderiza en todas las páginas mediante `<Outlet />`

### Stack

- Vite + React + TypeScript
- react-router-dom
- CSS simple (puede ser CSS Modules o un archivo global)

### Estructura de carpetas sugerida

```
src/
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Layout.tsx
│   ├── ProductCard.tsx
│   └── CartItem.tsx
├── context/
│   └── CartContext.tsx
├── pages/
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   └── NotFound.tsx
├── types/
│   └── index.ts
├── data/
│   └── products.ts          // datos mock
├── App.tsx
└── main.tsx
```

### Datos mock (Parte 1)

Crear un archivo `src/data/products.ts` con al menos 8-10 productos de ejemplo:

```ts
export interface Product {
  id: number;
  name: string;
  category: "bebidas" | "snacks" | "golosinas" | "varios";
  price: number;
  stock: number;
  description: string;
  image?: string; // opcional, puede ser un emoji o URL
}

export const products: Product[] = [
  { id: 1, name: "Coca-Cola 500ml", category: "bebidas", price: 1200, stock: 25, description: "Gaseosa clásica" },
  { id: 2, name: "Agua mineral 500ml", category: "bebidas", price: 800, stock: 40, description: "Agua sin gas" },
  { id: 3, name: "Papas Lays Clásicas", category: "snacks", price: 1500, stock: 30, description: "Papas fritas clásicas" },
  { id: 4, name: "Alfajor Jorgito", category: "golosinas", price: 900, stock: 50, description: "Alfajor de chocolate" },
  { id: 5, name: "Chicles Beldent", category: "golosinas", price: 600, stock: 60, description: "Pack de chicles" },
  { id: 6, name: "Cigarrillos", category: "varios", price: 2500, stock: 20, description: "Atado de cigarrillos" },
  { id: 7, name: "Gatorade 500ml", category: "bebidas", price: 1800, stock: 15, description: "Bebida isotónica" },
  { id: 8, name: "Maní salado", category: "snacks", price: 1100, stock: 35, description: "Maní tostado con sal" },
  // Agregar 1 o 2 productos más si se desea
];
```

### Requisitos funcionales

#### Layout global

Componente `Layout` que contenga:

- Header (logo, navegación y cantidad de ítems del carrito)
- `<Outlet />` (aquí se renderizan las páginas)
- Footer (texto simple: "Kiosco El Rápido – 2026")

El Layout debe aparecer en todas las rutas.

#### Rutas

| Ruta            | Página        | Descripción                            |
|-----------------|---------------|----------------------------------------|
| `/`             | Home          | Bienvenida + acceso rápido al catálogo |
| `/products`     | Products      | Lista de productos + filtros           |
| `/products/:id` | ProductDetail | Detalle de un producto                 |
| `/cart`         | Cart          | Carrito de compras                     |
| `*`             | NotFound      | Página 404                             |

#### Context del carrito (CartContext)

Debe exponer:

- `items`: array de `{ product: Product; quantity: number }`
- `addToCart(product, quantity)`
- `removeFromCart(productId)`
- `updateQuantity(productId, quantity)`
- `clearCart()`
- `totalItems` (cantidad total de unidades)
- `totalPrice` (suma de precios)

Usar `useContext` + `useState`. El Provider debe envolver toda la aplicación (dentro de `BrowserRouter`).

#### Página Products

- Mostrar todos los productos.
- Filtro por categoría usando query params: `/products?category=bebidas`, `/products?category=snacks`, etc.
- Botón o select para cambiar el filtro (actualizar searchParams).
- Cada producto debe tener un enlace a `/products/:id`.
- Botón "Agregar al carrito" (cantidad por defecto 1).

#### Página ProductDetail

- Usar `useParams` para obtener el id.
- Buscar el producto en los datos mock.
- Si no existe → mostrar mensaje de "Producto no encontrado".
- Mostrar nombre, categoría, precio, stock y descripción.
- Input de cantidad + botón "Agregar al carrito".
- Botón "Volver al catálogo".

#### Página Cart

- Listar los ítems del carrito.
- Permitir cambiar cantidad y eliminar ítems.
- Mostrar total.
- Botón "Vaciar carrito".
- Botón "Finalizar pedido":
  - Parte 1: solo simula el éxito (mostrar un mensaje en pantalla o alert y vaciar el carrito). No debe llamar a ninguna API.
  - Parte 2: debe enviar el pedido al backend y manejar la respuesta (éxito o error).

#### Header

- Logo / nombre del kiosco.
- Navegación con NavLink (Inicio, Productos, Carrito).
- Indicador de cantidad de ítems en el carrito (ej: "Carrito (3)").

#### Home

- Mensaje de bienvenida.
- Botón o enlace grande hacia `/products`.

### Nota importante sobre la progresión del pedido

En la Parte 1 el botón "Finalizar pedido" solo simula el éxito (mensaje + vaciar carrito).
En la Parte 2 ese mismo botón debe llamar al backend (`POST /api/orders`), mostrar el resultado al usuario y manejar los errores de forma visible.

### Criterios de aceptación (Parte 1)

- [ ] Layout (Header + Footer) se ve en todas las páginas.
- [ ] Rutas funcionan correctamente (incluyendo 404).
- [ ] Path param `:id` muestra el producto correcto.
- [ ] Query param `category` filtra los productos.
- [ ] El carrito funciona con Context (agregar, quitar, actualizar, total).
- [ ] El botón "Finalizar pedido" simula el éxito y vacía el carrito (sin llamar a API).
- [ ] No hay errores de TypeScript.
- [ ] La navegación no recarga la página (SPA).
