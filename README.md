# gigos-mirror

[iso.gentoozh.org](https://iso.gentoozh.org/) 的源码，Gentoo 中文社区 Live ISO 下载站。

设计语言在 [DESIGN.md](DESIGN.md)。改样式之前先改那份——每条规则都带着它的原因。

## 路由

一种语言一份完整文档，全部在边缘渲染。没有运行期换字：语言在路径里，文本在标记里。

| | 落地页 | 使用说明 |
|---|---|---|
| 简体 | `/` | `/about` |
| 繁体 | `/zh-tw/` | `/zh-tw/about` |
| 英文 | `/en/` | `/en/about` |

未知路径按 `Accept-Language` 送到对应语言的首页。**只有这一处**用到该头：已经指名语言的链接不受它影响，
否则分享出去的链接会跟着收链接那个人的浏览器跑。

## 文件

- `src/index.js` — Worker 入口：路由、边缘缓存、读 R2。
- `src/render.js` — 渲染。Worker 与本地预览走同一个函数。
- `src/i18n.js` — 语言表与三份消息目录。缺键在渲染时就抛，不会在页面上显示 undefined。
- `src/content-about.js` — 说明页正文，一份一种语言。
- `src/icons.js` — 图标，lucide 0.456.0 原样抄入，附版本与授权。
- `public/assets/site.css` — token 层与组件。
- `public/assets/site.js` — 主题控件与复制。语言不需要脚本。
- `scripts/preview.mjs` — 本地预览，用假 ISO 数据渲染出六份文档。

## 本地看

```bash
node scripts/preview.mjs           # → dist/
cd dist && python3 -m http.server 8721
```

看到的字节和边缘发出去的一致，只有 ISO 那几个值是假的。R2 与边缘缓存要 `npx wrangler dev`。

## 部署

推送到 `main` 即部署，构建命令 `npx wrangler deploy`。

`iso.gentoozh.org` 与 `mirror.gentoozh.org` 同时绑定到这个 Worker，旧域名仍有外部链接指向所以保留。
ISO 文件本身由 R2 的自定义域 `r2.gentoozh.org` 提供。构建状态推送至 <https://t.me/gentoomirror>。
