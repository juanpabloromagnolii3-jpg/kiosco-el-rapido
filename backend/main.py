from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models
from database import Base, SessionLocal, engine
from routers import orders, products

# Crea las tablas si no existen
Base.metadata.create_all(bind=engine)

INITIAL_PRODUCTS = [
    {"name": "Coca-Cola 500ml", "category": "bebidas", "price": 1200, "stock": 25, "description": "Gaseosa clásica", "image": "/images/coca-cola.svg"},
    {"name": "Agua mineral 500ml", "category": "bebidas", "price": 800, "stock": 40, "description": "Agua sin gas", "image": "/images/agua.svg"},
    {"name": "Papas Lays Clásicas", "category": "snacks", "price": 1500, "stock": 30, "description": "Papas fritas clásicas", "image": "/images/papas.svg"},
    {"name": "Alfajor Jorgito", "category": "golosinas", "price": 900, "stock": 50, "description": "Alfajor de chocolate", "image": "/images/alfajor.svg"},
    {"name": "Chicles Beldent", "category": "golosinas", "price": 600, "stock": 60, "description": "Pack de chicles", "image": "/images/chicles.svg"},
    {"name": "Cigarrillos", "category": "varios", "price": 2500, "stock": 20, "description": "Atado de cigarrillos", "image": "/images/cigarrillos.svg"},
    {"name": "Gatorade 500ml", "category": "bebidas", "price": 1800, "stock": 15, "description": "Bebida isotónica", "image": "/images/isotonica.svg"},
    {"name": "Maní salado", "category": "snacks", "price": 1100, "stock": 35, "description": "Maní tostado con sal", "image": "/images/mani.svg"},
    {"name": "Turrón de maní", "category": "golosinas", "price": 500, "stock": 40, "description": "Turrón de maní clásico de kiosco", "image": "/images/turron.svg"},
    {"name": "Yerba mate 500g", "category": "varios", "price": 3500, "stock": 12, "description": "Yerba mate con palo, para el mate de todos los días", "image": "/images/yerba.svg"},
]


def load_initial_products():
    """Si la tabla de productos está vacía, carga los productos iniciales."""
    db = SessionLocal()
    if db.query(models.Product).count() == 0:
        for data in INITIAL_PRODUCTS:
            db.add(models.Product(**data))
        db.commit()
    db.close()


load_initial_products()

app = FastAPI(title="API Kiosco El Rápido")

# CORS: permite que el frontend (Vite, puerto 5173) llame a esta API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(orders.router)


@app.get("/")
def root():
    return {"message": "API del Kiosco El Rápido. La documentación está en /docs"}
