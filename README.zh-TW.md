# gigos-mirror

[简体中文](README.md) · [正體中文](README.zh-TW.md) · [English](README.en.md)

[iso.gentoozh.org](https://iso.gentoozh.org/) 的 Cloudflare Worker，Gentoo 中文社群 Live ISO 的下載站。
它在邊緣讀取鏡像站的目錄列表取當前版本，並按語言各算繪一份完整文件。

## 路由

三種語言六份文件，全部在邊緣算繪。沒有執行期換字：語言在路徑裡，文字在標記裡，`lang` 從第一個位元組就是對的。

| 語言 | 下載頁 | 使用說明 |
|---|---|---|
| 簡體中文 | `/` | `/about` |
| 正體中文 | `/zh-tw/` | `/zh-tw/about` |
| 英文 | `/en/` | `/en/about` |

未知路徑重新導向到讀者所用語言的下載頁。這是全站唯一讀取 `Accept-Language` 的地方，因為已經指名語言的連結不應隨開啟它的人的瀏覽器變化。

ISO 與校驗和都在鏡像站 `distfiles.gentoozh.org/gigos/`，不經過 Worker。舊網域 `r2.gentoozh.org` 已 301 到那裡。

## 環境需求

Node.js 與 `npx`。部署需要能發布該 Worker 的 Cloudflare 帳號，本機預覽不需要。

## 本機預覽

```bash
npm run check                                # 檢查翻譯與算繪
node scripts/preview.mjs                     # 六份文件寫入 dist/
cd dist && python3 -m http.server 8721
```

預覽與線上共用 `src/render.js`，除 ISO 資料是假的以外，位元組與正式環境一致。要連真實的鏡像站列表與邊緣快取，改用 `npm run dev`。

## 部署

推送到 `main` 觸發 Cloudflare Workers Builds。從本機部署用 `npm run deploy`，它會先執行檢查，未通過就停止。

`iso.gentoozh.org` 與 `mirror.gentoozh.org` 都指向這個 Worker，舊網域因為仍有外部連結指向而保留。建置通知發往 [Telegram @gentoomirror](https://t.me/gentoomirror)。

## 目錄

| 路徑 | 內容 |
|---|---|
| `src/index.js` | Worker 進入點：路由、邊緣快取、讀鏡像站列表 |
| `src/render.js` | 文件算繪，Worker、預覽與檢查共用 |
| `src/i18n.js` | 語言表與三份訊息目錄 |
| `src/content-about.js` | 說明頁正文，一種語言一份 |
| `src/icons.js` | 圖示幾何，原樣取自 lucide 0.456.0 |
| `public/assets/site.css` | 設計 token 與元件 |
| `public/assets/site.js` | 主題控制項與複製按鈕 |
| `scripts/check.mjs` | 建置期檢查缺鍵、佔位符與算繪錯誤 |
| `scripts/preview.mjs` | 用假 ISO 資料做本機預覽 |

## 新增一種語言

在 `src/i18n.js` 的 `LOCALES` 加一項，補一份鍵相同的訊息目錄，再到 `src/content-about.js` 補一份說明正文。指回下載頁的連結必須用 `@@HOME@@` 佔位符，不能寫死 `/`。改完執行 `npm run check` 確認沒有遺漏。

## 設計規則

[DESIGN.md](DESIGN.md) 記錄設計語言與每條規則的原因。改樣式之前先讀它。

## 授權

[MIT](LICENSE) © Gentoo 中文社群。
