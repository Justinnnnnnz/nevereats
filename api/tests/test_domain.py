import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest

from app.domain import current_status, fees, timeline, validate_options


@pytest.mark.parametrize(
    "case",
    json.loads((Path(__file__).parents[2] / "shared/fee-cases.json").read_text()),
)
def test_shared_fees(case):
    assert (
        fees(
            case["subtotal"],
            case["delivery"],
            case["express"],
            case["tip_mode"],
            case["custom"],
        )
        == case["expected"]
    )


@pytest.mark.parametrize("express", [False, True])
def test_timeline_boundaries(express):
    placed = datetime(2026, 1, 1, tzinfo=timezone.utc)
    stages = timeline(express)
    for index, stage in enumerate(stages):
        assert (
            current_status(
                placed, stages, placed + timedelta(seconds=stage["offset_seconds"])
            )
            == stage["status"]
        )
        if index:
            assert (
                current_status(
                    placed,
                    stages,
                    placed + timedelta(seconds=stage["offset_seconds"] - 0.01),
                )
                == stages[index - 1]["status"]
            )


def test_option_validation():
    groups = [{"min_select": 1, "max_select": 1, "options": [{"id": "a"}, {"id": "b"}]}]
    assert validate_options(groups, ["a"]) == [{"id": "a"}]
    for ids in [[], ["a", "b"], ["a", "a"], ["other"]]:
        with pytest.raises(ValueError):
            validate_options(groups, ids)


def test_half_off_has_a_twenty_dollar_minimum_and_fifteen_dollar_cap():
    below_minimum = fees(1999, 399, False, "0", promotion_kind="half_off")
    eligible = fees(5000, 399, False, "0", promotion_kind="half_off")
    assert below_minimum["discount_cents"] == 0
    assert eligible["discount_cents"] == 1500


def test_free_delivery_zeros_delivery_and_recalculates_tax():
    result = fees(5000, 399, False, "0", promotion_kind="free_delivery")
    assert result["delivery_fee_cents"] == 0
    assert result["discount_cents"] == 399


def test_membership_benefits_apply_before_half_off_promotion():
    result = fees(5000, 399, False, "0", promotion_kind="half_off", member=True)
    assert result["delivery_fee_cents"] == 0
    assert result["service_fee_cents"] == 350
    assert result["discount_cents"] == 1500
    assert result["total_cents"] == 4351
