// 图标：lucide 0.456.0，ISC。几何原样抄自上游，没有手改。
//
// 上一版这四个是手画的。手画的代价 icons.md §9 讲得很清楚，而且这里全中：几何没有任何
// 上游可以对回去、笔画粗细谁都查不出对不对、换一个图就得再画一次。语言那个尤其明显——
// 手画版本和 lucide 的 languages 根本不是一个字形。
//
// 抄的时候记下来源：lucide-react 0.456.0，`dist/esm/icons/<name>.js` 里的 d 串。
// 升级 lucide 时按名字对一遍这几串，改了就改这里。
//
// 一套契约：24 网格、fill=none、stroke=currentColor、stroke-width=2、round 帽与接。
// 尺寸由容器给，不写死在 svg 上——icons.md §5。

const SET = { name: 'lucide', version: '0.456.0', license: 'ISC' };

const PATHS = {
  // lucide `languages`
  languages: ['m5 8 6 6', 'm4 14 6-6 2-3', 'M2 5h12', 'M7 2h1', 'm22 22-5-10-5 10', 'M14 18h6'],
  // lucide `sun`
  sun: ['M12 2v2', 'M12 20v2', 'm4.93 4.93 1.41 1.41', 'm17.66 17.66 1.41 1.41', 'M2 12h2',
        'M20 12h2', 'm6.34 17.66-1.41 1.41', 'm19.07 4.93-1.41 1.41'],
  // lucide `moon`
  moon: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'],
};

// 圆与矩形不是路径，单独给：lucide 的 sun 有一个 circle，monitor 有一个 rect 加两条 line。
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

export { SET as ICON_SET };
