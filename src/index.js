// iso.gentoozh.org 的 Worker 入口。路由表在 LOCALES。
// ISO 与校验和都在源站与各教育网镜像上，本体不经过 Worker。清单见 mirrors.js。

import { LOCALES, negotiate, t } from './i18n.js';
import { renderIndex, renderAbout } from './render.js';
import { MIRRORS, SOURCE } from './mirrors.js';

const CACHE_SECONDS = 60;
const MIRROR_LISTING = 'https://distfiles.gentoozh.org/_ls/gigos/';
// 探测结果比页面缓存久，同一个 PoP 反复渲染只探一次。
const PROBE_SECONDS = 600;
const PROBE_TIMEOUT_MS = 3000;

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
      let iso;
      try {
        iso = await readIsos();
      } catch {
        return new Response(t(route.locale.code, 'noIso'), {
          status: 503,
          headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
        });
      }
      body = renderIndex(route.locale.code, iso);
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

export const dateFromKey = key => {
  const m = key.match(/^gig-os-(\d{4})(\d{2})(\d{2})\.iso$/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : '';
};

async function fetchJson(url) {
  const r = await fetch(url, { cf: { cacheTtl: 60 } });
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  return r.json();
}

// 校验和文件是 sha256sum 的输出，第一个字段是摘要。无法取得时留空，页面照常渲染。
async function firstToken(name) {
  const r = await fetch(`${SOURCE.base}/${encodeURIComponent(name)}`, { cf: { cacheTtl: 60 } });
  if (!r.ok) return '';
  return (await r.text()).trim().split(/\s+/)[0] || '';
}

// 镜像按计划同步，最新一版可能还没到，所以逐个取镜像上的 .sha256 与源站比对。
// 三种结果分开：相等是 ready，文件不存在是 behind，网络失败或源站校验和缺失是 unknown。
// unknown 不能并进 behind，那等于替镜像断言一件没测到的事。
async function mirrorState(m, name, sha256) {
  if (m.source) return 'ready';
  if (!sha256) return 'unknown';
  try {
    const r = await fetch(`${m.base}/${encodeURIComponent(name)}.sha256`, {
      cf: { cacheTtl: PROBE_SECONDS, cacheEverything: true },
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });
    if (r.status === 404) return 'behind';
    if (!r.ok) return 'unknown';
    return (await r.text()).trim().split(/\s+/)[0] === sha256 ? 'ready' : 'behind';
  } catch {
    return 'unknown';
  }
}

export async function readIsos() {
  // 镜像站列表来自 nginx autoindex_format json，字段为 name / type / size / mtime。
  const listed = await fetchJson(MIRROR_LISTING);
  const isos = listed
    .filter(o => o.type === 'file' && /^gig-os-\d{8}\.iso$/.test(o.name))
    .sort((a, b) => (a.name < b.name ? 1 : a.name > b.name ? -1 : 0));   // 由新到旧

  if (isos.length === 0) throw new Error('no iso on the mirror');

  const latest = isos[0];
  const [sha256, md5] = await Promise.all([
    firstToken(latest.name + '.sha256'),
    firstToken(latest.name + '.md5'),
  ]);

  const states = await Promise.all(MIRRORS.map(m => mirrorState(m, latest.name, sha256)));

  return {
    latest: { key: latest.name, size: fmtSize(latest.size), date: dateFromKey(latest.name), sha256, md5 },
    mirrors: MIRRORS.map((m, i) => ({ ...m, state: states[i] })),
  };
}
