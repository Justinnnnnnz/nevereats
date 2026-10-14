# Codex 开发说明书 — "NeverEats"（假外卖 PWA）

> 把这个文件放在 repo 根目录，命名为 `SPEC.md`，然后告诉 Codex："阅读 SPEC.md，只实现 Milestone 1。每完成一个 milestone 就停下来。"

---

## 1. 产品概述

你要开发的是 **NeverEats**：一个 mobile-first 的 PWA，完整模拟点外卖的全过程——浏览餐厅、定制菜品、结账、在实时地图上看骑手移动、收到"已送达"通知——**但永远不会有任何食物送达，也不会扣任何钱**。最后，用户会看到自己因为没有真的下单而省了多少钱。

- **目标用户：** 多伦多的中国留学生和年轻华人，18–30 岁。
- **核心洞察：** 深夜想点外卖的冲动是即时的、有时效的。完成一次"下单"的仪式感就能满足这种冲动，而 App 把它变成了真实的省钱。
- **UX 目标：** *交互方式*要像一流外卖 App 一样流畅、熟悉（搜索栏、分类 chips、餐厅卡片、菜单分区、购物车 bar、结账、实时追踪）。*品牌*必须完全原创（见第 3 节）。
- **界面语言：** 所有 UI 文案使用简体中文。菜名在合适的地方中英并列（如 "麻辣烫 Malatang"、"Poutine 肉汁薯条"）。所有 UI 字符串放在一个统一的字典文件里，方便以后加英文版（使用 `next-intl`）。

---

## 2. Tech Stack（严格使用以下技术；添加其他主要依赖前先问我）

**前端 — `/web`**
- Next.js（App Router）+ TypeScript（strict 模式）
- Tailwind CSS + shadcn/ui（必须自定义 theme tokens，不要保留默认样式）
- Framer Motion 做动画
- Zustand 管理购物车和本地 guest 状态（persist 到 localStorage，并用 try/catch 包裹）
- TanStack Query 调用 API
- Serwist 做 PWA（manifest、service worker、可安装、离线 shell）
- Mapbox GL JS（地图）、Mapbox Search/Geocoding API（地址 autocomplete）、Mapbox Directions API（路线）
- Turf.js（`@turf/along`、`@turf/length`）计算骑手在路线上的位置
- `html-to-image` 生成可分享的省钱卡片
- PostHog（analytics）、Sentry（错误监控）
- Vitest + React Testing Library；Playwright 做一个端到端 happy path 测试

**后端 — `/api`**
- Python 3.12、FastAPI、Pydantic v2
- SQLModel + Alembic（migration）
- PostgreSQL（本地用 Docker；生产环境用 Supabase Postgres）
- pytest + httpx 做测试
- Ruff 做 lint/format

**基础设施**
- Monorepo 结构：`/web`、`/api`、`docker-compose.yml`（本地开发用的 Postgres）
- GitHub Actions CI：两个 app 都要跑 lint + 测试
- 部署目标（只写文档，不要实际部署）：web → Vercel，api → Railway 或 Fly.io
- 两个 app 都要有 `.env.example`；永远不要 commit secrets

---

## 3. 硬性约束（必须遵守）

1. **原创品牌，不是 Uber Eats。** 不得使用 "Uber"、"Uber Eats"、"Uber One"、"DoorDash"、"Fantuan" 等名称，也不得使用它们的 logo、图标、字体或配色。不要用黑 + 绿配色。因为 "NeverEats" 这个名字本身是对 "Uber Eats" 的戏仿，视觉识别必须明显不同：绝对不要把 "Eats" 部分做成 Uber Eats wordmark 的样式（不能有相同的字体、字重、颜色或双色拆分）。名字始终写成一个词 "NeverEats"，使用第 4 节的品牌字体和颜色。
2. **模拟餐厅。** 除用户明确指定的麦当劳和 Chick-fil-A 两家模拟店铺外，不得使用其他真实餐厅名称、logo 或菜单。两家指定店铺仅以纯文字名称出现；菜单、图片、地点、评分和配送信息均为 NeverEats 的虚构模拟内容，不代表品牌官方信息。街区名（Spadina、North York、Kensington、Markham）可以用来增加本地感。
3. **不做真实支付 UI。** 永远不要渲染卡号 / CVV / 有效期输入框。永远不要模仿 Apple Pay、Google Pay 或任何系统支付弹窗及其按钮和 logo。使用原创的"空气支付 Pretend Pay"流程（见 6.4 节）。
4. **地址隐私。** 用户的地址和坐标只保存在 client 端。后端永远不接收、不存储地址或用户坐标。订单只存餐厅 id、菜品、金额和时间戳。
5. **清楚告知。** 在结账页和"我的"页面底部常驻显示一行小字："这是模拟体验：不会配送真实食物，也不会扣任何钱。"
6. **金额用整数（分）。** 所有价格和计算都用 integer cents，只在显示时格式化。
7. **不做卡路里相关文案。** App 的核心指标是省了多少钱，不是少摄入多少卡路里。
8. **图片：** 菜品使用本地 placeholder 图片，或渐变背景 + emoji 的占位图。新建 `/web/public/images/LICENSES.md`，记录每张图片的来源和授权。不要 hotlink 其他 App 或餐厅网站的图片。

