# gigos-mirror

[iso.gentoozh.org](https://iso.gentoozh.org/) 的源码,Gentoo 中文社区 Live ISO 下载站的落地页和使用说明页。

## 文件

- `src/index.js` — Worker。`/` 读 R2 列出最新和历史版本,其余路径走静态资产。
- `templates/index.html` — 落地页模板,里面的占位符由 Worker 填。
- `public/about.html` — 使用说明页,简繁英三份。
- `public/assets/` — logo 和 i18n.js。
- `wrangler.toml` — Worker 配置,绑定 R2 桶。

## 部署

推到 main 即部署。Cloudflare Workers 直接从本仓库构建,命令 `npx wrangler deploy`。

域名:`iso.gentoozh.org` 与旧的 `mirror.gentoozh.org` 都绑在这个 Worker 上,旧链接继续可用;
`r2.gentoozh.org` 是 R2 的 Custom Domains,ISO 文件本身从那里下载。

构建状态推送在 <https://t.me/gentoomirror>。
