// 构建期体检：缺一个翻译键、少一份说明正文、漏一个占位符，在这里就炸，
// 而不是等线上某个语言的某一页 500。
//
//   node scripts/check.mjs
//
// 最后一步是把六份文档整个渲染一遍，走的是边缘那同一个 render.js，所以 t() 里
// 那条「缺键就抛」在这里一样会触发。

import { LOCALES, DEFAULT_LOCALE, MESSAGES } from '../src/i18n.js';
import { ABOUT } from '../src/content-about.js';
import { renderIndex, renderAbout } from '../src/render.js';

const problems = [];
const fail = m => problems.push(m);

// 假数据只为把渲染跑通，形状照着真桶里的样子。
const ISO = {
  latest: { key: 'gig-os-20260728.iso', size: '4.7 GB', date: '2026-07-28', sha256: 'f'.repeat(64), md5: 'f'.repeat(32) },
  builds: [{ key: 'gig-os-20260728.iso', size: '4.7 GB', date: '2026-07-28' }],
};

// 1. 每种语言都要有目录和说明正文
for (const l of LOCALES) {
  if (!MESSAGES[l.code]) fail(`${l.code}: 没有消息目录`);
  if (!ABOUT[l.code]) fail(`${l.code}: 没有说明页正文`);
}

// 2. 键集合以默认语言为准，多的少的都报
const expected = Object.keys(MESSAGES[DEFAULT_LOCALE]).sort();
for (const l of LOCALES) {
  const m = MESSAGES[l.code];
  if (!m) continue;
  const got = Object.keys(m).sort();
  for (const k of expected) if (!got.includes(k)) fail(`${l.code}: 缺键 ${k}`);
  for (const k of got) if (!expected.includes(k)) fail(`${l.code}: 多出键 ${k}（${DEFAULT_LOCALE} 里没有）`);
  // 函数值的键（如 copyOf）三种语言必须都是函数，否则调用点会 TypeError
  for (const k of expected) {
    if (!got.includes(k)) continue;
    const a = typeof MESSAGES[DEFAULT_LOCALE][k];
    const b = typeof m[k];
    if (a !== b) fail(`${l.code}: ${k} 是 ${b}，${DEFAULT_LOCALE} 里是 ${a}`);
  }
}

// 3. 说明正文里不许再写死 /：指回落地页要用 @@HOME@@，否则英文读者会掉进简体页
for (const l of LOCALES) {
  const body = ABOUT[l.code];
  if (!body) continue;
  const hard = body.match(/href="\/"/g);
  if (hard) fail(`${l.code}: 说明正文有 ${hard.length} 处写死的 href="/"，应改用 @@HOME@@`);
}

// 4. 六份文档全渲染一遍，并确认占位符都被换掉了
for (const l of LOCALES) {
  for (const [page, html] of [['index', () => renderIndex(l.code, ISO)], ['about', () => renderAbout(l.code)]]) {
    let out;
    try {
      out = html();
    } catch (err) {
      fail(`${l.code} ${page}: 渲染抛异常 ${err.message}`);
      continue;
    }
    for (const ph of ['@@HOME@@', '@@ABOUT@@']) {
      if (out.includes(ph)) fail(`${l.code} ${page}: 渲染后还留着 ${ph}`);
    }
    if (out.includes('undefined')) fail(`${l.code} ${page}: 输出里出现 undefined`);
  }
}

if (problems.length) {
  console.error(`体检不过，${problems.length} 条：`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`体检通过：${LOCALES.length} 种语言 × 2 页，键集合一致，无残留占位符。`);