---

## 4. 品牌与 Design System

- **名称：** NeverEats。Tagline："下单的快乐，一分钱不花。"
- **主色：** 暖橙色 `#FF7A1A`；辅助色：奶油色 `#FFF4E6`；文字：近黑色 `#1F1A17`；成功色：`#2BB673`。用 CSS 变量支持 dark mode。
- **字体：** 中文用 `Noto Sans SC`，英文和数字用 `Inter`（通过 `next/font` 引入 Google Fonts）。
- **形状：** 大圆角（卡片 16px，chips 做成全胶囊形）、柔和阴影、宽松的间距。
- **Logo 占位：** 一个简单的原创 SVG，用虚线画一个空的外卖盒（寓意食物"永远不会送达"），使用主橙色。
- **布局：** mobile-first，按 375–430px 宽度设计；在桌面端，把 App 居中放在一个 430px 宽的列里。
- **底部 tab bar：** 首页 / 搜索 / 订单 / 我的。
- **动效：** 页面切换、购物车 bar 滑入、加入购物车时的弹跳、送达庆祝动画。要尊重 `prefers-reduced-motion` 设置。

---

## 5. MVP 范围

**本次要做的：**
1. 地址选择（autocomplete + 快捷地址）
2. 首页（搜索、分类 chips、餐厅卡片）
3. 餐厅页（菜单分区、菜品定制）
4. 购物车 + 结账（费用明细、小费、优惠码输入框、空气支付）
5. 订单追踪（由时间戳推算状态、实时骑手地图、App 打开时的站内通知 + 浏览器通知）
6. 送达页 + 省钱统计（单笔省钱、可分享卡片、累计统计）
7. 订单历史 + "再来一单"
8. 只做 guest 模式（匿名 `guest_id`）

**暂时不做（不要实现，但代码结构要方便以后扩展）：**
账户登录、优惠券引擎、会员、评分评价、App 关闭时的后台推送、社交功能、native app。

---

## 6. 功能详细说明

### 6.1 Guest 身份
- 首次打开时生成一个 UUID v4 作为 `guest_id`，存到 localStorage（用 try/catch；如果不可用，就保存在内存里）。
- 每个 API 请求都在 header `X-Guest-Id` 里带上它。后端校验 UUID 格式。

### 6.2 地址选择
- 首次打开时弹出 bottom sheet："送到哪里？"
- Mapbox 地址 autocomplete，偏向多伦多（proximity：43.6532, -79.3832；country：CA）。
- 快捷地址使用固定坐标（不需要 autocomplete）："📚 Robarts 图书馆"、"🏠 宿舍"、"🏢 公司"、"🗼 CN Tower"。
- 选中的地址名称和坐标只存在 client 端状态里。首页顶部显示当前地址，点击可以更换。
- 如果 Mapbox token 缺失或请求失败，就只显示快捷地址。

### 6.3 首页与浏览餐厅
- **首页：** 搜索栏、横向滑动的分类 chips（全部 / 中餐 / 火锅 / 奶茶 / 烧烤 / 韩餐 / 越南粉 / 汉堡 / 披萨 / 本地特色 / 甜品 / 宵夜）、"深夜也开"和"附近热门"两个板块、餐厅卡片（图片、店名、菜系、虚构评分、配送时间 "15–25 分钟"、配送费）。
- **搜索：** 在 client 端过滤餐厅名和菜名（中英文都支持）。
- **餐厅页：** 顶部大图、店名、信息行（评分、配送时间、配送费）、吸顶的分区 tabs、菜品列表。点击菜品弹出 bottom sheet，包含选项（单选或多选组，如辣度、规格、加料、冰量、糖度）、数量加减器，以及按钮"加入购物车 · $X.XX"。
- **双价格标签：** 每道菜显示 CAD 价格；中餐菜品额外用浅色小字显示一行"国内约 ¥22"（字段 `cny_reference_price`）。西餐菜品不显示额外信息。
- **购物车规则：** 一个购物车只能有一家餐厅的菜。从另一家餐厅加菜时，弹出确认框询问是否清空购物车。
- **底部吸附的购物车 bar：** 显示件数、小计和"去结算"。

