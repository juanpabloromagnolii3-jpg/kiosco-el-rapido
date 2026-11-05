# Kiosco El Rápido – TP4 (Parte 1: Frontend)

Aplicación de un kiosco de barrio hecha con **React + TypeScript + Vite**. Se puede ver el catálogo de productos, filtrarlos por categoría, ver el detalle de cada uno, agregarlos al carrito y simular un pedido.

Esta es la **Parte 1** (solo frontend). Los productos son datos mock y el botón "Finalizar pedido" solo simula el éxito, no llama a ninguna API. La consigna está en [`CONSIGNA_TP4.md`](./CONSIGNA_TP4.md).

## Tecnologías

- Vite + React + TypeScript
- react-router-dom
- CSS global (`src/index.css`)

## Cómo instalar y correr

```bash
npm install
npm run dev
```

Después abrir en el navegador la dirección que aparece en la terminal (normalmente http://localhost:5173).

## Estructura de carpetas

```
public/
└── images/              # imágenes de los productos
src/
├── components/
│   ├── Header.tsx       # nombre del kiosco, navegación y "Carrito (N)"
│   ├── Footer.tsx
│   ├── Layout.tsx       # Header + <Outlet /> + Footer
│   ├── ProductCard.tsx  # tarjeta de cada producto
│   └── CartItem.tsx     # cada producto dentro del carrito
├── context/
│   └── CartContext.tsx  # carrito de compras (Context)
├── pages/
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   └── NotFound.tsx
├── types/
│   └── index.ts         # interfaces Product y CartItem
├── data/
│   └── products.ts      # 10 productos mock
├── App.tsx              # rutas
├── main.tsx
└── index.css
```

## Rutas

| Ruta            | Página        |
|-----------------|---------------|
| `/`             | Home          |
| `/products`     | Products      |
| `/products/:id` | ProductDetail |
| `/cart`         | Cart          |
| `*`             | NotFound      |

## Dónde se usa cada concepto

- **useState**: en `CartContext.tsx` para guardar los productos del carrito, en `ProductDetail.tsx` para la cantidad y el mensaje, y en `Cart.tsx` para el mensaje del pedido.
- **useEffect**: en `CartContext.tsx`, guarda el carrito en `localStorage` cada vez que cambia, para que no se pierda al recargar la página.
- **useContext**: en `CartContext.tsx` se crea el contexto del carrito y el hook `useCart()`, que se usa en `Header`, `ProductCard`, `CartItem`, `ProductDetail` y `Cart`.
- **BrowserRouter**: en `main.tsx`, envuelve toda la app junto con el `CartProvider`.
- **Routes y Route**: en `App.tsx`. Hay una ruta padre con el `Layout` y adentro las rutas hijas.
- **Outlet**: en `Layout.tsx`, ahí se muestra la página actual entre el Header y el Footer. Así el Layout aparece en todas las páginas (incluida la 404).
- **Link y NavLink**: `NavLink` en el Header (marca la página activa) y `Link` en el resto. Así la página no se recarga al navegar.
- **useParams**: en `ProductDetail.tsx`, para leer el `id` de la URL `/products/:id` y buscar el producto.
- **useSearchParams**: en `Products.tsx`, para leer y cambiar el filtro `?category=` de la URL.
