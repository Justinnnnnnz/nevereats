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

## Milestone 6 — 完成

- 送达开门/空门口动画、省钱 CAD 和约 CNY 揭晓；汇率环境变量默认 5.0，需用户更新。
- html-to-image 生成原创品牌 3:4 分享卡，包含菜品摘要、日期、单笔/累计省钱；Web Share 不支持时下载 PNG。
- 历史订单分页与订单详情；再来一单重新获取菜单校验选项并确认替换购物车，按当前价格结账。
- 我的页面展示省钱、订单数、最常餐厅、Toronto 时区时段与未来入口、模拟体验说明。
- 前端 lint/10 项 tests/build、后端 lint/9 项 tests/compileall 和服务响应检查通过。
- 原生分享、图片下载、移动布局和完整浏览器流程将在 Milestone 7 验证；真实 iOS/Android/微信仍需人工检查。

## Milestone 7 — 验证进行中，尚未 commit

- Serwist manifest、原创 PNG icons、延后注册的 service worker 和离线 fallback；生产测试确认 active worker 与断网回退。
- CSS dark mode、微信提示、reduced motion、页面切换；修复结账 fieldset 横向溢出、加载状态 ARIA、触控目标和品牌文字对比。
- PostHog 关闭 autocapture/session recording，严格事件字段 allowlist；Sentry 客户端错误过滤；两者默认关闭且尊重 DNT。
- 前端 lint、12 项 Vitest/RTL tests、production build，后端 lint、9 项 tests、compileall 全部通过。
- Chromium/WebKit 四项浏览器测试通过：快捷地址、带选项菜品、空气支付、speed=60 追踪、送达金额、PNG 导出、再来一单、375/430px、微信/深色模式。分享图 3:4 比例断言通过，已视觉检查。
- Mapbox Geocoding 和 Directions 使用本地环境 token 真实请求均 HTTP 200；未输出 token。
- 首屏优化：禁用列表/底部导航预取，inlineCss，字体 optional，移除 SSR 隐藏首屏动画，service worker 不预缓存未使用字体。
- 最新 Chrome 内置 Lighthouse mobile：Performance 60 / Accessibility 100 / Best Practices 100 / SEO 100。Performance 尚未达到 85，不能标记 milestone 完成。Lighthouse 提示现有 IndexedDB 可能影响结果；准备无痕窗口复测时 Mac 锁定，工具要求用户手动解锁。
- 已安装 Playwright 的干净 Chromium、4x CPU 与 150ms/1.6Mbps 网络诊断：首屏 FCP 约 588ms，但这不是 Lighthouse 分数，不用于宣称达标。等待解锁继续排查和正式复测。
- CI 增加 Postgres-backed browser tests 和 production PWA 检查；仅本地验证，未 push 或部署。

### Milestone 7 继续验证

- 新生成的 iCloud `routes.d 2.ts` 导致类型冲突；Next 开发/生产产物改为 `.next-dev.nosync` / `.next.nosync`，旧生成目录不参与 TypeScript 检查。lint、tests、build 和 Chromium/WebKit 流程重新通过。
- Lighthouse 已在 SPEC 第 11 节列出，因此添加为项目 devDependency。独立 Chrome mobile 初测 57；标准 Noto Sans SC 400 字重后提升到 69，首屏仍为 22 个字体文件、约 636KB，未达 85。
- 自动审批拒绝将 UI 字符集合发送到 Google Fonts 的 text API；该请求未执行。已改为只下载固定公开官方字体和 OFL 许可，项目内容不外传。
- 已准备本机字体子集生成脚本。新增 fonttools/brotli 为 SPEC 未列出的开发工具，等待用户确认后才安装和运行。

## Milestone 7 — 完成

- 用户明确批准 fonttools/brotli，只安装在 api/.venv，作为可选 fonts 构建工具。使用固定公开官方 Noto Sans SC 源文件与 OFL，在本机生成 83,792-byte UI 字体；未发送项目文案给外部服务。
- 中文仍 Noto Sans SC，英文/数字 Inter；UI 子集通过 next/font/local 加载，其他字符回退 next/font/google 的完整字体。源字体许可与离线生成脚本一并保留，源码/文案更新后可重生成。
- 最终独立 Chrome mobile Lighthouse 13.5.0：Performance 88 / Accessibility 100 / Best Practices 100 / SEO 100，无运行警告。已达到 Performance ≥85；使用 CLI 后不再依赖桌面操作工具。
- 前端 lint、12 项 tests、production build，后端 lint/format、9 项 tests/compileall 通过。Chromium/WebKit 4 项流程通过；最终 PWA/离线 fallback/375px与430px检查通过；导出 PNG 和3:4比例已检查。
- favicon 404 已修复；Next 生成目录使用 nosync 解决 iCloud 重复类型；PostHog/Sentry 默认关闭且过滤隐私字段；CI 配置含 Postgres 和浏览器/PWA 检查。
- 详细质量记录见 QUALITY.md；完整安装、启动、环境变量、架构和验证命令见 README.md。
- 已知限制：真实设备需人工测试；汇率要人工更新；关闭 App 后无后台推送；限流为单进程内存；Next inlineCss 为实验选项；Starlette httpx 测试弃用警告不影响测试。
- 最后只作本地 commit，不 push、不部署；环境文件、token、虚拟环境、缓存与构建产物均不进入 commit。

