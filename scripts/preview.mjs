// 本地预览：node scripts/preview.mjs [outdir]
//
// 与线上共用 render.js，只有 ISO 数据是假的。要连真实镜像站列表与边缘缓存，用 wrangler dev。

import { mkdirSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALES } from '../src/i18n.js';
import { renderIndex, renderAbout } from '../src/render.js';
import { readBuilds } from '../src/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = process.argv[2] || join(root, 'dist');
// --live 读源站真实数据，与线上同一段代码；不加则用下面的假数据，离线也能出页面。
const live = process.argv.includes('--live');

// 假数据，形状同 readBuilds 的返回值。
const BUILDS = {
  desktop: {
    id: 'desktop', key: 'gig-os-20260807.iso', size: '4.1 GB', date: '2026-08-07',
    sha256: '9f2b41c8e0a7d365b18f4c2a90de77315caa6b0e4d81f9c37a25e6b8043fd192',
    files: 'https://distfiles.gentoozh.org/_raw/gigos',
  },
  minimal: {
    id: 'minimal', key: 'install-amd64-cjk-minimal-20260813T073053Z.iso', size: '943 MB', date: '2026-08-13',
    sha256: '7d0e58aa3680fe777cfa1b80e6f8a55df8af913e01ea17dd4f69f04591b68013',
    files: 'https://distfiles.gentoozh.org/_raw/gentoo-cjk-livecd/20260813T073053Z',
  },
};

const DATA = live ? await readBuilds() : BUILDS;

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(root, 'public'), out, { recursive: true });

let n = 0;
for (const l of LOCALES) {
  const dir = l.path === '/' ? out : join(out, l.path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), renderIndex(l.code, DATA));
  // 线上 /about 无扩展名，本地用目录加 index.html 模拟同一 URL。
  mkdirSync(join(dir, 'about'), { recursive: true });
  writeFileSync(join(dir, 'about', 'index.html'), renderAbout(l.code));
  n += 2;
}

console.log(`${n} 份文档 → ${out}`);
for (const l of LOCALES) console.log(`  ${l.path.padEnd(8)} ${l.name}`);
