// 渲染一份完整文档。Worker、本地预览、构建体检共用这里，输出字节一致。
// 设计规则的原因在 DESIGN.md。

import { LOCALES, DEFAULT_LOCALE, t } from './i18n.js';
import { ABOUT } from './content-about.js';
import { icon } from './icons.js';

const MIRROR_BASE = 'https://distfiles.gentoozh.org/gigos';
const SITE = 'https://iso.gentoozh.org';

export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));


// 主题在首帧之前定下，避免闪一下再翻色。语言在路径里，不需要脚本。
const EARLY = `(function(){try{var t=localStorage.getItem('mirror-theme');
if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

const THEME_ICON = { light: 'sun', dark: 'moon', system: 'monitor' };

const here = code => LOCALES.find(l => l.code === code) || LOCALES[0];
const pathIn = (code, page) => (page === 'about' ? here(code).path + 'about' : here(code).path);

function chrome(code, page) {
  const L = here(code);
  const langItems = LOCALES.map(l => {
    const cur = l.code === code ? ' aria-current="true"' : '';
    return `<a href="${pathIn(l.code, page)}" lang="${l.code}" hreflang="${l.code}"${cur}>${esc(l.name)}</a>`;
  }).join('');

  const themeItems = ['light', 'dark', 'system'].map(m =>
    `<button type="button" role="menuitemradio" aria-checked="false" data-mode="${m}">${icon(THEME_ICON[m])}<span>${esc(t(code, 'theme' + m[0].toUpperCase() + m.slice(1)))}</span></button>`
  ).join('');

  const other = page === 'about'
    ? `<a class="nav-link" href="${pathIn(code, 'index')}">${esc(t(code, 'navHome'))}</a>`
    : `<a class="nav-link" href="${pathIn(code, 'about')}">${esc(t(code, 'navAbout'))}</a>`;

  return `<a class="skip" href="#main">${esc(t(code, 'skip'))}</a>
<header class="nav">
  <div class="nav-inner">
    <a class="nav-brand" href="${L.path}">
      <img src="/assets/logo.webp" alt="" width="28" height="28">
      <span class="nav-title">${esc(t(code, 'brand'))}</span>
    </a>
    <nav class="nav-controls" aria-label="${esc(t(code, 'brand'))}">
      <a class="nav-link" href="https://distfiles.gentoozh.org/">${esc(t(code, 'navBinhost'))}</a>
      ${other}
      <details class="disclosure" data-lang-menu>
        <summary aria-label="${esc(t(code, 'lang'))}" title="${esc(t(code, 'lang'))}">${icon('languages')}</summary>
        <div>${langItems}</div>
      </details>
      <details class="disclosure" data-theme-menu hidden>
        <summary aria-label="${esc(t(code, 'theme'))}" title="${esc(t(code, 'theme'))}">${icon('monitor')}</summary>
        <div role="menu">${themeItems}</div>
      </details>
    </nav>
  </div>
</header>`;
}

function head(code, page, title, desc) {
  const L = here(code);
  const alts = LOCALES.map(l =>
    `<link rel="alternate" hreflang="${l.code}" href="${SITE}${pathIn(l.code, page)}">`
  ).join('\n');
  return `<!doctype html>
<html lang="${L.code}" dir="${L.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(t(code, 'brand'))}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${pathIn(code, page)}">
<meta property="og:image" content="${SITE}/assets/logo.webp">
<meta name="twitter:card" content="summary">
<link rel="icon" href="/assets/logo.webp">
<link rel="canonical" href="${SITE}${pathIn(code, page)}">
${alts}
<link rel="alternate" hreflang="x-default" href="${SITE}${pathIn(DEFAULT_LOCALE, page)}">
<link rel="stylesheet" href="/assets/site.css">
<script>${EARLY}</script>
</head>
<body>`;
}

const foot = code => `<footer class="foot">${t(code, 'footer')}</footer>
<div id="toast" role="status" aria-live="polite" data-copied="${esc(t(code, 'copied'))}"></div>
<script src="/assets/site.js" defer></script>
</body>
</html>`;

export function renderIndex(code, iso) {
  const T = k => t(code, k);
  const about = pathIn(code, 'about');
  const withAbout = s => s.split('@@ABOUT@@').join(about);

  // 可及名称带上要复制的值，否则四个按钮的读屏名称完全相同。
  const chip = (what, v) =>
    `<button type="button" class="copy" data-copy="${esc(v)}" aria-label="${esc(T('copyOf')(T(what), v))}">${esc(v)}</button>`;

  return head(code, 'index', T('docTitle'), T('docDesc')) + chrome(code, 'index') + `
