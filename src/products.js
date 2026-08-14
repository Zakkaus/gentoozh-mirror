// 站上发布的两个镜像。加一个：这里加一项，三份消息目录各补 nameKey 与 leadKey；check.mjs 会拦。
//
// 两者在镜像站上的布局不同，用 layout 区分，不靠 id 判断：
//   flat    —— 文件平铺在 <seg>/ 下
//   stamped —— 每次构建一个 <seg>/<时间戳>/ 子目录，文件在里面
//
// hashes 列出该产品实际存在的校验和文件。第一项内联显示摘要，其余只给链接。
// 最小版没有 .md5，官方 releng 那套给的是 .DIGESTS（SHA512 与 BLAKE2B）。

export const PRODUCTS = [
  {
    id: 'desktop',
    nameKey: 'prodDesktop', leadKey: 'prodDesktopLead',
    seg: 'gigos',
    layout: 'flat',
    file: /^gig-os-\d{8}\.iso$/,
    hashes: [{ ext: '.sha256', label: 'SHA256' }, { ext: '.md5', label: 'MD5' }],
  },
  {
    id: 'minimal',
    nameKey: 'prodMinimal', leadKey: 'prodMinimalLead',
    seg: 'gentoo-cjk-livecd',
    layout: 'stamped',
    file: /^install-amd64-cjk-minimal-\d{8}T\d{6}Z\.iso$/,
    hashes: [{ ext: '.sha256', label: 'SHA256' }, { ext: '.DIGESTS', label: 'DIGESTS' }],
    releases: 'https://github.com/gentoo-zh/gentoo-cjk-livecd/releases',
  },
];

// 两种文件名都在开头带 YYYYMMDD，取第一段八位数字即可，不必各写一个规则。
export const dateOf = name => {
  const m = name.match(/(\d{4})(\d{2})(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : '';
};
