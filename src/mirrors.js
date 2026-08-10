// 镜像清单。加一个镜像：这里加一项，三份消息目录各补一条 nameKey；check.mjs 会拦下漏补的。
// 一律只给目录，不给单个文件的直链，因为镜像按计划同步，直链指向的那一版在镜像上可能还没有，
// 而目录里永远是该站当前实际有的几版。
// 源站另有 base：/gigos/ 是带壳页面，适合给读者点；校验和文件要走 _raw/gigos/。

export const MIRRORS = [
  { id: 'source', nameKey: 'mirrorSource', source: true, host: 'distfiles.gentoozh.org',
    dir: 'https://distfiles.gentoozh.org/gigos/',
    base: 'https://distfiles.gentoozh.org/_raw/gigos' },
  { id: 'cernet', nameKey: 'mirrorCernet', host: 'mirrors.cernet.edu.cn',
    dir: 'https://mirrors.cernet.edu.cn/gentoo-zh/gigos/' },
  { id: 'nju', nameKey: 'mirrorNju', host: 'mirror.nju.edu.cn',
    dir: 'https://mirror.nju.edu.cn/gentoo-zh/gigos/' },
  { id: 'nyist', nameKey: 'mirrorNyist', host: 'mirror.nyist.edu.cn',
    dir: 'https://mirror.nyist.edu.cn/gentoo-zh/gigos/' },
  { id: 'hernet', nameKey: 'mirrorHernet', host: 'mirrors.ha.edu.cn',
    dir: 'https://mirrors.ha.edu.cn/gentoo-zh/gigos/' },
];

// 用标记取而不是取下标，位置调整不会把源站换成别人。
export const SOURCE = MIRRORS.find(m => m.source);
