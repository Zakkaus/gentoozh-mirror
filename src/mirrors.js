// 镜像清单。加一个镜像：这里加一项，三份消息目录各补一条 nameKey；check.mjs 会拦下漏补的。
// base 指到 gigos 目录本身，文件与目录页都从它拼出来。
// 源站的目录页要走 _raw，因为 /gigos/ 会落到源站自己的带壳页面而不是目录。

export const MIRRORS = [
  { id: 'source', nameKey: 'mirrorSource', source: true, host: 'distfiles.gentoozh.org',
    base: 'https://distfiles.gentoozh.org/_raw/gigos' },
  { id: 'cernet', nameKey: 'mirrorCernet', host: 'mirrors.cernet.edu.cn',
    base: 'https://mirrors.cernet.edu.cn/gentoo-zh/gigos' },
  { id: 'nju', nameKey: 'mirrorNju', host: 'mirror.nju.edu.cn',
    base: 'https://mirror.nju.edu.cn/gentoo-zh/gigos' },
  { id: 'nyist', nameKey: 'mirrorNyist', host: 'mirror.nyist.edu.cn',
    base: 'https://mirror.nyist.edu.cn/gentoo-zh/gigos' },
  { id: 'hernet', nameKey: 'mirrorHernet', host: 'mirrors.ha.edu.cn',
    base: 'https://mirrors.ha.edu.cn/gentoo-zh/gigos' },
];

// 用标记取而不是取下标，位置调整不会把源站换成别人。
export const SOURCE = MIRRORS.find(m => m.source);
