from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

Category = Literal["bebidas", "snacks", "golosinas", "varios"]


# ---------- Productos ----------

class ProductCreate(BaseModel):
    name: str
    category: Category
    price: float = Field(gt=0)  # el precio tiene que ser mayor a 0
    stock: int = Field(ge=0)  # el stock no puede ser negativo
    description: Optional[str] = None
    image: Optional[str] = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, value: str) -> str:
        if value.strip() == "":
            raise ValueError("El nombre no puede estar vacío")
        return value.strip()


class ProductOut(BaseModel):
    id: int
    name: str
    category: str
    price: float
    stock: int
    description: Optional[str] = None
    image: Optional[str] = None

    # Permite crear este schema a partir de un modelo de SQLAlchemy
    model_config = ConfigDict(from_attributes=True)


# ---------- Pedidos ----------

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)  # la cantidad tiene que ser mayor a 0


class OrderCreate(BaseModel):
    items: list[OrderItemCreate] = Field(min_length=1)  # al menos un producto


class OrderItemOut(BaseModel):
    product_id: int
    name: str
    price: float
    quantity: int
    subtotal: float


class OrderOut(BaseModel):
    id: int
    created_at: datetime
    total: float
    items: list[OrderItemOut]
