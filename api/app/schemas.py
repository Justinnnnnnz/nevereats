from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ItemInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    menu_item_id: str
    quantity: int = Field(ge=1, le=99)
    option_ids: list[str] = Field(default_factory=list, max_length=30)


class OrderInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    restaurant_id: str
    items: list[ItemInput] = Field(min_length=1, max_length=99)
    tip_mode: Literal["0", "15", "18", "20", "25", "custom"] = "18"
    tip_custom_cents: int = Field(default=0, ge=0, le=100000)
    express: bool = False
    client_total_cents: int = Field(ge=0)
    promotion_id: UUID | None = None


class PromotionCodeInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    code: str = Field(min_length=1, max_length=40)
