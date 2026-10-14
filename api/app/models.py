from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import Column, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, SQLModel


class Restaurant(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name_zh: str
    name_en: str
    cuisine: str
    category: str
    neighborhood: str
    image_url: str = ""
    rating: float
    eta_min: int
    eta_max: int
    delivery_fee_cents: int
    late_night: bool
    sort_order: int


class MenuSection(SQLModel, table=True):
    id: str = Field(primary_key=True)
    restaurant_id: str = Field(foreign_key="restaurant.id", index=True)
    name_zh: str
    sort_order: int


class MenuItem(SQLModel, table=True):
    id: str = Field(primary_key=True)
    restaurant_id: str = Field(foreign_key="restaurant.id", index=True)
    section_id: str = Field(foreign_key="menusection.id")
    name_zh: str
    name_en: str
    description_zh: str
    price_cents: int
    cny_reference_price: int | None = None
    image_url: str = ""
    popular: bool = False


class OptionGroup(SQLModel, table=True):
    id: str = Field(primary_key=True)
    menu_item_id: str = Field(foreign_key="menuitem.id", index=True)
    name_zh: str
    min_select: int
    max_select: int


class Option(SQLModel, table=True):
    id: str = Field(primary_key=True)
    option_group_id: str = Field(foreign_key="optiongroup.id", index=True)
    name_zh: str
    price_delta_cents: int


class Order(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    guest_id: UUID = Field(index=True)
    restaurant_id: str = Field(foreign_key="restaurant.id")
    express: bool
    subtotal_cents: int
    delivery_fee_cents: int
    service_fee_cents: int
    small_order_fee_cents: int
    express_fee_cents: int
    tax_cents: int
    tip_cents: int
    total_cents: int
    courier_id: str
    placed_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )
    timeline: list[dict] = Field(sa_column=Column(JSONB, nullable=False))


class OrderItem(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    order_id: UUID = Field(foreign_key="order.id", index=True)
    menu_item_id: str = Field(foreign_key="menuitem.id")
    name_zh_snapshot: str
    quantity: int
    unit_price_cents: int
    selected_options: list[dict] = Field(sa_column=Column(JSONB, nullable=False))
