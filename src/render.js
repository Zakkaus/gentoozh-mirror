// 渲染一份完整文档。Worker、本地预览、构建体检共用这里，输出字节一致。
// 设计规则的原因在 DESIGN.md。

import { LOCALES, DEFAULT_LOCALE, t } from './i18n.js';
import { ABOUT } from './content-about.js';
import { icon } from './icons.js';
import { MIRRORS, SOURCE, dirOf } from './mirrors.js';
import { PRODUCTS } from './products.js';

const SITE = 'https://iso.gentoozh.org';

export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// 主题在首帧之前定下，避免渲染后再翻色闪烁。语言在路径里，不需要脚本。
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

// 每一行只指向该站目录。可及名称带上站名与产品，否则十个链接的读屏名称只有五种。
function mirrorRow(code, m, p) {
  const site = t(code, m.nameKey);
  return `      <li class="mirror">
        <span class="mirror-name">${esc(site)}</span>
        <span class="mirror-meta"><span class="mirror-host">${esc(m.host)}</span></span>
        <a class="mirror-go" href="${dirOf(m, p)}" aria-label="${esc(t(code, 'mirrorBrowseOf')(site))}">${esc(t(code, 'mirrorBrowse'))}</a>
      </li>`;
}

// 切换条在每个面板里各渲染一份，当前项由服务端标好。只有被选中的面板可见，因此看到的那份
// 永远是对的，切换状态不必用 CSS 表达，也就没有按 id 逐项写死的样式。
function switcher(code, current) {
  const items = PRODUCTS.map(p => {
    const cur = p.id === current ? ' aria-current="true"' : '';
    return `<a href="#panel-${p.id}"${cur}>${esc(t(code, p.nameKey))}</a>`;
  }).join('');
  return `      <nav class="switch" aria-label="${esc(t(code, 'pick'))}">${items}</nav>`;
}

function hashRows(code, p, b) {
  return p.hashes.map((h, i) => {
    const href = `${b.files}/${encodeURIComponent(b.key)}${h.ext}`;
    // 只有第一个校验和文件内联显示摘要，其余给链接：最小版的 .DIGESTS 里是四条，展不开。
    const val = i === 0 ? `<span class="hash-val">${esc(b.sha256)}</span>` : '';
    return `      <div class="hash-row"><span class="hash-key">${esc(h.label)}</span>${val}<a href="${href}">${esc(h.ext)}</a></div>`;
  }).join('\n');
}

function buildCard(code, p, b, inner) {
  const T = k => t(code, k);
  return `    <section class="build" aria-labelledby="build-${p.id}">
      <p class="build-label" id="build-${p.id}">${esc(T('buildLabel'))}</p>
      <p class="build-name">${esc(b.key)}</p>
      <p class="build-meta"><span>${esc(b.size)}</span><span>${esc(b.date)}</span><span>amd64</span></p>
      <a class="btn" href="#mirrors-${p.id}">${esc(T('download'))}</a>

      <div class="hashes">
${hashRows(code, p, b)}
        <p class="verify">${esc(T('verify'))}</p>
      </div>
${inner}
    </section>`;
}

function mirrorsSection(code, p, b) {
  const T = k => t(code, k);
  return `    <section class="mirrors" id="mirrors-${p.id}" aria-labelledby="mirrors-${p.id}-title">
      <h2 class="mirrors-title" id="mirrors-${p.id}-title">${esc(T('mirrorTitle'))}</h2>
      <p class="mirrors-lead">${T('mirrorLead')(`<code class="build-chip">${esc(b.key)}</code>`)}</p>
      <ul class="mirror-list">
${MIRRORS.map(m => mirrorRow(code, m, p)).join('\n')}
      </ul>
    </section>`;
}

function desktopPanel(code, p, b) {
  const T = k => t(code, k);
  const about = pathIn(code, 'about');
  const withAbout = s => s.split('@@ABOUT@@').join(about);

  // 可及名称带上待复制的值，否则四个按钮的读屏名称完全相同。
  const chip = (what, v) =>
    `<button type="button" class="copy" data-copy="${esc(v)}" aria-label="${esc(T('copyOf')(T(what), v))}">${esc(v)}</button>`;

  const creds = `
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
      </div>`;

  return `${switcher(code, p.id)}
    <p class="panel-lead">${esc(T(p.leadKey))}</p>
${buildCard(code, p, b, creds)}

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

${mirrorsSection(code, p, b)}

    <section class="builds" aria-labelledby="builds-${p.id}">
      <div class="builds-label" id="builds-${p.id}">${esc(T('allver'))}</div>
      <p class="builds-body"><a href="${SOURCE.root}/${p.seg}/">${esc(T('allverLink'))}</a></p>
    </section>`;
}

function minimalPanel(code, p, b) {
  const T = k => t(code, k);
  return `${switcher(code, p.id)}
    <p class="panel-lead">${esc(T(p.leadKey))}</p>
${buildCard(code, p, b, '')}

    <section class="req" aria-labelledby="diff-title">
      <p class="req-title" id="diff-title">${esc(T('minDiffTitle'))}</p>
      <ol class="diffs">
        <li>${T('minDiff1')}</li>
        <li>${T('minDiff2')}</li>
        <li>${T('minDiff3')}</li>
      </ol>
      <p class="req-body">${esc(T('minRest'))}</p>
    </section>

${mirrorsSection(code, p, b)}

    <section class="builds" aria-labelledby="builds-${p.id}">
      <div class="builds-label" id="builds-${p.id}">${esc(T('allver'))}</div>
      <p class="builds-body"><a href="${SOURCE.root}/${p.seg}/">${esc(T('allverLink'))}</a>
        · <a href="${p.releases}">${esc(T('releasesLink'))}</a></p>
    </section>`;
}

const PANEL = { desktop: desktopPanel, minimal: minimalPanel };

export function renderIndex(code, builds) {
  const T = k => t(code, k);
  // 未找到构建的产品整段不渲染，切换条里也不会出现它。
  const shown = PRODUCTS.filter(p => builds[p.id]);

  const panels = shown.map(p => `  <section class="panel" id="panel-${p.id}" aria-labelledby="panel-${p.id}-h">
    <h2 class="vh" id="panel-${p.id}-h">${esc(T(p.nameKey))}</h2>
${PANEL[p.id](code, p, builds[p.id])}
  </section>`).join('\n\n');

  return head(code, 'index', T('docTitle'), T('docDesc')) + chrome(code, 'index') + `
<main class="wrap" id="main">
  <p class="eyebrow">${esc(T('eyebrow'))}</p>
  <h1 class="title">${esc(T('title'))}</h1>
  <p class="lead">${esc(T('lead'))}</p>

  <div class="panels">
${panels}
  </div>
</main>
` + foot(code);
}

export function renderAbout(code) {
  const T = k => t(code, k);
  // 正文用 @@HOME@@ 占位，在此换成本语言首页；写死 / 会让非简体读者退回简体页。
  const body = ABOUT[code].split('@@HOME@@').join(here(code).path);
  return head(code, 'about', T('aboutTitle') + ' · ' + T('brand'), T('aboutDesc')) +
    chrome(code, 'about') +
    `\n<main class="wrap prose" id="main">\n${body}\n</main>\n` + foot(code);
}
