# 最终质量检查

检查日期：2026-10-14（America/Toronto）。仅本地验证，未部署。

## Lighthouse

Lighthouse 13.5.0，独立 Chrome profile，mobile / simulated throttling，生产首页。

| 项目 | 分数 |
| --- | --- |
| performance | 88 |
| accessibility | 100 |
| best-practices | 100 |
| seo | 100 |

移动端 Performance 88 ≥ SPEC 要求 85；本次报告无运行警告。分数会随机器与网络变化，此结果针对生产首页。

## 功能与构建

- 前端 ESLint + TypeScript、12 项 Vitest/RTL tests、Next.js production build 通过。
- 后端 Ruff lint/format、9 项 pytest（含 Postgres 集成测试）、compileall 通过。
- Chromium/WebKit 4 项 Playwright 流程通过：地址、选项、空气支付、加速送达、PNG 导出、3:4 比例、再来一单、微信提示、深色模式与减少动态效果。
- 375px / 430px 无横向溢出，分享 PNG 已视觉检查。
- 生产 manifest、active service worker 与断网 fallback 通过。
- Mapbox Geocoding / Directions 本地环境 token 请求均 HTTP 200，token 未输出。

## 可复现命令

运行 Postgres/API 后，在 web 执行 README 中的 lint、test、build、test:e2e、test:pwa 和 test:performance。Lighthouse JSON 位于忽略的 `.cache.nosync/lighthouse-mobile.json`。

真实 iOS/Android/微信、系统分享与通知权限仍建议用户亲自验证；未宣称这些真实设备已测试。

## 独立商家与餐品图片（2026-10-14）

- 原创 AI 图片 126 张：18 商家 + 108 餐品；另含 18 张首页卡片裁剪图。
- 验证 WebP 解码、尺寸、独立路径、文件内容无重复；局域网图片优化端点加载全部 144 张资源。
- 前端 13 tests；后端 10 tests；Chromium/WebKit 4 e2e；PWA 与 375/430px 无横向滚动。
- 最终移动端 Lighthouse 13.5.0：85 / 100 / 100 / 100，无运行警告。采用首屏服务端菜单数据、图片预加载和压缩卡片裁剪图。
- 下一步人工体验：手机刷新局域网预览，逐家查看封面、餐品图和选菜弹窗。
