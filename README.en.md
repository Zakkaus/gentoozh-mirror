# gigos-mirror

[简体中文](README.md) · [正體中文](README.zh-TW.md) · [English](README.en.md)

Cloudflare Worker serving [iso.gentoozh.org](https://iso.gentoozh.org/), the download site for the
Gentoo-zh Community Live ISO. It reads the mirror's directory listing at the edge to find the current
build, and renders one complete document per language.

## Routes

Six documents, three languages, all rendered at the edge. There is no runtime text swapping: the
language is in the path and the text is in the markup, so `lang` is correct from the first byte.

| Language | Landing page | Usage guide |
|---|---|---|
| Simplified Chinese | `/` | `/about` |
| Traditional Chinese | `/zh-tw/` | `/zh-tw/about` |
| English | `/en/` | `/en/about` |

An unknown path is redirected to the landing page of the reader's language. That is the only place
`Accept-Language` is read, because a link that already names its language must not follow the
browser of whoever opens it.

The ISO and its checksums live on the mirror at `distfiles.gentoozh.org/gigos/` and never pass through
the Worker. The old `r2.gentoozh.org` redirects there with a 301.

## Requirements

Node.js and `npx`. Deployment needs a Cloudflare account that can publish the Worker; the local
preview does not.

## Preview locally

```bash
npm run check                                # translations and rendering
node scripts/preview.mjs                     # writes six documents to dist/
cd dist && python3 -m http.server 8721
```

The preview uses the same `src/render.js` the edge uses, so the bytes match production except for
the ISO data, which is fake. To exercise the real mirror listing and the edge cache, run `npm run dev`.

## Deploy

Pushing to `main` triggers Cloudflare Workers Builds. To deploy from a workstation, run
`npm run deploy`, which runs the checks first and stops on failure.

`iso.gentoozh.org` and `mirror.gentoozh.org` both resolve to this Worker; the older name is kept
because external links still point at it. Build notifications go to
[Telegram @gentoomirror](https://t.me/gentoomirror).

## Layout

| Path | Contents |
|---|---|
| `src/index.js` | Worker entry: routing, edge cache, mirror listing |
| `src/render.js` | Document rendering, shared by the Worker, the preview and the checks |
| `src/i18n.js` | Locale table and the three message catalogues |
| `src/content-about.js` | Usage-guide body, one per language |
| `src/icons.js` | Icon geometry taken verbatim from lucide 0.456.0 |
| `public/assets/site.css` | Design tokens and components |
| `public/assets/site.js` | Theme control and copy buttons |
| `scripts/check.mjs` | Build-time check for missing keys, placeholders and render errors |
| `scripts/preview.mjs` | Local preview with fake ISO data |

## Adding a language

Add an entry to `LOCALES` in `src/i18n.js`, add a message catalogue with the same keys, and add a
usage-guide body to `src/content-about.js`. Links back to the landing page must use the `@@HOME@@`
placeholder rather than a literal `/`. Run `npm run check` to confirm nothing is missing.

## Design rules

[DESIGN.md](DESIGN.md) records the design language and the reason behind each rule. Read it before
changing the stylesheet.

## Licence

[MIT](LICENSE) © Gentoo-zh Community.
