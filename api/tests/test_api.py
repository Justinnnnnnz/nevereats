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
    assert len(restaurants) == 18
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
