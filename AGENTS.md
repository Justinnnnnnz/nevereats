# Codex 工作守则（自动模式）

## 工作方式
- 完整的产品说明书在 SPEC.md。做任何任务之前先读它。
- 按顺序连续完成 Milestone 1 到 7，不需要每一步等我确认。
- 每个 milestone 开始前，在终端里简单写下 plan，然后直接执行。
- 自己安装依赖、运行命令、修复错误。遇到问题先自己排查和解决，尝试多种方法之后仍无法解决，再停下来问我。

## 每个 milestone 完成时
1. 运行前后端的 lint、tests 和 build，修复所有失败项。
2. 确认服务能正常启动。
3. 检查暂存区里没有 secrets、.env、.env.local 或 .venv。
4. 用清楚的 message commit，格式如 `Milestone 2: backend core`。
5. 在 `PROGRESS.md` 里追加一段：完成了什么、做了哪些决定、有哪些已知问题。
6. 直接开始下一个 milestone。

## 必须停下来问我的情况
- 需要添加 SPEC.md 里没有列出、也不是所选框架标准配套的 dependency。
- SPEC.md 里有互相矛盾、或者会明显影响产品方向的地方。
- 需要我本人操作的事情（安装图形界面软件、登录账号）。
- 任何会删除项目以外文件，或修改系统设置的操作。

## 安全规则
- 只在 nevereats 项目文件夹里创建和修改文件。
- 永远不要 commit secrets 或 .env 文件。
- Mapbox token 由我在对话里提供。你只能把它写进 `web/.env.local` 的 `NEXT_PUBLIC_MAPBOX_TOKEN`，确认 `.env.local` 在 `.gitignore` 里。绝对不要把 token 写进代码、README、PROGRESS.md、测试或任何会被 commit 的文件，也不要在输出里重复打印它。代码只通过环境变量读取它。
- 项目放在 iCloud 同步的桌面上，`.venv` 和 `node_modules` 这类大量小文件可能导致读写极慢甚至卡住。如果 pip 或 npm 卡住，把虚拟环境建成 `api/.venv.nosync`，再用 symlink `api/.venv` 指向它（iCloud 会跳过 `.nosync` 结尾的文件夹），并确保两者都在 `.gitignore` 里。
- 不要使用 sudo，不要全局安装软件包（Python 依赖只装在 api/.venv 里）。
- 不要运行 `npm audit fix --force` 或其他会升级大版本的命令；处理漏洞前先在 PROGRESS.md 里说明。
- 不要 push 到任何远程仓库，也不要部署。

## 全部完成后
用简单易懂的中文给我一份总结：每个 milestone 做了什么、怎么在本地启动和检查、哪些地方建议我亲自测试、还有哪些已知问题。
