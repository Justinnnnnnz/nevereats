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
