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
