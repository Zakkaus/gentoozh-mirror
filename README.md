# gigos-mirror

[iso.gentoozh.org](https://iso.gentoozh.org/) 的源码,Gentoo 中文社区 Live ISO 下载站的落地页与使用说明页。

## 文件

- `src/index.js`:Worker 入口。`/` 读 R2 列出最新与历史版本,其余路径走静态资产。
- `templates/index.html`:落地页模板,占位符由 Worker 填充。
- `public/about.html`:使用说明页,含简体、繁体、英文三份。
- `public/assets/`:logo 与 `i18n.js`。
- `wrangler.toml`:Worker 配置,绑定 R2 桶。

## 部署

推送到 `main` 即部署。Cloudflare Workers 从本仓库构建,构建命令为 `npx wrangler deploy`。

`iso.gentoozh.org` 与 `mirror.gentoozh.org` 同时绑定到这个 Worker,因为旧域名仍有外部链接指向,所以保留不摘。ISO 文件本身由 R2 的自定义域 `r2.gentoozh.org` 提供。

构建状态推送至 <https://t.me/gentoomirror>。
