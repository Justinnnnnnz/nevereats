"""Generate fictional catalog with individual local food assets."""

import json
from pathlib import Path

entries = [
    (
        "spadina-cloud",
        "Spadina 云朵麻辣烫",
        "Cloud Malatang",
        "中餐",
        "Spadina",
        [
            "麻辣烫 Malatang",
            "番茄烫 Tomato soup",
            "菌菇烫 Mushroom soup",
            "牛肉烫 Beef bowl",
            "酸辣粉 Sour noodles",
            "芝麻酱拌菜 Sesame bowl",
        ],
    ),
    (
        "north-snail",
        "北岸螺蛳粉小屋",
        "Northern Snail Noodles",
        "中餐",
        "North York",
        [
            "招牌螺蛳粉 Snail noodles",
            "干拌螺蛳粉 Dry noodles",
            "酸笋粉 Bamboo noodles",
            "牛肉粉 Beef noodles",
            "炸蛋 Fried egg",
            "腐竹豆皮 Tofu skin",
        ],
    ),
    (
        "morning-pocket",
        "清晨口袋煎饼",
        "Morning Pocket",
        "中餐",
        "Markham",
        [
            "经典煎饼 Jianbing",
            "鸡蛋饼 Egg crepe",
            "牛肉煎饼 Beef crepe",
            "豆浆 Soy milk",
            "小米粥 Millet congee",
            "油条 Fried dough",
        ],
    ),
    (
        "pepper-window",
        "小窗川味厨房",
        "Pepper Window",
        "中餐",
        "Spadina",
        [
            "麻婆豆腐 Mapo tofu",
            "宫保鸡丁 Kung pao chicken",
            "回锅肉 Twice cooked pork",
            "鱼香茄子 Eggplant",
            "蒜蓉菜心 Greens",
            "米饭 Rice",
        ],
    ),
    (
        "snow-skewers",
        "雪夜串串屋",
        "Snow Skewers",
        "烧烤",
        "North York",
        [
            "羊肉串 Lamb skewers",
            "牛肉串 Beef skewers",
            "烤鸡翅 Chicken wings",
            "烤茄子 Eggplant",
            "烤蘑菇 Mushrooms",
            "烤馒头 Toasted bun",
        ],
    ),
    (
        "hotpot-orbit",
        "小橙火锅星球",
        "Hotpot Orbit",
        "火锅",
        "Markham",
        [
            "双人火锅 Hotpot set",
            "牛肉锅 Beef pot",
            "菌菇锅 Mushroom pot",
            "毛肚 Tripe",
            "午餐肉 Luncheon meat",
            "蔬菜拼盘 Vegetable set",
        ],
    ),
    (
        "congee-clock",
        "慢钟粥粉面",
        "Congee Clock",
        "中餐",
        "Kensington",
        [
            "皮蛋瘦肉粥 Congee",
            "牛肉肠粉 Rice rolls",
            "干炒牛河 Beef noodles",
            "云吞面 Wonton noodles",
            "萝卜糕 Turnip cake",
            "清粥 Plain congee",
        ],
    ),
    (
        "tea-moon",
        "月亮口袋奶茶",
        "Moon Pocket Tea",
        "奶茶",
        "North York",
        [
            "黑糖珍珠奶茶 Brown sugar tea",
            "茉莉奶绿 Jasmine tea",
            "芋泥奶茶 Taro tea",
            "柠檬茶 Lemon tea",
            "红豆奶茶 Red bean tea",
            "桃桃果茶 Peach tea",
        ],
    ),
    (
        "shawarma-sunset",
        "落日卷饼站",
        "Sunset Shawarma",
        "本地特色",
        "Kensington",
        [
            "鸡肉卷 Chicken shawarma",
            "牛肉卷 Beef shawarma",
            "鹰嘴豆卷 Falafel wrap",
            "鸡肉饭 Chicken rice",
            "鹰嘴豆泥 Hummus",
            "薯条 Fries",
        ],
    ),
    (
        "poutine-cloud",
        "肉汁小云站",
        "Gravy Cloud",
        "本地特色",
        "Downtown",
        [
            "经典肉汁薯条 Classic poutine",
            "蘑菇肉汁薯条 Mushroom poutine",
            "牛肉肉汁薯条 Beef poutine",
            "芝士薯条 Cheese fries",
            "烤土豆 Roasted potato",
            "凉拌卷心菜 Slaw",
        ],
    ),
    (
        "bacon-sunrise",
        "日出培根小铺",
        "Sunrise Peameal",
        "本地特色",
        "Downtown",
        [
            "玉米粉培根三明治 Peameal sandwich",
            "鸡蛋培根包 Egg sandwich",
            "芝士培根包 Cheese sandwich",
            "早餐拼盘 Breakfast plate",
            "烤土豆 Hash browns",
            "橙汁 Orange juice",
        ],
    ),
    (
        "patty-island",
        "小岛酥饼屋",
        "Island Patty",
        "本地特色",
        "Scarborough",
        [
            "牛肉酥饼 Beef patty",
            "鸡肉酥饼 Chicken patty",
            "蔬菜酥饼 Vegetable patty",
            "咖喱鸡饭 Curry chicken",
            "椰香饭 Coconut rice",
            "姜汁饮 Ginger drink",
        ],
    ),
    (
        "pizza-comet",
        "彗星披萨工房",
        "Comet Pizza",
        "披萨",
        "Annex",
        [
            "芝士披萨 Cheese pizza",
            "辣肠披萨 Pepperoni pizza",
            "蔬菜披萨 Veggie pizza",
            "蘑菇披萨 Mushroom pizza",
            "蒜香面包 Garlic bread",
            "凯撒沙拉 Caesar salad",
        ],
    ),
    (
        "burger-paper",
        "纸飞机汉堡",
        "Paper Plane Burger",
        "汉堡",
        "Kensington",
        [
            "经典牛肉汉堡 Beef burger",
            "双层芝士汉堡 Double burger",
            "鸡肉汉堡 Chicken burger",
            "蘑菇汉堡 Mushroom burger",
            "薯条 Fries",
            "洋葱圈 Onion rings",
        ],
    ),
    (
        "chicken-seoul",
        "首尔小纸船",
        "Seoul Paper Boat",
        "韩餐",
        "North York",
        [
            "甜辣炸鸡 Sweet spicy chicken",
            "蒜香炸鸡 Garlic chicken",
            "原味炸鸡 Original chicken",
            "炒年糕 Tteokbokki",
            "紫菜饭团 Rice balls",
            "腌萝卜 Pickled radish",
        ],
    ),
    (
        "pho-lantern",
        "小灯越南粉",
        "Lantern Pho",
        "越南粉",
        "Spadina",
        [
            "牛肉河粉 Beef pho",
            "鸡肉河粉 Chicken pho",
            "素河粉 Vegetable pho",
            "鲜虾春卷 Shrimp rolls",
            "炸春卷 Fried rolls",
            "越南咖啡 Vietnamese coffee",
        ],
    ),
    (
        "ramen-rain",
        "雨点拉面屋",
        "Raindrop Ramen",
        "日餐",
        "Annex",
        [
            "豚骨拉面 Tonkotsu ramen",
            "味噌拉面 Miso ramen",
            "酱油拉面 Shoyu ramen",
            "素拉面 Vegetable ramen",
            "煎饺 Gyoza",
            "毛豆 Edamame",
        ],
    ),
    (
        "tart-little",
        "小甜角黄油塔",
        "Little Sweet Corner",
        "甜品",
        "Downtown",
        [
            "黄油塔 Butter tart",
            "核桃塔 Walnut tart",
            "巧克力蛋糕 Chocolate cake",
            "芝士蛋糕 Cheesecake",
            "苹果派 Apple pie",
            "香草曲奇 Vanilla cookie",
        ],
    ),
    (
        "mcdonalds-toronto",
        "麦当劳（模拟店铺）",
        "McDonald's",
        "汉堡",
        "Downtown",
        [
            "双层牛肉芝士堡 Double beef cheeseburger",
            "香酥鸡腿堡 Crispy chicken sandwich",
            "鱼排芝士堡 Fish sandwich",
            "经典薯条 Classic fries",
            "麦乐鸡块 Chicken nuggets",
            "香草奶昔 Vanilla milkshake",
        ],
    ),
    (
        "chick-fil-a-toronto",
        "Chick-fil-A（模拟店铺）",
        "Chick-fil-A",
        "汉堡",
        "North York",
        [
            "经典鸡肉三明治 Chicken sandwich",
            "辣味鸡肉三明治 Spicy chicken sandwich",
            "烤鸡三明治 Grilled chicken sandwich",
            "华夫薯条 Waffle fries",
            "烤鸡沙拉 Grilled chicken salad",
            "柠檬饮 Lemonade",
        ],
    ),
]
rows = []
for idx, (slug, zh, en, category, hood, names) in enumerate(entries):
    chinese = idx < 8
    r = dict(
        id=slug,
        name_zh=zh,
        name_en=en,
        cuisine="中餐" if chinese else category,
        category=category,
        neighborhood=hood,
        image_url=f"/images/catalog/{slug}.webp",
        rating=round(4.5 + idx % 4 * 0.1, 1),
        eta_min=15 + idx % 3 * 5,
        eta_max=25 + idx % 3 * 5,
        delivery_fee_cents=299 + idx % 3 * 100,
        late_night=idx % 3 != 1,
        sort_order=idx,
        sections=[],
    )
    for n, title in enumerate(["招牌精选", "小食与搭配"]):
        section = dict(id=f"{slug}-section-{n}", name_zh=title, sort_order=n, items=[])
        for j in range(n * 3, n * 3 + 3):
            parts = names[j].split(" ", 1)
            item = dict(
                id=f"{slug}-item-{j}",
                name_zh=parts[0],
                name_en=parts[1],
                description_zh="虚构菜单，认真满足你的想象。",
                price_cents=(1299 + j * 150 if j < 3 else 499 + (j - 3) * 200),
                cny_reference_price=22 + j * 3 if chinese else None,
                image_url=f"/images/catalog/{slug}-item-{j}.webp",
                popular=j == 0,
                option_groups=[],
            )
            if j < 3:
                groups = [("规格", 1, 1, [("标准", 0), ("大份", 250)])]
                if idx == 7:
                    groups += [
                        ("冰量", 1, 1, [("正常冰", 0), ("少冰", 0), ("去冰", 0)]),
                        ("糖度", 1, 1, [("正常糖", 0), ("半糖", 0), ("无糖", 0)]),
                        ("加料", 0, 2, [("珍珠", 75), ("椰果", 75)]),
                    ]
                elif chinese:
                    groups += [
                        (
                            "辣度",
                            1,
                            1,
                            [("不辣", 0), ("微辣", 0), ("中辣", 0), ("特辣", 0)],
                        )
                    ]
                for k, (label, minimum, maximum, opts) in enumerate(groups):
                    gid = f"{item['id']}-group-{k}"
                    item["option_groups"].append(
                        dict(
                            id=gid,
                            name_zh=label,
                            min_select=minimum,
                            max_select=maximum,
                            options=[
                                dict(
                                    id=f"{gid}-option-{z}",
                                    name_zh=o,
                                    price_delta_cents=p,
                                )
                                for z, (o, p) in enumerate(opts)
                            ],
                        )
                    )
            section["items"].append(item)
        r["sections"].append(section)
    rows.append(r)
Path(__file__).with_name("restaurants.json").write_text(
    json.dumps(rows, ensure_ascii=False, indent=2)
)
