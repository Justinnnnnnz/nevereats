# 图片来源与授权

- `catalog/*.webp`：本项目使用内置 imagegen 生成的原创 AI 食物示意图。18 张商家封面和 108 张餐品照片各自独立生成，没有使用真实商家的照片、商标或第三方图片链接。
- 图片按虚构菜单制作，用于 NeverEats 模拟外卖体验；不是实物或真实商家的产品照片。
- 图片生成提示词见 `catalog-prompts.json`。原图缩放为商家 800×500、餐品 480×480 的本地 WebP 图片；另从商家原图裁剪 18 张 600×195 的 `*-card.webp` 首页卡片图；前端通过 Next.js Image 优化并按需加载。
- 空外卖盒 SVG、`public/icons/icon-192.png`、`icon-512.png` 和 `public/favicon.ico` 为本项目原创；PNG 由同一原创 SVG 渲染。
- 云钱包 SVG、云符号与门 emoji 为原创组合或系统字符；分享卡展示本项目自己的品牌。
