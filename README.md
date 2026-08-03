# gigos-mirror

[简体中文](README.md) · [正體中文](README.zh-TW.md) · [English](README.en.md)

[iso.gentoozh.org](https://iso.gentoozh.org/) 的 Cloudflare Worker,Gentoo 中文社区 Live ISO 的下载站。
它在边缘读取 R2 桶列出当前与历史版本，并按语言各渲染一份完整文档。

## 路由

三种语言六份文档，全部在边缘渲染。没有运行期换字：语言在路径里，文本在标记里，`lang` 从第一个字节就是对的。

| 语言 | 落地页 | 使用说明 |
|---|---|---|
| 简体中文 | `/` | `/about` |
| 正体中文 | `/zh-tw/` | `/zh-tw/about` |
| 英文 | `/en/` | `/en/about` |

未知路径重定向到读者所用语言的落地页。这是全站唯一读取 `Accept-Language` 的地方，因为已经指名语言的链接不应随打开它的人的浏览器变化。

ISO 文件由 R2 自定义域 `r2.gentoozh.org` 提供，不经过 Worker。

## 环境要求

Node.js 与 `npx`。部署需要拥有 `gentoozh` R2 桶的 Cloudflare 账号，本地预览不需要。

## 本地预览

```bash
npm run check                                # 检查翻译与渲染
node scripts/preview.mjs                     # 六份文档写入 dist/
cd dist && python3 -m http.server 8721
```

预览与线上共用 `src/render.js`,除 ISO 数据是假的以外，字节与生产一致。要连 R2 与边缘缓存，改用 `npm run dev`。

## 部署

推送到 `main` 触发 Cloudflare Workers Builds。从本机部署用 `npm run deploy`,它会先执行检查，未通过就停止。

`iso.gentoozh.org` 与 `mirror.gentoozh.org` 都指向这个 Worker,旧域名因为仍有外部链接指向而保留。构建通知发往 [Telegram @gentoomirror](https://t.me/gentoomirror)。

## 目录

| 路径 | 内容 |
|---|---|
| `src/index.js` | Worker 入口：路由、边缘缓存、读 R2 |
| `src/render.js` | 文档渲染,Worker、预览与检查共用 |
| `src/i18n.js` | 语言表与三份消息目录 |
| `src/content-about.js` | 说明页正文，一种语言一份 |
| `src/icons.js` | 图标几何，原样取自 lucide 0.456.0 |
| `public/assets/site.css` | 设计 token 与组件 |
| `public/assets/site.js` | 主题控件与复制按钮 |
| `scripts/check.mjs` | 构建期检查缺键、占位符与渲染错误 |
| `scripts/preview.mjs` | 用假 ISO 数据做本地预览 |

## 增加一门语言

在 `src/i18n.js` 的 `LOCALES` 加一项，补一份键相同的消息目录，再到 `src/content-about.js` 补一份说明正文。指回落地页的链接必须用 `@@HOME@@` 占位符，不能写死 `/`。改完运行 `npm run check` 确认没有遗漏。

## 设计规则

[DESIGN.md](DESIGN.md) 记录设计语言与每条规则的原因。改样式之前先读它。

## 许可

[MIT](LICENSE) © Gentoo 中文社区。
