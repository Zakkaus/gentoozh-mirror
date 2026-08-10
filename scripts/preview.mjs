// 本地预览：node scripts/preview.mjs [outdir]
//
// 与线上共用 render.js，只有 ISO 数据是假的。要连真实镜像站列表与边缘缓存，用 wrangler dev。

import { mkdirSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALES } from '../src/i18n.js';
import { renderIndex, renderAbout } from '../src/render.js';
import { MIRRORS } from '../src/mirrors.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = process.argv[2] || join(root, 'dist');

// 假数据，形状同 readIsos 的返回值。
const ISO = {
  latest: {
    key: 'gig-os-20260728.iso',
    size: '4.7 GB',
    date: '2026-07-28',
    sha256: '9f2b41c8e0a7d365b18f4c2a90de77315caa6b0e4d81f9c37a25e6b8043fd192',
    md5: 'c41d8fa3b57e29604bc0d5f1a8e73b62',
  },
  // 三种同步状态轮着给，一次预览就能看到全部三种行的样子。
  mirrors: MIRRORS.map((m, i) => ({ ...m, state: ['ready', 'behind', 'unknown'][i % 3] })),
};

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(root, 'public'), out, { recursive: true });

let n = 0;
for (const l of LOCALES) {
  const dir = l.path === '/' ? out : join(out, l.path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), renderIndex(l.code, ISO));
  // 线上 /about 无扩展名，本地用目录加 index.html 模拟同一 URL。
  mkdirSync(join(dir, 'about'), { recursive: true });
  writeFileSync(join(dir, 'about', 'index.html'), renderAbout(l.code));
  n += 2;
}

console.log(`${n} 份文档 → ${out}`);
for (const l of LOCALES) console.log(`  ${l.path.padEnd(8)} ${l.name}`);
