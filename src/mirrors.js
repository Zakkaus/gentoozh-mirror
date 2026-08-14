// 镜像清单。加一个镜像：这里加一项，三份消息目录各补一条 nameKey；check.mjs 会拦下漏补的。
// 一律只给目录，不给单个文件的直链，因为镜像按计划同步，直链指向的那一版在镜像上可能还没有，
// 而目录里永远是该站当前实际有的几版。
//
// root 下按产品的 seg 分目录，两个产品共用同一批镜像，因此目录由 root 与 seg 拼出，不逐个写死。
// 源站另有 raw：/<seg>/ 是带壳页面，适合给读者点；校验和文件要走 /_raw/<seg>/。

export const MIRRORS = [
  { id: 'source', nameKey: 'mirrorSource', source: true, host: 'distfiles.gentoozh.org',
    root: 'https://distfiles.gentoozh.org',
    raw: 'https://distfiles.gentoozh.org/_raw',
    ls: 'https://distfiles.gentoozh.org/_ls' },
  { id: 'cernet', nameKey: 'mirrorCernet', host: 'mirrors.cernet.edu.cn',
    root: 'https://mirrors.cernet.edu.cn/gentoo-zh' },
  { id: 'nju', nameKey: 'mirrorNju', host: 'mirror.nju.edu.cn',
    root: 'https://mirror.nju.edu.cn/gentoo-zh' },
  { id: 'nyist', nameKey: 'mirrorNyist', host: 'mirror.nyist.edu.cn',
    root: 'https://mirror.nyist.edu.cn/gentoo-zh' },
  { id: 'hernet', nameKey: 'mirrorHernet', host: 'mirrors.ha.edu.cn',
    root: 'https://mirrors.ha.edu.cn/gentoo-zh' },
];

// 用标记取而不是取下标，位置调整不会把源站换成别人。
export const SOURCE = MIRRORS.find(m => m.source);

export const dirOf = (mirror, product) => `${mirror.root}/${product.seg}/`;
