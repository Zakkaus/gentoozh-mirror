// mirror.gentoozh.org,Cloudflare Worker
// 落地页 `/` 在边缘即时读 R2(gentoozh 桶)渲染:最新 ISO + 全部历史版本;
// 下载链接指向 R2 自定义域 r2.gentoozh.org(零出口流量、可缓存)。
// about.html 与 /assets/* 走 Worker 静态资产(public/)。
//
// 绑定(见 wrangler.toml):BUCKET = R2(gentoozh,只读用)、ASSETS = 静态资产。
// 无任何密钥:R2 用原生 binding,不走 S3 token。

import TEMPLATE from "../templates/index.html";

const R2_BASE = "https://r2.gentoozh.org";

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname === "/index.html") {
      // 抗 CC 关键:把渲染好的首页在【边缘缓存】60s。被洪水般刷首页时,每 60s 只有第一个
      // 请求真读 R2(list + 2 个 get = 3 个 op)并渲染,其余全是边缘缓存命中(0 R2 op、0 渲染)。
      // 无论多少 IP 刷,首页的 R2 op 都焊在「每 60s 一次」,且攻击下首页照常在线。
      const cache = caches.default;
      const cacheKey = new Request(new URL("/", url), { method: "GET" });
      const hit = await cache.match(cacheKey);
      if (hit) return hit;
      const resp = await renderIndex(env);
      if (resp.status === 200) {
        const cached = new Response(resp.body, resp);
        cached.headers.set("cache-control", "public, max-age=60");
        ctx.waitUntil(cache.put(cacheKey, cached.clone()));
        return cached;
      }
      return resp; // 503(暂无 ISO)等不缓存
    }
    // 其余路径(/about.html、/assets/*)交给静态资产(Cloudflare 自动缓存)
    return env.ASSETS.fetch(request);
  },
};

function fmtSize(bytes) {
  const n = Number(bytes) || 0;
  const gb = n / (1024 ** 3);
  if (gb >= 1) return gb.toFixed(1) + " GB";
  return Math.round(n / (1024 ** 2)) + " MB";
}

function dateFromKey(key) {
  const m = key.match(/^gig-os-(\d{4})(\d{2})(\d{2})\.iso$/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : "";
}

async function firstToken(env, key) {
  const o = await env.BUCKET.get(key);
  if (!o) return "";
  const t = (await o.text()).trim();
  return t.split(/\s+/)[0] || "";
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );
}

async function renderIndex(env) {
  const listed = await env.BUCKET.list({ prefix: "gig-os-" });
  const isos = (listed.objects || [])
    .filter((o) => /^gig-os-\d{8}\.iso$/.test(o.key))
    .sort((a, b) => (a.key < b.key ? 1 : a.key > b.key ? -1 : 0)); // 新 → 旧

  if (isos.length === 0) {
    return new Response("尚无可用 ISO / No ISO available yet.", {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  }

  const latest = isos[0];
  const [sha, md5] = await Promise.all([
    firstToken(env, latest.key + ".sha256"),
    firstToken(env, latest.key + ".md5"),
  ]);

  const history = isos
    .map(
      (o) =>
        `      <tr><td class="f"><a href="${R2_BASE}/${encodeURIComponent(o.key)}">${esc(o.key)}</a></td>` +
        `<td class="s">${fmtSize(o.size)}</td><td class="d">${esc(dateFromKey(o.key))}</td></tr>`
    )
    .join("\n");

  const html = TEMPLATE
    .split("@@ISO_NAME@@").join(esc(latest.key))
    .split("@@ISO_SIZE@@").join(esc(fmtSize(latest.size)))
    .split("@@ISO_DATE@@").join(esc(dateFromKey(latest.key)))
    .split("@@ISO_SHA256@@").join(esc(sha))
    .split("@@ISO_MD5@@").join(esc(md5))
    .split("@@ISO_HISTORY@@").join(history);

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      // 落地页便宜、Worker 每次请求实时读 R2;仅给浏览器 60s 缓存,新盘上传后很快反映
      "cache-control": "public, max-age=60",
    },
  });
}
