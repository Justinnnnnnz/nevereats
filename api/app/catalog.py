from sqlmodel import Session, select

from app.models import MenuItem, MenuSection, Option, OptionGroup, Restaurant


def item_detail(s: Session, item: MenuItem) -> dict:
    data = item.model_dump()
    data["option_groups"] = []
    for group in s.exec(
        select(OptionGroup).where(OptionGroup.menu_item_id == item.id)
    ).all():
        data["option_groups"].append(
            {
                **group.model_dump(),
                "options": [
                    o.model_dump()
                    for o in s.exec(
                        select(Option).where(Option.option_group_id == group.id)
                    ).all()
                ],
            }
        )
    return data


def restaurant_detail(s: Session, restaurant: Restaurant) -> dict:
    return {
        **restaurant.model_dump(),
        "sections": [
            {
                **section.model_dump(),
                "items": [
                    item_detail(s, item)
                    for item in s.exec(
                        select(MenuItem)
                        .where(MenuItem.section_id == section.id)
                        .order_by(MenuItem.id)
                    ).all()
                ],
            }
            for section in s.exec(
                select(MenuSection)
                .where(MenuSection.restaurant_id == restaurant.id)
                .order_by(MenuSection.sort_order)
            ).all()
        ],
    }
