import json
from pathlib import Path

from sqlmodel import Session

from app.db import engine
from app.models import MenuItem, MenuSection, Option, OptionGroup, Restaurant


def seed(s: Session):
    rows = json.loads((Path(__file__).parents[1] / "seed/restaurants.json").read_text())
    for data in rows:
        r = Restaurant.model_validate(data)
        s.merge(r)
        s.flush()
        for section in data["sections"]:
            s.merge(
                MenuSection(
                    restaurant_id=r.id,
                    **{k: v for k, v in section.items() if k != "items"},
                )
            )
            s.flush()
            for item in section["items"]:
                s.merge(
                    MenuItem(
                        restaurant_id=r.id,
                        section_id=section["id"],
                        **{k: v for k, v in item.items() if k != "option_groups"},
                    )
                )
                s.flush()
                for group in item["option_groups"]:
                    s.merge(
                        OptionGroup(
                            menu_item_id=item["id"],
                            **{k: v for k, v in group.items() if k != "options"},
                        )
                    )
                    s.flush()
                    for option in group["options"]:
                        s.merge(Option(option_group_id=group["id"], **option))
    s.commit()


if __name__ == "__main__":
    rows = json.loads((Path(__file__).parents[1] / "seed/restaurants.json").read_text())
    with Session(engine) as session:
        seed(session)
    print(
        f"Seeded {len(rows)} restaurants "
        f"({len(rows) - 2} fictional, 2 simulated brand stores)"
    )
