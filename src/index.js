// iso.gentoozh.org 的 Worker 入口。路由表在 LOCALES，发布的镜像清单在 products.js。
// ISO 与校验和都在源站与各教育网镜像上，本体不经过 Worker。

import { LOCALES, negotiate, t } from './i18n.js';
import { renderIndex, renderAbout } from './render.js';
import { SOURCE } from './mirrors.js';
import { PRODUCTS, dateOf } from './products.js';

const CACHE_SECONDS = 60;

export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/index\.html$/, '/');

    if (path.startsWith('/assets/')) return env.ASSETS.fetch(request);

    const route = routeOf(path);
    if (!route) return elsewhere(request);

    // 缓存键用规范化后的语言路径，不含查询串与 Accept-Language，同一个 URL 对所有人返回同一份字节。
    const cache = caches.default;
    const key = new Request(new URL(pathOf(route), url), { method: 'GET' });
    const hit = await cache.match(key);
    if (hit) return hit;

    let body;
    if (route.page === 'about') {
      // 说明页不读镜像站，因此不套用下面的 noIso 回退，渲染出错照常 500。
      body = renderAbout(route.locale.code);
    } else {
      let builds;
      try {
        builds = await readBuilds();
      } catch {
        return new Response(t(route.locale.code, 'noIso'), {
          status: 503,
          headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
        });
      }
      body = renderIndex(route.locale.code, builds);
    }

    const resp = new Response(body, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': `public, max-age=${CACHE_SECONDS}`,
      },
    });
    ctx.waitUntil(cache.put(key, resp.clone()));
    return resp;
  },
};

const pathOf = r => (r.page === 'about' ? r.locale.path + 'about' : r.locale.path);

function routeOf(path) {
  for (const l of LOCALES) {
    if (path === l.path) return { locale: l, page: 'index' };
    if (path === l.path + 'about' || path === l.path + 'about/') return { locale: l, page: 'about' };
  }
  return null;
}

// 全站唯一读 Accept-Language 的地方，只决定未知路径落到哪一份首页。
function elsewhere(request) {
  const code = negotiate(request.headers.get('accept-language'));
  const home = LOCALES.find(l => l.code === code).path;
  return new Response(null, { status: 302, headers: { location: home, 'cache-control': 'no-store' } });
}

export const fmtSize = bytes => {
  const n = Number(bytes) || 0;
  const gb = n / 1024 ** 3;
  return gb >= 1 ? gb.toFixed(1) + ' GB' : Math.round(n / 1024 ** 2) + ' MB';
};

async function fetchJson(url) {
  const r = await fetch(url, { cf: { cacheTtl: 60 } });
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  return r.json();
}

// 校验和文件的第一行可能是 `# SHA256 HASH` 这样的表头，最小版就带，因此按行找第一条以摘要
// 开头的，不能直接取整份文件的第一个字段。未找到摘要时留空，页面照常渲染。
function digestOf(text) {
  for (const line of text.split('\n')) {
    const m = line.trim().match(/^([0-9a-f]{32,128})\s/i);
    if (m) return m[1];
  }
  return '';
}

async function firstDigest(url) {
  const r = await fetch(url, { cf: { cacheTtl: 60 } });
  if (!r.ok) return '';
  return digestOf(await r.text());
}

// 列表来自 nginx autoindex_format json，字段为 name / type / size / mtime。
// flat 的文件平铺在 <seg>/，stamped 的每次构建一个时间戳子目录，文件在里面。
async function newestBuild(p) {
  const top = await fetchJson(`${SOURCE.ls}/${p.seg}/`);
  const newestFirst = (a, b) => (a.name < b.name ? 1 : a.name > b.name ? -1 : 0);

  if (p.layout === 'flat') {
    const f = top.filter(o => o.type === 'file' && p.file.test(o.name)).sort(newestFirst)[0];
    if (!f) throw new Error(`no iso in ${p.seg}`);
    return { name: f.name, size: f.size, path: p.seg };
  }

  const d = top.filter(o => o.type === 'directory' && /^\d{8}T\d{6}Z$/.test(o.name)).sort(newestFirst)[0];
  if (!d) throw new Error(`no build directory in ${p.seg}`);
  const inner = await fetchJson(`${SOURCE.ls}/${p.seg}/${d.name}/`);
  const f = inner.filter(o => o.type === 'file' && p.file.test(o.name)).sort(newestFirst)[0];
  if (!f) throw new Error(`no iso in ${p.seg}/${d.name}`);
  return { name: f.name, size: f.size, path: `${p.seg}/${d.name}` };
}

async function readProduct(p) {
  const b = await newestBuild(p);
  const files = `${SOURCE.raw}/${b.path}`;
  return {
    id: p.id,
    key: b.name,
    size: fmtSize(b.size),
    date: dateOf(b.name),
    sha256: await firstDigest(`${files}/${encodeURIComponent(b.name)}${p.hashes[0].ext}`),
    files,
  };
}

// 一个产品读失败不拖垮另一个，否则新加的产品改个目录名就能让整页 503。
// 渲染端跳过未找到构建的产品，两个都未找到才算整体失败。
export async function readBuilds() {
  const got = await Promise.all(PRODUCTS.map(p => readProduct(p).catch(() => null)));
  const builds = Object.fromEntries(got.filter(Boolean).map(b => [b.id, b]));
  if (Object.keys(builds).length === 0) throw new Error('no build on the mirror');
  return builds;
}
