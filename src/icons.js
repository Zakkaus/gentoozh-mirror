// 图标几何原样取自 lucide-react 0.456.0（ISC）的 `dist/esm/icons/<name>.js`，未手改。
// 升级 lucide 时按名字逐条比对 d 串。

const SET = { name: 'lucide', version: '0.456.0', license: 'ISC' };

const PATHS = {
  languages: ['m5 8 6 6', 'm4 14 6-6 2-3', 'M2 5h12', 'M7 2h1', 'm22 22-5-10-5 10', 'M14 18h6'],
  sun: ['M12 2v2', 'M12 20v2', 'm4.93 4.93 1.41 1.41', 'm17.66 17.66 1.41 1.41', 'M2 12h2',
        'M20 12h2', 'm6.34 17.66-1.41 1.41', 'm19.07 4.93-1.41 1.41'],
  moon: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'],
};

// circle、rect、line 不是 path，单独列出。
const EXTRA = {
  sun: '<circle cx="12" cy="12" r="4"/>',
  monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
};

export function icon(name) {
  const d = (PATHS[name] || []).map(p => `<path d="${p}"/>`).join('');
  const extra = EXTRA[name] || '';
  if (!d && !extra) throw new Error(`no icon: ${name} (set ${SET.name} ${SET.version})`);
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ` +
         `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${extra}${d}</svg>`;
}