### 6.4 结账与空气支付
- 地址行（读取 client 端状态）、配送选项（标准 / 加急 +$2.99，纯装饰：选加急会把模拟时间线缩短 40%）。
- **费用明细**（全部以分计算，前端用一个共享的 pure function 计算，后端再重新校验一遍）：
  - 小计 = sum（菜品价格 + 选项加价）× 数量
  - 配送费 = 餐厅的 `delivery_fee_cents`
  - 服务费 = 小计的 15%，最低 $2.00，最高 $7.00
  - 小额订单费 = 小计低于 $15.00 时收 $2.50
  - 加急费 = 选加急时收 $2.99
  - HST = (小计 + 配送费 + 服务费 + 小额订单费 + 加急费) 的 13%（安省税率，做成可配置项）
  - 小费 = 0 / 15% / 18% / 20% / 25% / 自定义，按小计计算；默认 18%。如果选了 0，显示一个难过的骑手 emoji 和文字"骑手：没关系的…（假装不在意）"
  - 总计 = 以上所有项之和
- 每一行旁边加一个小的 info 图标，点击解释这项费用。
- 优惠码输入框：MVP 阶段不接受任何码——输入任何码都显示"这个券已过期（它从来就没生效过）"。保留这个输入框的接口，方便以后接入优惠券逻辑。
- **支付方式：** 只有一个选项"空气支付 Pretend Pay"，配一个原创图标（一朵云加一个钱包）。按钮："空气支付 $XX.XX"。
- **支付动画：** 全屏 overlay，一个圆形扫描动画（约 1.2 秒，原创设计），然后显示对勾和"已从你的想象力余额扣款 $XX.XX"。接着创建订单，跳转到追踪页。

### 6.5 订单追踪（核心）
- **状态由时间戳推算——不使用后台任务。** 后端存储 `placed_at` 和一个 `timeline`（有序列表，每项为 `{status, offset_seconds}`）。当前状态 = offset ≤（当前时间 − placed_at）的最后一个阶段。前端（用于流畅更新）和后端（用于 `GET /orders/{id}`）各有一份相同的推算函数。
- **默认时间线（标准配送，总计约 10 分钟；加急时所有 offset 乘以 0.6）：**
  1. `placed` 下单成功 — 0 秒
  2. `restaurant_accepted` 商家已接单 — 20 秒
  3. `preparing` 正在制作 — 40 秒
  4. `courier_assigned` 骑手已接单 — 150 秒
  5. `picked_up` 骑手已取餐 — 270 秒
  6. `en_route` 配送中 — 300 秒
  7. `arriving` 即将送达 — 540 秒
  8. `delivered` 已送达 — 600 秒
- 加一个仅限开发环境的 query 参数 `?speed=10`，用来加速时间方便测试。
- **骑手：** 从 10 个虚构骑手中随机分配（名字、emoji 头像、交通工具 🛵/🚲、一句人设介绍，如"风雨无阻的小王"）。从 `courier_assigned` 阶段开始显示。
- **地图：**
  - 餐厅坐标：在 client 端生成，位于用户坐标 1.5–3 公里范围内的随机点（用订单 id 作为随机种子，保证刷新后位置不变）。按订单 id 存在 client 端状态里。
  - 路线：用 Mapbox Directions（cycling profile）计算从餐厅到用户的路线。路线 geometry 按订单 id 缓存在 client 端状态里。
  - 骑手位置：`picked_up` 之前，显示骑手从附近一个随机点前往餐厅；`picked_up` 之后，进度 fraction =（当前时间 − 取餐时间）/（送达时间 − 取餐时间），位置 = `turf.along(route, fraction × 路线长度)`。用 requestAnimationFrame 做平滑动画。
  - 如果 Directions 请求失败：退回到直线插值。
