from datetime import datetime, timezone

STATUSES = [
    ("placed", 0),
    ("restaurant_accepted", 20),
    ("preparing", 40),
    ("courier_assigned", 150),
    ("picked_up", 270),
    ("en_route", 300),
    ("arriving", 540),
    ("delivered", 600),
]


def percent(cents: int, rate: int) -> int:
    return (cents * rate + 50) // 100


def fees(
    subtotal: int,
    delivery: int,
    express: bool,
    tip_mode: str,
    custom: int = 0,
    tax_rate: int = 13,
) -> dict[str, int]:
    service = min(700, max(200, percent(subtotal, 15)))
    small = 250 if subtotal < 1500 else 0
    rush = 299 if express else 0
    tax = percent(subtotal + delivery + service + small + rush, tax_rate)
    tip = custom if tip_mode == "custom" else percent(subtotal, int(tip_mode))
    return dict(
        subtotal_cents=subtotal,
        delivery_fee_cents=delivery,
        service_fee_cents=service,
        small_order_fee_cents=small,
        express_fee_cents=rush,
        tax_cents=tax,
        tip_cents=tip,
        total_cents=subtotal + delivery + service + small + rush + tax + tip,
    )


def timeline(express: bool) -> list[dict]:
    return [
        {"status": s, "offset_seconds": round(t * (0.6 if express else 1))}
        for s, t in STATUSES
    ]


def current_status(
    placed_at: datetime, stages: list[dict], now: datetime | None = None
) -> str:
    if placed_at.tzinfo is None:
        placed_at = placed_at.replace(tzinfo=timezone.utc)
    elapsed = ((now or datetime.now(timezone.utc)) - placed_at).total_seconds()
    return next(
        (s["status"] for s in reversed(stages) if s["offset_seconds"] <= elapsed),
        "placed",
    )


def validate_options(groups: list[dict], ids: list[str]) -> list[dict]:
    if len(ids) != len(set(ids)):
        raise ValueError("不能重复选择选项")
    valid = {o["id"]: o for g in groups for o in g["options"]}
    if not set(ids).issubset(valid):
        raise ValueError("选项不属于该菜品")
    for group in groups:
        count = sum(o["id"] in ids for o in group["options"])
        if not group["min_select"] <= count <= group["max_select"]:
            raise ValueError("选项数量不符合要求")
    return [valid[i] for i in ids]
