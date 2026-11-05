from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db

router = APIRouter(prefix="/api/products", tags=["Productos"])

CATEGORIES = ["bebidas", "snacks", "golosinas", "varios"]


@router.get("", response_model=list[schemas.ProductOut])
def get_products(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Product)

    # Filtro opcional por categoría: /api/products?category=bebidas
    if category:
        if category not in CATEGORIES:
            raise HTTPException(status_code=400, detail=f"La categoría '{category}' no existe")
        query = query.filter(models.Product.category == category)

    return query.all()


@router.get("/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product


@router.post("", response_model=schemas.ProductOut, status_code=201)
def create_product(data: schemas.ProductCreate, db: Session = Depends(get_db)):
    product = models.Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product
