// 三份消息目录，一份一种语言。渲染在边缘完成，所以这些串永远不会到浏览器里去等脚本换。
//
// 加一门语言：在 LOCALES 里加一项，补一份目录，补一份说明正文，别处不用动。
// 缺一个键不会在页面上显示 undefined：npm run check 在构建前就报，t() 在运行期直接抛。

export const LOCALES = [
  { code: 'zh-cn', path: '/',        name: '简体中文', short: '简', dir: 'ltr' },
  { code: 'zh-tw', path: '/zh-tw/',  name: '繁體中文', short: '繁', dir: 'ltr' },
  { code: 'en',    path: '/en/',     name: 'English',  short: 'EN', dir: 'ltr' },
];

export const DEFAULT_LOCALE = 'zh-cn';

export const MESSAGES = {
  'zh-cn': {
    lang: '语言',
    theme: '主题',
    themeLight: '浅色', themeDark: '深色', themeSystem: '跟随系统',
    skip: '跳到正文',
    brand: 'Gentoo 中文社区 · 镜像站',
    navAbout: '使用说明',
    navHome: '下载',

    docTitle: 'Gentoo 中文社区 · 镜像站',
    docDesc: 'Gentoo 中文社区镜像站，社区定制 KDE 桌面 Live ISO 下载。由 Cloudflare R2 提供，全球边缘、不限流量。',
    eyebrow: 'iso.gentoozh.org',
    title: 'Gentoo 中文社区 Live ISO',
    lead: 'KDE Plasma 6 桌面，预先配好中文环境与输入法，可直接试用，也可安装到硬盘。每周构建。',

    buildLabel: '当前版本',
    download: '下载 ISO',
    verify: '下载后请核对校验和。',
    credsLabel: '登录信息（按一下复制）',
    credUser: '用户', credPass: '密码',
    copied: '已复制',
    copyOf: (what, v) => `复制${what} ${v}`,

    reqTitle: '系统要求',
    specCpu: '2013 年之后的处理器',
    req: '虚拟机中 VirtualBox 通常无法透传 AVX2，镜像无法启动。请改用 KVM（<code>-cpu host</code>）、原生 Hyper-V 或 VMware。',

    featZfsTitle: 'ZFS 根与原生加密',
    featZfs: '分区页可选 ZFS 作根文件系统，勾选加密即使用 ZFS 原生加密（aes-256-gcm），由 ZFSBootMenu 引导。默认 btrfs，另可选 xfs / ext4。详见<a href="@@ABOUT@@">使用说明</a>。',
    featNvTitle: 'NVIDIA 闭源驱动',
    featNv: 'RTX 20/30/40/50 需要硬件加速时，在启动菜单选择闭源 NVIDIA 项，并先在 BIOS 关闭 Secure Boot。详见<a href="@@ABOUT@@">使用说明</a>。',

    allver: '全部版本',
    colFile: '文件', colSize: '大小', colDate: '日期',
    footer: '本站是 <a href="https://www.gentoo.org.cn/">Gentoo 中文社区</a> 的 Live ISO 下载镜像。新版构建通知：<a href="https://t.me/gentoomirror">Telegram @gentoomirror</a>。',

    aboutTitle: '关于这个 Live ISO',
    aboutDesc: 'Gentoo 中文社区 Live ISO 的使用说明：启动菜单、输入法、显卡驱动、安装到硬盘、硬件要求。',
    noIso: '暂时没有可用的 ISO。',
  },

  'zh-tw': {
    lang: '語言',
    theme: '主題',
    themeLight: '淺色', themeDark: '深色', themeSystem: '跟隨系統',
    skip: '跳到正文',
    brand: 'Gentoo 中文社群 · 鏡像站',
    navAbout: '使用說明',
    navHome: '下載',

    docTitle: 'Gentoo 中文社群 · 鏡像站',
    docDesc: 'Gentoo 中文社群鏡像站，社群訂製 KDE 桌面 Live ISO 下載。由 Cloudflare R2 提供，全球邊緣、不限流量。',
    eyebrow: 'iso.gentoozh.org',
    title: 'Gentoo 中文社群 Live ISO',
    lead: 'KDE Plasma 6 桌面，預先配好中文環境與輸入法，可直接試用，也可安裝到硬碟。每週建置。',

    buildLabel: '目前版本',
    download: '下載 ISO',
    verify: '下載後請核對校驗和。',
    credsLabel: '登入資訊（按一下複製）',
    credUser: '使用者', credPass: '密碼',
    copied: '已複製',
    copyOf: (what, v) => `複製${what} ${v}`,

    reqTitle: '系統需求',
    specCpu: '2013 年之後的處理器',
    req: '虛擬機中 VirtualBox 通常無法透傳 AVX2，鏡像無法啟動。請改用 KVM（<code>-cpu host</code>）、原生 Hyper-V 或 VMware。',

    featZfsTitle: 'ZFS 根與原生加密',
    featZfs: '分割區頁可選 ZFS 作根檔案系統，勾選加密即使用 ZFS 原生加密（aes-256-gcm），由 ZFSBootMenu 引導。預設 btrfs，另可選 xfs / ext4。詳見<a href="@@ABOUT@@">使用說明</a>。',
    featNvTitle: 'NVIDIA 閉源驅動',
    featNv: 'RTX 20/30/40/50 需要硬體加速時，在啟動選單選擇閉源 NVIDIA 項，並先在 BIOS 關閉 Secure Boot。詳見<a href="@@ABOUT@@">使用說明</a>。',

    allver: '全部版本',
    colFile: '檔案', colSize: '大小', colDate: '日期',
    footer: '本站是 <a href="https://www.gentoo.org.cn/">Gentoo 中文社群</a> 的 Live ISO 下載鏡像。新版建置通知：<a href="https://t.me/gentoomirror">Telegram @gentoomirror</a>。',

    aboutTitle: '關於這個 Live ISO',
    aboutDesc: 'Gentoo 中文社群 Live ISO 的使用說明：啟動選單、輸入法、顯示卡驅動、安裝到硬碟、硬體需求。',
    noIso: '暫時沒有可用的 ISO。',
  },

  'en': {
    lang: 'Language',
    theme: 'Theme',
    themeLight: 'Light', themeDark: 'Dark', themeSystem: 'System',
    skip: 'Skip to content',
    brand: 'Gentoo-zh Community · Mirror',
    navAbout: 'Guide',
    navHome: 'Download',

    docTitle: 'Gentoo-zh Community · Mirror',
    docDesc: 'The Gentoo-zh community mirror: a KDE desktop Live ISO built by the community. Served from Cloudflare R2, global edge, no traffic cap.',
    eyebrow: 'iso.gentoozh.org',
    title: 'Gentoo-zh Community Live ISO',
    lead: 'A KDE Plasma 6 desktop with the Chinese environment and input methods already set up. Run it live or install it to disk. Built weekly.',

    buildLabel: 'Current build',
    download: 'Download ISO',
    verify: 'Verify the checksum after downloading.',
    credsLabel: 'Login (press to copy)',
    credUser: 'User', credPass: 'Password',
    copied: 'Copied',
    copyOf: (what, v) => `Copy ${what.toLowerCase()} ${v}`,

    reqTitle: 'Requirements',
    specCpu: 'CPU from 2013 or later',
    req: 'In a virtual machine, VirtualBox usually cannot pass AVX2 through and the image will not boot. Use KVM (<code>-cpu host</code>), native Hyper-V or VMware.',

    featZfsTitle: 'ZFS root with native encryption',
    featZfs: 'ZFS can be chosen as the root filesystem on the partitioning page; ticking Encrypt uses ZFS native encryption (aes-256-gcm), booted by ZFSBootMenu. The default is btrfs, with xfs / ext4 also available. See the <a href="@@ABOUT@@">guide</a>.',
    featNvTitle: 'Proprietary NVIDIA driver',
    featNv: 'For hardware acceleration on RTX 20/30/40/50, pick the proprietary NVIDIA boot entry and disable Secure Boot in the BIOS first. See the <a href="@@ABOUT@@">guide</a>.',

    allver: 'All builds',
    colFile: 'File', colSize: 'Size', colDate: 'Date',
    footer: 'The Live ISO download mirror of the <a href="https://www.gentoo.org.cn/">Gentoo-zh Community</a>. New-build notifications: <a href="https://t.me/gentoomirror">Telegram @gentoomirror</a>.',

    aboutTitle: 'About this Live ISO',
    aboutDesc: 'Using the Gentoo-zh community Live ISO: boot menu, input methods, graphics drivers, installing to disk, hardware requirements.',
    noIso: 'No ISO available yet.',
  },
};

export function t(locale, key) {
  const m = MESSAGES[locale] || MESSAGES[DEFAULT_LOCALE];
  const v = m[key];
  // 缺键在这里就炸，而不是在页面上显示 undefined。scripts/check.mjs 把六份文档
  // 整个渲染一遍，所以同一条在构建前就会先响。
  if (v === undefined) throw new Error(`missing message: ${locale}.${key}`);
  return v;
}

export function localeOf(pathname) {
  for (const l of LOCALES) {
    if (l.path !== '/' && pathname.startsWith(l.path)) return l;
  }
  return LOCALES.find(l => l.code === DEFAULT_LOCALE);
}

// Accept-Language 只在未知路径上用一次，决定把人送到哪一份首页（见 index.js 的
// elsewhere）。已经指名语言的路径一律照路径走，不看这个头：分享出去的链接不该跟着
// 收链接那个人的浏览器跑，边缘缓存也不该按 header 裂开。
export function negotiate(header) {
  const want = String(header || '').toLowerCase();
  if (/(^|,|\s)en\b/.test(want) && !/zh/.test(want)) return 'en';
  if (/zh-(tw|hk|mo|hant)/.test(want)) return 'zh-tw';
  return DEFAULT_LOCALE;
}
