# 开发进度

## Milestone 1 — 骨架验证进行中

- 前后端依赖已安装。Python 3.12 环境位于 `api/.venv.nosync`，`api/.venv` 为 symlink；旧环境暂留 `.venv-old.nosync`，均已忽略。
- 前端 ESLint、TypeScript、Vitest（1 项）和 Next.js production build 已通过。修复了 next-intl request 配置缺失和 PostCSS lint warning。
- 后端 Ruff lint、format check、pytest（2 项）及 Python 编译检查已通过。
- 最新 Starlette 提示 httpx TestClient 将被弃用；当前测试正常，未添加 SPEC 未列出的 httpx2。
- 当前阻塞：SPEC.md 仍为 iCloud dataless 文件，无法读取新版内容；Docker 已安装但 engine 未启动。尚未完成数据库/服务整体验证，尚未 commit，尚未进入 Milestone 2。
- 不部署，不 push。环境文件和虚拟环境不提交。

## Milestone 1 — 完成

- SPEC 和 AGENTS 已恢复读取。Postgres 17 已启动，pg_isready 通过，Alembic upgrade head 成功。
- shadcn/ui 基础按钮使用原创橙色 theme tokens；已接入首页。
- 前后端 lint、tests、前端 production build、后端编译和依赖一致性检查通过。API health 和前端生产首页实际启动验证通过。
- 后端为运行型 Python app，无独立前端式 build；使用 compileall 验证源码编译。
- 用户确认 Milestone 2 请求添加必填 client_total_cents，用于后端总额一致性校验。
- 不推送或部署；旧虚拟环境已忽略，稍后清理。当前已知问题仅为 Starlette 测试接口弃用警告。

## Milestone 2 — 完成

- 七张规范化业务表，Postgres JSONB 快照和 UTC timestamptz；Alembic migration 已应用。
- 原创 seed 为 18 家虚构餐厅，每家 2 分区、6 道菜；中餐填写人民币参考价，奶茶含冰量、糖度与加料。
- 餐厅、订单、统计 API 已实现；总额重新计算、选项 min/max、访客 UUID 与订单隔离、基础每访客限流和统一错误格式。
- 金额百分比采用整数 half-up 舍入；前后端共享 fee-cases.json。HST 默认 13%，后端可通过 HST_PERCENT 配置。
- 用户批准添加 client_total_cents；请求禁止额外字段，地址不能传入后端。
- 前后端 lint/tests/build（后端 compileall）通过；9 项后端测试含真实 Postgres 事务回滚集成测试。实际启动餐厅 API 返回 18 家餐厅。
- 限流目前为单进程内存实现，多实例生产部署需要共享限流存储；部署仍只写文档。

## Milestone 3 — 完成

- Zustand guest UUID、地址和单餐厅购物车持久化，localStorage 异常时内存回退。API 使用 X-Guest-Id。
- TanStack Query 餐厅浏览、客户端中英文菜品搜索、分类 chips、深夜/热门分区和菜单页。
- Mapbox Geocoding autocomplete 偏向多伦多；无 token 或请求失败时保留四个快捷地址。所有地址数据仅在 client 状态中。
- shadcn/Radix bottom sheet 有标题、focus trap 和关闭按钮；菜单选项、数量、人民币参考价格、跨餐厅确认和动画购物车 bar。
- 前端 lint、4 项 tests 和 build、后端 lint/9 项 tests/compileall 通过；前后端服务启动响应正常。
- 快捷“宿舍”和“公司”使用多伦多示例坐标；无需传入真实地址。真正的设备/浏览器兼容性在 Milestone 7 和人工测试中验证。

## Milestone 4 — 完成

- 前后端费用函数使用 shared/fee-cases.json 验证，所有金额按整数分计算，百分比 half-up。
- 结账含地址、配送选项、小费选择/自定义、费用说明、失效优惠码与模拟体验告知。
- 空气支付仅原创云钱包图案和扫描/对勾动效，无真实支付字段；创建订单包含 client_total_cents 且不含地址或坐标。
- 前端 lint、8 项 tests、production build，后端 lint/9 项 tests/compileall 通过；服务 health 与结账页响应正常。
- NEXT_PUBLIC_HST_PERCENT 和后端 HST_PERCENT 必须保持一致；不一致时后端拒绝订单。

## Milestone 5 — 完成

- 前后端按相同时间线推算状态；开发环境 ?speed=10/60，生产忽略加速参数。
- 10 个虚构骑手、倒计时、进度与趣味延误消息；状态变化 toast，用户主动授权后发浏览器通知。
- 订单 id 决定 1.5–3km 餐厅坐标；Mapbox cycling route 在 client 缓存，失败回退直线，Turf along/length 与 requestAnimationFrame 计算骑手位置。
- 取餐前接近餐厅、取餐后沿路线前往本地地址。路线与地址不发送到本项目 API。
- 前端 lint/10 项 tests/build 和后端 lint/9 项 tests/compileall 通过；两个服务正常响应。
- 地图/浏览器通知需要有效 token、网络和浏览器支持；无地图时保留时间线。刷新时开发加速仍按原始 placed_at 推算。