- **状态 UI：** bottom sheet，包含进度条、预计送达倒计时、骑手卡片，以及轮播的状态消息。准备一组有多伦多特色的趣味延误消息，在 `en_route` 阶段随机显示（如"骑手在 Spadina 等红灯"、"骑手被一只浣熊拦住了 🦝"、"骑手遇到了 TTC 改道"）。这些消息只是增加趣味，不影响时间。
- **App 打开时的通知：** 每次状态变化，显示一个站内 toast；如果用户授权了 Notification 权限，同时发一个浏览器 `Notification`（在第一次下单后请求一次权限，并附上友好的说明）。App 关闭时的后台推送不在本次范围内。

### 6.6 送达与省钱
- 到达 `delivered` 时：全屏动画序列——开门动画 → 门口空无一物 → "外卖已送达！……然而门口空无一物。" → 揭晓省钱金额："这一单你省下了 $XX.XX ≈ ¥YYY"。
- 人民币换算使用环境变量 `NEXT_PUBLIC_CAD_TO_CNY`（默认 `5.0`，加注释说明必须更新为当前汇率；人民币金额前显示"约"）。
- **省钱金额 = 订单总额**（含税和小费）。
- **可分享卡片**（用 `html-to-image` 渲染，3:4 比例适配小红书）：App logo + 名称、点的菜、CAD 和 CNY 省钱金额、累计省钱、一句趣味文案、日期。按钮："保存图片"和使用 Web Share API 的"分享"（不支持时退回到下载）。卡片必须清楚展示 App 自己的品牌。
- 送达后的按钮："再来一单（假的）"和"回首页"。

### 6.7 订单与统计（"订单"和"我的" tab）
- **订单：** 历史订单列表（餐厅、菜品摘要、总额、日期、状态）。点击进入订单详情。"再来一单"会把同样的菜重新加入购物车。
- **我的：** 累计统计——总共省了多少（CAD + CNY）、订单数、最常点的餐厅、最常下单的时段。底部显示第 3 节第 5 条的告知文字。为以后的功能（登录、会员、优惠券）预留入口，显示为"即将上线"。

---

## 7. Data Model（后端）

```
restaurant
  id (str slug), name_zh, name_en, cuisine, category, neighborhood,
  image_url, rating (float, 虚构), eta_min, eta_max,
  delivery_fee_cents, late_night (bool), sort_order

menu_section
  id, restaurant_id, name_zh, sort_order

menu_item
  id, restaurant_id, section_id, name_zh, name_en, description_zh,
  price_cents, cny_reference_price (int | null), image_url, popular (bool)

option_group
  id, menu_item_id, name_zh, min_select, max_select

option
  id, option_group_id, name_zh, price_delta_cents

order
  id (uuid), guest_id (uuid, 建索引), restaurant_id, express (bool),
  subtotal_cents, delivery_fee_cents, service_fee_cents, small_order_fee_cents,
  express_fee_cents, tax_cents, tip_cents, total_cents,
  courier_id, placed_at (timestamptz), timeline (jsonb)

order_item
  id, order_id, menu_item_id, name_zh_snapshot, quantity,
  unit_price_cents, selected_options (jsonb 快照)
```
数据库里任何地方都不存地址或坐标。

---

## 8. API（FastAPI，前缀 `/v1`）

| Method | Path | 说明 |
|---|---|---|
| GET | `/health` | 健康检查 |
| GET | `/restaurants` | 餐厅列表，可选参数 `category`、`q` |
| GET | `/restaurants/{id}` | 完整菜单，含分区、菜品、选项组 |
| POST | `/orders` | body：restaurant_id、items[{menu_item_id, quantity, option_ids[]}]、tip_mode、tip_custom_cents、express。服务器重新计算所有费用，如果和 client 端总额不一致则拒绝。返回订单，含 timeline 和推算出的当前状态。 |
| GET | `/orders/{id}` | 必须和 `X-Guest-Id` 匹配；返回推算出的当前状态 |
| GET | `/orders` | 当前 guest 的订单，按时间倒序，分页 |
| GET | `/stats` | 当前 guest 的统计：saved_cents、order_count、favorite_restaurant、top_hour |

- 按 min/max 校验选项选择是否合法。
- 统一的错误格式：`{ "error": { "code": "...", "message": "..." } }`。
- CORS：允许环境变量里配置的 web origin。
- 对 `POST /orders` 做基础 rate limiting（如每个 guest 每分钟 30 次）。

