// 构建期检查：npm run check
//
// 最后一步用 render.js 渲染全部文档，运行期缺键抛出的同一条异常在此先触发。

import { LOCALES, DEFAULT_LOCALE, MESSAGES } from '../src/i18n.js';
import { ABOUT } from '../src/content-about.js';
import { renderIndex, renderAbout } from '../src/render.js';

const problems = [];
const fail = m => problems.push(m);

// 假数据，形状同 readIsos 的返回值。
const ISO = {
  latest: { key: 'gig-os-20260728.iso', size: '4.7 GB', date: '2026-07-28', sha256: 'f'.repeat(64), md5: 'f'.repeat(32) },
};

for (const l of LOCALES) {
  if (!MESSAGES[l.code]) fail(`${l.code}: 没有消息目录`);
  if (!ABOUT[l.code]) fail(`${l.code}: 没有说明页正文`);
}

// 键集合以默认语言为准，多余与缺失都报。
const expected = Object.keys(MESSAGES[DEFAULT_LOCALE]).sort();
for (const l of LOCALES) {
  const m = MESSAGES[l.code];
  if (!m) continue;
  const got = Object.keys(m).sort();
  for (const k of expected) if (!got.includes(k)) fail(`${l.code}: 缺键 ${k}`);
  for (const k of got) if (!expected.includes(k)) fail(`${l.code}: 多出键 ${k}（${DEFAULT_LOCALE} 里没有）`);
  // copyOf 一类函数值必须各语言同型，否则调用点抛 TypeError。
  for (const k of expected) {
    if (!got.includes(k)) continue;
    const a = typeof MESSAGES[DEFAULT_LOCALE][k];
    const b = typeof m[k];
    if (a !== b) fail(`${l.code}: ${k} 是 ${b}，${DEFAULT_LOCALE} 里是 ${a}`);
  }
}

// 说明正文不得写死 /，指回落地页一律用 @@HOME@@。
for (const l of LOCALES) {
  const body = ABOUT[l.code];
  if (!body) continue;
  const hard = body.match(/href="\/"/g);
  if (hard) fail(`${l.code}: 说明正文有 ${hard.length} 处写死的 href="/"，应改用 @@HOME@@`);
}

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
      if (out.includes(ph)) fail(`${l.code} ${page}: 渲染后仍有 ${ph}`);
    }
    if (out.includes('undefined')) fail(`${l.code} ${page}: 输出里出现 undefined`);
  }
}

if (problems.length) {
  console.error(`检查未通过，${problems.length} 条：`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`检查通过：${LOCALES.length} 种语言 × 2 页，键集合一致，无残留占位符。`);
