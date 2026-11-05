# Kiosco El Rápido – TP4 y TP5

Aplicación de un kiosco de barrio. Se puede ver el catálogo de productos, filtrarlos por categoría, ver el detalle de cada uno, agregarlos al carrito y hacer un pedido.

- **Parte 1 (TP4):** frontend con React + TypeScript y datos mock. Consigna en [`CONSIGNA_TP4.md`](./CONSIGNA_TP4.md). Está en el tag `tp4`.
- **Parte 2 (TP5):** backend con FastAPI + SQLite + Pydantic. El frontend ahora usa la API en lugar de los datos mock. Consigna en [`CONSIGNA_TP5.md`](./CONSIGNA_TP5.md). Está en el tag `tp5`.

## Tecnologías

- **Frontend:** Vite + React + TypeScript, react-router-dom, CSS global
- **Backend:** FastAPI, SQLAlchemy, SQLite, Pydantic, Uvicorn

## Cómo correr el proyecto

Hay que tener dos terminales abiertas: una para el backend y otra para el frontend.

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # en Windows
# source venv/bin/activate     # en Linux / Mac
pip install -r requirements.txt
uvicorn main:app --reload
```

La API queda en http://localhost:8000 y la documentación en http://localhost:8000/docs.

La primera vez que arranca se crea el archivo `kiosco.db` con los 10 productos iniciales.

### 2. Frontend

En otra terminal, desde la carpeta principal del proyecto:

```bash
npm install
npm run dev
```

Abrir http://localhost:5173.

El frontend busca la API en `http://localhost:8000`. Si el backend corre en otra dirección, crear un archivo `.env` en la carpeta principal con:

```
VITE_API_URL=http://localhost:8000
```

## Estructura de carpetas

```
backend/
├── main.py              # crea la app, configura CORS y carga los productos iniciales
├── database.py          # conexión a SQLite
├── models.py            # tablas products y orders (SQLAlchemy)
├── schemas.py           # validaciones con Pydantic
├── routers/
│   ├── products.py      # endpoints de productos
│   └── orders.py        # endpoints de pedidos
└── requirements.txt
public/
└── images/              # imágenes de los productos
src/
├── components/          # Header, Footer, Layout, ProductCard, CartItem
├── context/
│   └── CartContext.tsx  # carrito de compras (Context)
├── pages/               # Home, Products, ProductDetail, Cart, NotFound
├── services/
│   └── api.ts           # funciones que llaman a la API
├── types/
│   └── index.ts         # interfaces Product, CartItem y Order
├── App.tsx              # rutas
├── main.tsx
└── index.css
```

## Endpoints de la API

| Método | Ruta                 | Descripción                                                |
|--------|----------------------|------------------------------------------------------------|
| GET    | `/api/products`      | Lista los productos. Acepta `?category=` para filtrar      |
| GET    | `/api/products/{id}` | Detalle de un producto (404 si no existe)                  |
| POST   | `/api/products`      | Crea un producto (sirve para probar las validaciones)      |
| POST   | `/api/orders`        | Crea un pedido, verifica el stock y lo descuenta           |
| GET    | `/api/orders`        | Lista los pedidos                                          |

Ejemplo de pedido:

```json
{
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 5, "quantity": 1 }
  ]
}
```

## Validaciones (Pydantic)

- El nombre del producto no puede estar vacío.
- El precio tiene que ser mayor a 0.
- El stock no puede ser negativo.
- La categoría tiene que ser bebidas, snacks, golosinas o varios.
- En un pedido la cantidad tiene que ser mayor a 0 y tiene que haber al menos un producto.
- Al crear un pedido se verifica que haya stock suficiente. Si algún producto no tiene stock, el pedido no se guarda y no se descuenta nada.

## Rutas del frontend

| Ruta            | Página        |
|-----------------|---------------|
| `/`             | Home          |
| `/products`     | Products      |
| `/products/:id` | ProductDetail |
| `/cart`         | Cart          |
| `*`             | NotFound      |

## Dónde se usa cada concepto

- **useState**: en `CartContext.tsx` para los productos del carrito; en `Products.tsx` y `ProductDetail.tsx` para los datos, el estado de carga y el error; en `Cart.tsx` para el estado del pedido.
- **useEffect**:
  - en `Products.tsx`, pide los productos al backend cada vez que cambia la categoría;
  - en `ProductDetail.tsx`, pide el producto al backend cada vez que cambia el `id`;
  - en `CartContext.tsx`, guarda el carrito en `localStorage` cada vez que cambia.
- **useContext**: en `CartContext.tsx` se crea el contexto del carrito y el hook `useCart()`.
- **BrowserRouter**: en `main.tsx`, envuelve toda la app junto con el `CartProvider`.
- **Routes y Route**: en `App.tsx`. Hay una ruta padre con el `Layout` y adentro las rutas hijas.
- **Outlet**: en `Layout.tsx`, ahí se muestra la página actual entre el Header y el Footer.
- **Link y NavLink**: `NavLink` en el Header (marca la página activa) y `Link` en el resto.
- **useParams**: en `ProductDetail.tsx`, para leer el `id` de la URL.
- **useSearchParams**: en `Products.tsx`, para leer y cambiar el filtro `?category=`. Ese valor se manda al backend.

## Manejo de carga y errores

- Mientras se cargan los productos aparece "Cargando productos...".
- Mientras se envía el pedido el botón dice "Enviando pedido..." y queda deshabilitado.
- Si el backend está apagado se muestra "No se pudo conectar con el servidor...".
- Si la API responde con error (producto inexistente, stock insuficiente, etc.) se muestra el mensaje que manda el backend.