---

## 9. Seed 数据

创建 `api/seed/restaurants.json` 和一个 seed 命令。**18 家虚构餐厅，以及仅供模拟的麦当劳和 Chick-fil-A**，分布在多伦多各个街区，每家 2–4 个菜单分区、6–10 道菜，价格符合多伦多外卖的真实水平，在合适的地方加上选项组。构成如下：

- **中餐（8 家）：** 麻辣烫、螺蛳粉、煎饼果子/早点、川菜小炒、东北烧烤串、火锅外卖、粥粉面茶餐厅、奶茶店（含冰量/糖度/加料）
- **多伦多本地 & 西餐（6 家）：** shawarma、poutine、peameal bacon sandwich、Jamaican patty、披萨、汉堡
- **其他亚洲菜（3 家）：** 韩式炸鸡、越南粉 pho、日式拉面
- **甜品（1 家）：** butter tart 和甜品

示例（仅作格式参考）：
```json
{
  "id": "spadina-malatang",
  "name_zh": "Spadina 深夜麻辣烫",
  "name_en": "Spadina Late Night Malatang",
  "cuisine": "中餐", "category": "中餐", "neighborhood": "Spadina",
  "rating": 4.7, "eta_min": 15, "eta_max": 25,
  "delivery_fee_cents": 399, "late_night": true
}
```
中餐菜品要填 `cny_reference_price`（国内的常见价格）。

---

## 10. Analytics（PostHog 事件计划）

`app_opened`、`address_selected`（type：quick_pick | autocomplete——永远不要发送地址本身）、`restaurant_viewed`、`item_added`、`checkout_started`、`tip_selected`（百分比）、`pretend_pay_completed`（total_cents）、`order_status_viewed`、`order_delivered_viewed`、`share_card_generated`、`share_card_shared`、`reorder_clicked`。
默认关闭 session recording。尊重 Do Not Track 设置。

---

## 11. 质量标准

- Mobile-first；在 375px 和 430px 宽度下测试，不能出现横向滚动。
- 在 iOS Safari、Android Chrome 上正常运行；在微信内置浏览器里也要能用（检测到微信浏览器时显示一个提示条："建议用浏览器打开，体验更完整"）。
- Lighthouse：PWA 可安装，移动端 Performance ≥ 85。
- 无障碍：语义化 HTML、输入框有 label、有 focus 状态、颜色对比度达到 AA 标准。
- 列表加载时显示 skeleton；每个页面都要有空状态和错误状态。
- 单元测试：费用计算（前后端用同一组测试用例）、状态推算、选项校验。
- Playwright e2e 测试：选择快捷地址 → 打开餐厅 → 加一道带选项的菜 → 结账 → 空气支付 → 追踪页加载（带 `?speed=60`）→ 送达页显示省钱金额。
- README 包含安装步骤、环境变量、常用 scripts 和架构图（Mermaid）。

---

## 12. Milestones（一次只做一个；每完成一个就停下来总结）

1. **搭建骨架：** monorepo、带 theme tokens + 字体 + tab bar 框架的 Next.js app、带 health endpoint 的 FastAPI app、Docker Postgres、Alembic 配置、CI、`.env.example`、README 初稿。
2. **后端核心：** models、migrations、seed 数据 + 命令、餐厅 endpoints、费用计算模块、带 timeline + 状态推算的订单 endpoints、统计 endpoint、测试。
3. **浏览功能：** guest id、地址 sheet（autocomplete + 快捷地址）、首页、搜索、餐厅页、菜品选项 sheet、购物车 store + 底部购物车 bar。
4. **结账：** 费用明细（与后端逻辑一致，使用同一组测试）、小费选择、优惠码输入框、空气支付动画、创建订单。
5. **追踪：** client 端状态推算、时间线 UI、骑手卡片、Mapbox 地图 + 路线 + 骑手动画、延误消息、toast + 浏览器通知。
6. **送达与历史：** 送达动画序列、省钱揭晓、分享卡片、订单 tab、再来一单、"我的"统计。
7. **打磨：** PWA（Serwist）、PostHog、Sentry、微信浏览器提示条、dark mode、reduced motion、Lighthouse 达标、Playwright e2e、最终版 README。

每完成一个 milestone：运行 lint 和测试，修复失败项，用清楚的 message commit，然后列出已完成的内容、下一步要做的内容，以及你做出的任何决定。
