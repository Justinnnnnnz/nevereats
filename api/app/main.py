import random
import time
from collections import Counter, defaultdict, deque
from datetime import datetime, timezone
from typing import Annotated
from uuid import UUID
from zoneinfo import ZoneInfo

from fastapi import Depends, FastAPI, Header, HTTPException, Query, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlmodel import Session, select
from starlette.middleware.gzip import GZipMiddleware

from app.catalog import item_detail, restaurant_detail
from app.config import settings
from app.db import session
from app.domain import current_status, fees, timeline, validate_options
from app.models import MenuItem, Order, OrderItem, Restaurant
from app.schemas import OrderInput

app = FastAPI(title="NeverEats API", version="0.2.0")
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.web_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "X-Guest-Id"],
)
DB = Annotated[Session, Depends(session)]


def guest(x_guest_id: Annotated[str | None, Header()] = None) -> UUID:
    try:
        return UUID(x_guest_id or "")
    except ValueError:
        raise HTTPException(400, "无效的访客标识") from None


Guest = Annotated[UUID, Depends(guest)]
requests_by_guest: dict[UUID, deque] = defaultdict(deque)


@app.exception_handler(HTTPException)
async def http_error(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": f"HTTP_{exc.status_code}", "message": exc.detail}},
    )


@app.exception_handler(RequestValidationError)
async def validation_error(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"error": {"code": "INVALID_REQUEST", "message": "请求字段不符合要求"}},
    )


@app.exception_handler(Exception)
async def server_error(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": {"code": "SERVER_ERROR", "message": "服务暂时不可用，请稍后重试"}
        },
    )


@app.get("/v1/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/v1/restaurants")
def restaurants(s: DB, g: Guest, category: str | None = None, q: str = ""):
    rows = s.exec(select(Restaurant).order_by(Restaurant.sort_order)).all()
    result = []
    for r in rows:
        data = restaurant_detail(s, r)
        haystack = (
            r.name_zh
            + r.name_en
            + " ".join(
                i["name_zh"] + i["name_en"]
                for section in data["sections"]
                for i in section["items"]
            )
        )
        if (not category or r.category == category) and q.lower() in haystack.lower():
            result.append(data)
    return result


@app.get("/v1/restaurants/{restaurant_id}")
def restaurant(restaurant_id: str, s: DB, g: Guest):
    r = s.get(Restaurant, restaurant_id)
    if not r:
        raise HTTPException(404, "餐厅不存在")
    return restaurant_detail(s, r)


def order_detail(s: Session, order: Order) -> dict:
    return {
        **order.model_dump(),
        "status": current_status(order.placed_at, order.timeline),
        "restaurant": s.get(Restaurant, order.restaurant_id).model_dump(),
        "items": [
            i.model_dump()
            for i in s.exec(
                select(OrderItem).where(OrderItem.order_id == order.id)
            ).all()
        ],
    }


@app.post("/v1/orders", status_code=201)
def create_order(body: OrderInput, s: DB, g: Guest):
    now = time.monotonic()
    recent = requests_by_guest[g]
    while recent and recent[0] < now - 60:
        recent.popleft()
    if len(recent) >= 30:
        raise HTTPException(429, "请稍后再试")
    recent.append(now)
    r = s.get(Restaurant, body.restaurant_id)
    if not r:
        raise HTTPException(404, "餐厅不存在")
    subtotal = 0
    snapshots = []
    for entry in body.items:
        item = s.get(MenuItem, entry.menu_item_id)
        if not item or item.restaurant_id != r.id:
            raise HTTPException(422, "菜品不属于餐厅")
        try:
            options = validate_options(
                item_detail(s, item)["option_groups"], entry.option_ids
            )
        except ValueError as exc:
            raise HTTPException(422, str(exc)) from None
        unit = item.price_cents + sum(o["price_delta_cents"] for o in options)
        subtotal += unit * entry.quantity
        snapshots.append(
            dict(
                menu_item_id=item.id,
                name_zh_snapshot=item.name_zh,
                quantity=entry.quantity,
                unit_price_cents=unit,
                selected_options=options,
            )
        )
    totals = fees(
        subtotal,
        r.delivery_fee_cents,
        body.express,
        body.tip_mode,
        body.tip_custom_cents,
        settings.hst_percent,
    )
    if totals["total_cents"] != body.client_total_cents:
        raise HTTPException(409, "价格已变化，请重新确认总额")
    order = Order(
        guest_id=g,
        restaurant_id=r.id,
        express=body.express,
        **totals,
        courier_id=f"courier-{random.randrange(10)}",
        placed_at=datetime.now(timezone.utc),
        timeline=timeline(body.express),
    )
    s.add(order)
    s.flush()
    for snapshot in snapshots:
        s.add(OrderItem(order_id=order.id, **snapshot))
    s.commit()
    s.refresh(order)
    return order_detail(s, order)


@app.get("/v1/orders/{order_id}")
def get_order(order_id: UUID, s: DB, g: Guest):
    order = s.get(Order, order_id)
    if not order or order.guest_id != g:
        raise HTTPException(404, "订单不存在")
    return order_detail(s, order)


@app.get("/v1/orders")
def orders(
    s: DB, g: Guest, offset: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100)
):
    rows = s.exec(
        select(Order)
        .where(Order.guest_id == g)
        .order_by(Order.placed_at.desc())
        .offset(offset)
        .limit(limit)
    ).all()
    return [order_detail(s, o) for o in rows]


@app.get("/v1/stats")
def stats(s: DB, g: Guest):
    rows = s.exec(select(Order).where(Order.guest_id == g)).all()
    favorite = Counter(o.restaurant_id for o in rows).most_common(1)
    hours = Counter(
        int(o.placed_at.astimezone(ZoneInfo("America/Toronto")).hour) for o in rows
    ).most_common(1)
    return {
        "saved_cents": sum(o.total_cents for o in rows),
        "order_count": len(rows),
        "favorite_restaurant": s.get(Restaurant, favorite[0][0]).name_zh
        if favorite
        else None,
        "top_hour": hours[0][0] if hours else None,
    }
