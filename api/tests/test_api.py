from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

from app.db import engine, session
from app.domain import fees
from app.main import app


@pytest.fixture
def client():
    with engine.connect() as connection:
        transaction = connection.begin()
        with Session(bind=connection, join_transaction_mode="create_savepoint") as s:
            app.dependency_overrides[session] = lambda: s
            with TestClient(app) as client:
                yield client
            app.dependency_overrides.clear()
        transaction.rollback()


def test_order_privacy_and_validation(client):
    headers = {"X-Guest-Id": str(uuid4())}
    restaurants = client.get("/v1/restaurants", headers=headers).json()
    assert len(restaurants) == 20
    images = [
        entity["image_url"]
        for restaurant in restaurants
        for entity in [
            restaurant,
            *[item for section in restaurant["sections"] for item in section["items"]],
        ]
    ]
    assert len(images) == len(set(images)) == 140
    assert all(url.startswith("/images/catalog/") for url in images)
    for query in ("chickfila", "mcdonalds"):
        assert (
            len(
                client.get(
                    "/v1/restaurants", headers=headers, params={"q": query}
                ).json()
            )
            == 1
        )
    r = restaurants[0]
    item = r["sections"][0]["items"][0]
    options = [g["options"][0]["id"] for g in item["option_groups"] if g["min_select"]]
    total = fees(item["price_cents"], r["delivery_fee_cents"], False, "18")[
        "total_cents"
    ]
    body = dict(
        restaurant_id=r["id"],
        items=[dict(menu_item_id=item["id"], quantity=1, option_ids=options)],
        client_total_cents=total,
    )
    assert (
        client.post(
            "/v1/orders", json={**body, "address": "private"}, headers=headers
        ).status_code
        == 422
    )
    assert (
        client.post(
            "/v1/orders", json={**body, "client_total_cents": 1}, headers=headers
        ).status_code
        == 409
    )
    assert (
        client.post(
            "/v1/orders",
            json={**body, "items": [{**body["items"][0], "option_ids": []}]},
            headers=headers,
        ).status_code
        == 422
    )
    response = client.post("/v1/orders", json=body, headers=headers)
    assert response.status_code == 201, response.text
    order = response.json()
    assert order["status"] == "placed"
    assert (
        client.get(
            "/v1/orders/" + order["id"], headers={"X-Guest-Id": str(uuid4())}
        ).status_code
        == 404
    )
    assert client.get("/v1/orders/" + order["id"], headers=headers).status_code == 200
    assert client.get("/v1/stats", headers=headers).json()["saved_cents"] == total
    assert len(client.get("/v1/orders", headers=headers).json()) == 1
    assert (
        client.get("/v1/restaurants", headers={"X-Guest-Id": "bad"}).status_code == 400
    )
    assert client.get(
        "/v1/restaurants", headers=headers, params={"q": item["name_en"]}
    ).json()
    for _ in range(30):
        client.post(
            "/v1/orders", json={**body, "client_total_cents": 1}, headers=headers
        )
    assert client.post("/v1/orders", json=body, headers=headers).status_code == 429


def test_guest_promotions_claim_apply_and_disappear_after_order(client):
    headers = {"X-Guest-Id": str(uuid4())}
    rows = client.get("/v1/promotions", headers=headers).json()
    assert {row["kind"] for row in rows} == {"half_off", "free_delivery"}
    assert (
        client.post(
            "/v1/promotions/claim", json={"code": "NOPE"}, headers=headers
        ).status_code
        == 422
    )
    claimed = client.post(
        "/v1/promotions/claim", json={"code": "NEVEREATS50"}, headers=headers
    )
    assert claimed.status_code == 200 and claimed.json()["kind"] == "half_off"
    assert (
        client.post(
            "/v1/promotions/claim", json={"code": "NEVEREATS50"}, headers=headers
        ).status_code
        == 409
    )

    restaurant = client.get("/v1/restaurants", headers=headers).json()[0]
    item = restaurant["sections"][0]["items"][0]
    option_ids = [
        group["options"][0]["id"]
        for group in item["option_groups"]
        if group["min_select"]
    ]
    option_prices = {
        option["id"]: option["price_delta_cents"]
        for group in item["option_groups"]
        for option in group["options"]
    }
    unit = item["price_cents"] + sum(
        option_prices[option_id] for option_id in option_ids
    )
    quantity = max(1, (2000 + unit - 1) // unit)
    subtotal = unit * quantity
    expected = fees(
        subtotal,
        restaurant["delivery_fee_cents"],
        False,
        "18",
        promotion_kind="half_off",
    )
    body = {
        "restaurant_id": restaurant["id"],
        "items": [
            {"menu_item_id": item["id"], "quantity": quantity, "option_ids": option_ids}
        ],
        "tip_mode": "18",
        "promotion_id": claimed.json()["id"],
        "client_total_cents": expected["total_cents"],
    }
    order = client.post("/v1/orders", json=body, headers=headers)
    assert order.status_code == 201, order.text
    assert order.json()["discount_cents"] == expected["discount_cents"]
    assert order.json()["total_cents"] == expected["total_cents"]
    assert claimed.json()["id"] not in {
        row["id"] for row in client.get("/v1/promotions", headers=headers).json()
    }
    assert client.post("/v1/orders", json=body, headers=headers).status_code == 409
