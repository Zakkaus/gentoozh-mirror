// iso.gentoozh.org,Cloudflare Worker
//
// 三条语言路径，每条两页，全在边缘渲染成完整文档：
//   /            /about            简体
//   /zh-tw/      /zh-tw/about      繁体
//   /en/         /en/about         英文
//
// ISO 数据（最新一份 + 全部历史 + 校验和）在边缘读 R2，下载链接指向 R2 自定义域
// r2.gentoozh.org（零出口流量、可缓存）。/assets/* 走静态资产。
//
// 绑定见 wrangler.toml：BUCKET = R2（只读）、ASSETS = 静态资产。无任何密钥。

import { LOCALES, negotiate, t } from './i18n.js';
import { renderIndex, renderAbout } from './render.js';

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

    // 抗 CC：渲染好的页面在边缘缓存 60 秒。被洪水般刷时，每 60 秒只有第一个请求真读 R2
    // 并渲染，其余全是边缘缓存命中。缓存键带语言，三份文档各缓各的。
    const cache = caches.default;
    const key = new Request(new URL(pathOf(route), url), { method: 'GET' });
    const hit = await cache.match(key);
    if (hit) return hit;

    let body;
    if (route.page === 'about') {
      // 说明页不碰 R2，渲染不该被兜进「暂无 ISO」里：那样一个缺翻译的 bug 会被
      // 伪装成没有镜像，看日志的人往桶里找问题。让它照常 500，错在哪就报哪。
      body = renderAbout(route.locale.code);
    } else {
      let iso;
      try {
        iso = await readIsos(env);
      } catch (err) {
        // 读 R2 失败或还没有 ISO：给一句读得懂的话，并且不缓存，下一次请求要重试。
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
    // 同一个 URL 对所有人发同一份字节：语言由路径决定，不由 Accept-Language 决定，
    // 否则边缘缓存会按 header 裂成好几份。
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

// 未知路径：送到读者自己语言的首页，而不是丢一个英文 404。
// 只有这里用 Accept-Language，而且只决定「没指名时去哪一份」，不改已指名的链接。
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

async function firstToken(env, key) {
  const o = await env.BUCKET.get(key);
  if (!o) return '';
  return (await o.text()).trim().split(/\s+/)[0] || '';
}

export async function readIsos(env) {
  // 单页最多 1000 个 key。发布脚本按 R2_KEEP 只留最近几版，离这个数很远，
  // 所以不翻页；哪天桶里真堆到上千个 ISO，这里要先加 cursor 再谈别的。
  const listed = await env.BUCKET.list({ prefix: 'gig-os-' });
  const isos = (listed.objects || [])
    .filter(o => /^gig-os-\d{8}\.iso$/.test(o.key))
    .sort((a, b) => (a.key < b.key ? 1 : a.key > b.key ? -1 : 0));   // 新 → 旧

  if (isos.length === 0) throw new Error('no iso in bucket');

  const latest = isos[0];
  const [sha256, md5] = await Promise.all([
    firstToken(env, latest.key + '.sha256'),
    firstToken(env, latest.key + '.md5'),
  ]);

  return {
    latest: { key: latest.key, size: fmtSize(latest.size), date: dateFromKey(latest.key), sha256, md5 },
    builds: isos.map(o => ({ key: o.key, size: fmtSize(o.size), date: dateFromKey(o.key) })),
  };
}