<main class="wrap" id="main">
  <p class="eyebrow">${esc(T('eyebrow'))}</p>
  <h1 class="title">${esc(T('title'))}</h1>
  <p class="lead">${esc(T('lead'))}</p>

  <section class="build" aria-labelledby="build-label">
    <p class="build-label" id="build-label">${esc(T('buildLabel'))}</p>
    <p class="build-name">${esc(iso.latest.key)}</p>
    <p class="build-meta"><span>${esc(iso.latest.size)}</span><span>${esc(iso.latest.date)}</span><span>amd64</span></p>
    <a class="btn" href="${MIRROR_BASE}/${encodeURIComponent(iso.latest.key)}">${esc(T('download'))}</a>

    <div class="hashes">
      <div class="hash-row"><span class="hash-key">SHA256</span><span class="hash-val">${esc(iso.latest.sha256)}</span><a href="${MIRROR_BASE}/${encodeURIComponent(iso.latest.key)}.sha256">.sha256</a></div>
      <div class="hash-row"><span class="hash-key">MD5</span><span class="hash-val">${esc(iso.latest.md5)}</span><a href="${MIRROR_BASE}/${encodeURIComponent(iso.latest.key)}.md5">.md5</a></div>
      <p class="verify">${esc(T('verify'))}</p>
    </div>

    <div class="creds">
      <div class="creds-label">${esc(T('credsLabel'))}</div>
      <div class="creds-row">
        <span class="cred">${esc(T('credUser'))} ${chip('credUser', 'live')}</span>
        <span class="cred">${esc(T('credPass'))} ${chip('credPass', 'live')}</span>
      </div>
      <div class="creds-row">
        <span class="cred">${esc(T('credUser'))} ${chip('credUser', 'root')}</span>
        <span class="cred">${esc(T('credPass'))} ${chip('credPass', 'live')}</span>
      </div>
    </div>
  </section>

  <section class="req" aria-labelledby="req-title">
    <p class="req-title" id="req-title">${esc(T('reqTitle'))}</p>
    <div class="specs">
      <span class="spec">x86-64</span>
      <span class="spec">AVX2</span>
      <span class="spec">${esc(T('specCpu'))}</span>
      <span class="spec">UEFI / BIOS</span>
    </div>
    <p class="req-body">${T('req')}</p>
  </section>

  <div class="features">
    <section class="feature">
      <h2>${esc(T('featZfsTitle'))}</h2>
      <p>${withAbout(T('featZfs'))}</p>
    </section>
    <section class="feature">
      <h2>${esc(T('featNvTitle'))}</h2>
      <p>${withAbout(T('featNv'))}</p>
    </section>
  </div>

  <section class="builds" aria-labelledby="builds-label">
    <div class="builds-label" id="builds-label">${esc(T('allver'))}</div>
    <p class="builds-body"><a href="${MIRROR_BASE}/">${esc(T('allverLink'))}</a></p>
  </section>
</main>
` + foot(code);
}

export function renderAbout(code) {
  const T = k => t(code, k);
  // 正文用 @@HOME@@ 占位，在这里换成本语言首页；写死 / 会让非简体读者掉回简体页。
  const body = ABOUT[code].split('@@HOME@@').join(here(code).path);
  return head(code, 'about', T('aboutTitle') + ' · ' + T('brand'), T('aboutDesc')) +
    chrome(code, 'about') +
    `\n<main class="wrap prose" id="main">\n${body}\n</main>\n` + foot(code);
}
