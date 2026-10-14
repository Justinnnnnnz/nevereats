"""Every catalog entity must have an actual, distinct local food photograph."""

import hashlib
import json
from pathlib import Path


def test_catalog_image_coverage():
    root = Path(__file__).resolve().parents[2]
    catalog = json.loads((root / "api/seed/restaurants.json").read_text())
    entities = [
        entity
        for restaurant in catalog
        for entity in [
            restaurant,
            *[item for section in restaurant["sections"] for item in section["items"]],
        ]
    ]
    assert len(entities) == 126
    paths = [entity["image_url"] for entity in entities]
    assert len(set(paths)) == len(entities)
    hashes = set()
    for url in paths:
        assert url.startswith("/images/catalog/") and url.endswith(".webp")
        data = (root / "web/public" / url.removeprefix("/")).read_bytes()
        assert data[:4] == b"RIFF" and data[8:12] == b"WEBP"
        assert len(data) > 1000
        hashes.add(hashlib.sha256(data).hexdigest())
    assert len(hashes) == len(entities), "Do not reuse photos across merchants/dishes"

    card_hashes = set()
    for restaurant in catalog:
        url = restaurant["image_url"].replace(".webp", "-card.webp")
        data = (root / "web/public" / url.removeprefix("/")).read_bytes()
        assert data[:4] == b"RIFF" and data[8:12] == b"WEBP"
        card_hashes.add(hashlib.sha256(data).hexdigest())
    assert len(card_hashes) == 18
