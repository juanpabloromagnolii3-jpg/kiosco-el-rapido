import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db

router = APIRouter(prefix="/api/orders", tags=["Pedidos"])


def order_to_schema(order: models.Order) -> schemas.OrderOut:
    """Convierte un pedido de la base de datos al formato de respuesta."""
    return schemas.OrderOut(
        id=order.id,
        created_at=order.created_at,
        total=order.total,
        items=json.loads(order.items_json),
    )


@router.post("", response_model=schemas.OrderOut, status_code=201)
def create_order(data: schemas.OrderCreate, db: Session = Depends(get_db)):
    total = 0
    items = []

    for item in data.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()

        if product is None:
            raise HTTPException(
                status_code=404, detail=f"El producto con id {item.product_id} no existe"
            )

        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Stock insuficiente para {product.name} (disponible: {product.stock})",
            )

        # Se descuenta el stock. Si algún producto falla, no se hace commit
        # y ningún cambio se guarda en la base de datos.
        product.stock -= item.quantity

        subtotal = product.price * item.quantity
        total += subtotal
        items.append(
            {
                "product_id": product.id,
                "name": product.name,
                "price": product.price,
                "quantity": item.quantity,
                "subtotal": subtotal,
            }
        )

    order = models.Order(total=total, items_json=json.dumps(items, ensure_ascii=False))
    db.add(order)
    db.commit()
    db.refresh(order)
    return order_to_schema(order)


@router.get("", response_model=list[schemas.OrderOut])
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(models.Order).order_by(models.Order.id.desc()).all()
    return [order_to_schema(order) for order in orders]
