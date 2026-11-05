# PARTE 2 – Backend (FastAPI + SQLite + Pydantic)

## Objetivo

Reemplazar los datos mock por una API real. El frontend debe consumir los endpoints mediante fetch (o axios).

## Stack backend

- FastAPI
- SQLite (con SQLAlchemy o sqlite3 + Pydantic)
- Pydantic para validación
- CORS habilitado

## Modelo de datos

Tabla `products`:

| Campo       | Tipo    | Notas                                 |
|-------------|---------|---------------------------------------|
| id          | Integer | Primary key, autoincrement            |
| name        | String  | obligatorio                           |
| category    | String  | bebidas / snacks / golosinas / varios |
| price       | Float   | > 0                                   |
| stock       | Integer | >= 0                                  |
| description | String  | opcional                              |

Tabla `orders` (opcional pero recomendada):

| Campo      | Tipo     | Notas                            |
|------------|----------|----------------------------------|
| id         | Integer  | Primary key                      |
| created_at | DateTime | automático                       |
| total      | Float    |                                  |
| items_json | Text     | JSON con los productos del pedido |

## Endpoints mínimos

| Método | Ruta                 | Descripción                                               |
|--------|----------------------|-----------------------------------------------------------|
| GET    | /api/products        | Lista todos los productos. Acepta query param ?category= |
| GET    | /api/products/{id}   | Detalle de un producto                                    |
| POST   | /api/orders          | Crea un pedido (recibe lista de ítems)                    |
| GET    | /api/orders          | Lista los pedidos (opcional)                              |

Ejemplo de body para crear pedido:

```json
{
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 5, "quantity": 1 }
  ]
}
```

## Validaciones con Pydantic

- name no puede estar vacío.
- price debe ser mayor a 0.
- stock no puede ser negativo.
- Al crear un pedido: verificar que haya stock suficiente y descontar el stock.

## Cambios en el frontend (Parte 2)

- Eliminar (o comentar) los datos mock.
- Crear un pequeño servicio / hooks para llamar a la API:
  - `getProducts(category?: string)`
  - `getProductById(id: number)`
  - `createOrder(items)`
- En Products y ProductDetail usar useEffect + useState para cargar los datos desde la API.
- Manejo obligatorio de estados de carga y error (visible en pantalla):
  - Estado loading: mostrar un mensaje o spinner mientras se obtienen los datos ("Cargando productos...").
  - Estado error: si falla la petición de red (servidor caído, CORS, timeout, etc.) o la API responde con error, mostrar un mensaje claro y visible al usuario (ej: "No se pudieron cargar los productos. Intentá de nuevo.").
  - No alcanza con hacer console.log del error: el usuario debe ver el problema en la interfaz.
- Al "Finalizar pedido" en el carrito:
  - Enviar el pedido al backend (POST /api/orders).
  - Mientras se envía: mostrar estado de carga en el botón o en la página.
  - Si es exitoso → vaciar carrito y mostrar mensaje de confirmación visible.
  - Si falla (stock insuficiente, error de red, validación del backend, etc.) → mostrar el error de forma visible en pantalla (no solo en consola).

## Estructura backend sugerida

```
backend/
├── main.py
├── database.py
├── models.py          # SQLAlchemy o dataclasses
├── schemas.py         # Pydantic
├── routers/
│   ├── products.py
│   └── orders.py
└── requirements.txt
```

## Criterios de aceptación (Parte 2)

- [ ] La API arranca sin errores y tiene documentación en /docs.
- [ ] Los productos se obtienen desde la base de datos.
- [ ] El filtro por categoría funciona desde el backend.
- [ ] Se puede crear un pedido y se descuenta el stock.
- [ ] El frontend muestra estado de loading de forma visible mientras carga datos o envía el pedido.
- [ ] El frontend muestra errores de red y errores de la API de forma visible en pantalla (no solo en la consola).
- [ ] El botón "Finalizar pedido" llama al backend y reacciona correctamente ante éxito y fracaso.
- [ ] CORS está configurado correctamente.
- [ ] Validaciones de Pydantic rechazan datos inválidos.

## Entrega

- Carpeta backend/ con el código de FastAPI.
- README actualizado con:
  - Cómo instalar dependencias (`pip install -r requirements.txt`)
  - Cómo correr el backend (`uvicorn main:app --reload`)
  - Cómo correr el frontend apuntando a la API.