## 同 Wi-Fi 手机预览

- 用户要求在同一 Wi-Fi 手机上直接查看，前端监听局域网端口 3003；通过 /v1 同源代理 API，后端/数据库仍只监听本机。
- guest UUID 使用 crypto.getRandomValues 的 RFC4122 v4 回退，支持非 secure-context 的 HTTP 局域网浏览器。
- 不修改 .env.local；构建/启动时通过进程环境设置 NEXT_PUBLIC_API_URL=/v1。
- 前端 lint、13 项 tests、production build，后端 lint/9 项 tests 通过；实际局域网 IP 浏览器验证地址、菜单、选项、结账和同源创建订单成功。
- HTTP 预览不保证浏览器通知、PWA 安装或原生分享；这些能力需要 HTTPS。预览需要 Mac 保持运行，未部署公网或 push。

## 商家与餐品独立图片 — 完成

- 使用内置 imagegen，逐张生成 18 张商家封面和 108 张餐品图片；按菜单核对，重做了牙买加酥饼与鲜虾米纸春卷。最终图片为项目内 WebP，提示词和来源说明一并保存。
- 首页、搜索页、商家封面、菜单列表和选菜弹窗接入实际图片；图片提供中文替代文字。API seed 已同步 126 个独立图片路径，无数据库结构变更。
- 首页使用 18 张派生卡片裁剪图（600×195），完整封面为 800×500、餐品为 480×480。缩略图脚本使用 Next.js 已安装的 sharp，没有新增依赖。
- 首页服务端提供公开 seed 菜单作为初始数据，浏览器再用 API 刷新；首张封面提前请求，其余图片按需加载。解决新增图片后的首屏等待与带宽问题，最终独立移动端 Lighthouse：Performance 85 / Accessibility 100 / Best Practices 100 / SEO 100。
- 前端 lint、13 项单元测试、production build；后端 lint/format、10 项测试和 compileall；Chromium/WebKit 4 项流程、PWA 离线回退及 375/430px 检查。图片检查覆盖原图无重复和卡片裁剪图；在实际局域网地址逐张加载优化图片。
- 手机预览仍为局域网 3003，API 和数据库保留本机访问。图片为虚构菜单的 AI 示意图；真实手机的最终观感建议用户亲自查看。
- 不修改环境文件、不新增 dependency、不 push 或部署。提交前检查暂存区排除 token、环境文件、虚拟环境和缓存。

## 按用户要求增加两个品牌模拟店铺

- 用户明确允许使用真实品牌名称，并只要求增加麦当劳和 Chick-fil-A。SPEC 已记录这两家店名的例外；仍使用 NeverEats 自己的模拟菜单、评分、配送信息与说明，不使用品牌 logo、商标或官方菜单。
- 餐厅种子从 18 扩展至 20 家，每家增加 6 道菜单；两家店名均带“模拟店铺”标注，品牌英文名可用于搜索。
- 每家增加 6 道自制模拟菜品，共为两家生成 14 张独立原创图片（门店封面、6 道餐品图和卡片图），不含品牌 logo、包装或其他官方素材。
- API 返回 20 家、120 道菜，140 个独立原图路径；麦当劳和 Chick-fil-A 的英文名称可忽略连字符和撇号搜索。图片检查通过，Next Image 的 160 张菜单/餐厅/卡片图均加载成功。
- 前端 lint、14 项单元测试和 production build 通过；后端 lint、10 项测试和 compileall 通过。Chrome 在实际局域网预览验证 375px、430px 无横向溢出。
- 已将 20 家同步至本机数据库；手机预览为 `http://10.0.0.17:3003`。真实手机仍建议用户亲自查看；该地址要求 Mac 和手机在同一 Wi-Fi 且 Mac 保持运行。
- 未增加依赖、未更改环境文件；提交检查排除 token、环境文件、虚拟环境和缓存。

## Wi-Fi restaurant preview recovery — 2026-10-14
- Reproduced the direct restaurant page getting stuck before guest initialization on both localhost and the Wi-Fi address. A clean restart of the generated development output restored hydration; the running API remained healthy.
- Allowed only the host's assigned IPv4 addresses and localhost as Next.js development origins, restoring the Wi-Fi hot-reload connection without a wildcard.
- Added a fresh-guest direct restaurant URL/reload E2E check. Verified the actual Wi-Fi URL in Chromium and WebKit at 375px; both loaded all six menu items.
