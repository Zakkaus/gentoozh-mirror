// 语言表与消息目录。加一门语言：LOCALES 加一项，补一份目录，补一份说明正文。

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
    navBinhost: '二进制包与 distfiles',
    navAbout: '使用说明',
    navHome: '下载',

    docTitle: 'Gentoo 中文社区 · 镜像站',
    docDesc: 'Gentoo 中文社区镜像站：社区定制 KDE 桌面 Live ISO，以及带 CJK 内核的最小安装介质。由社区自建镜像站与教育网镜像提供。',
    eyebrow: 'iso.gentoozh.org',
    title: 'Gentoo 中文社区 Live ISO',
    lead: '社区维护的两个 amd64 镜像，都是每周构建：开箱即用的 KDE 桌面，以及带 CJK 内核的最小安装介质。',

    pick: '选择镜像',
    prodDesktop: 'Gig-OS 桌面镜像',
    prodMinimal: 'CJK 最小安装镜像',
    prodDesktopLead: 'KDE Plasma 6 桌面，预先配好中文环境与输入法，可直接试用，也可安装到硬盘。',
    prodMinimalLead: '第三方 amd64 最小安装介质，用 Catalyst 按官方 Release Engineering 的 spec 构建，与 install-amd64-minimal 只有三处具名差异。',
    minDiffTitle: '与官方最小安装介质的差异',
    minDiff1: '构建时配置了 <code>gentoo-zh</code> overlay。',
    minDiff2: '内核是 <code>sys-kernel/gentoo-cjk-kernel-bin</code>，带 cjktty 补丁，因此 Linux 控制台能显示中日韩文字。',
    minDiff3: '支持 ZFS。',
    minRest: '其余与上游一致：软件包清单、livecd/unmerge、livecd/empty、dracut 参数与 GRUB 主题均为官方版本。',
    releasesLink: 'GitHub Releases',

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

    mirrorTitle: '下载镜像',
    // 收到的是已转义并包好 <code> 的版本号，与 req、featZfs 同样按 HTML 插入。
    mirrorLead: build => `最新版本 ${build}。教育网镜像在中国大陆通常快得多，但它们是计划同步，可能有几个小时的延迟，请直接在对应目录里下载最新版本。`,
    mirrorSource: '源站',
    mirrorCernet: '校园网联合镜像站（自动就近）',
    mirrorNju: '南京大学',
    mirrorNyist: '南阳理工学院',
    mirrorHernet: '河南省教育科研网',
    mirrorBrowse: '打开目录',
    mirrorBrowseOf: name => `打开${name}的目录`,

    allver: '全部版本',
    allverLink: '在镜像站浏览全部版本',
    footer: '本站是 <a href="https://www.gentoo.org.cn/">Gentoo 中文社区</a> 的 Live ISO 下载镜像。新版构建通知：<a href="https://t.me/gentoomirror">Telegram @gentoomirror</a>。',

    aboutTitle: '关于',
    aboutDesc: 'Gentoo 中文社区 Live ISO 的使用说明：启动菜单、输入法、显卡驱动、安装到硬盘、硬件要求。',
    noIso: '暂时没有可用的 ISO。',
  },

  'zh-tw': {
    lang: '語言',
    theme: '主題',
    themeLight: '淺色', themeDark: '深色', themeSystem: '跟隨系統',
    skip: '跳到正文',
    brand: 'Gentoo 中文社群 · 鏡像站',
    navBinhost: '二進位套件與 distfiles',
    navAbout: '使用說明',
    navHome: '下載',

    docTitle: 'Gentoo 中文社群 · 鏡像站',
    docDesc: 'Gentoo 中文社群鏡像站：社群訂製 KDE 桌面 Live ISO，以及帶 CJK 核心的最小安裝介質。由社群自建鏡像站與教育網鏡像提供。',
    eyebrow: 'iso.gentoozh.org',
    title: 'Gentoo 中文社群 Live ISO',
    lead: '社群維護的兩個 amd64 鏡像，都是每週建置：開箱即用的 KDE 桌面，以及帶 CJK 核心的最小安裝介質。',

    pick: '選擇鏡像',
    prodDesktop: 'Gig-OS 桌面鏡像',
    prodMinimal: 'CJK 最小安裝鏡像',
    prodDesktopLead: 'KDE Plasma 6 桌面，預先配好中文環境與輸入法，可直接試用，也可安裝到硬碟。',
    prodMinimalLead: '第三方 amd64 最小安裝介質，用 Catalyst 依官方 Release Engineering 的 spec 建置，與 install-amd64-minimal 只有三處具名差異。',
    minDiffTitle: '與官方最小安裝介質的差異',
    minDiff1: '建置時配置了 <code>gentoo-zh</code> overlay。',
    minDiff2: '核心是 <code>sys-kernel/gentoo-cjk-kernel-bin</code>，帶 cjktty 修補，因此 Linux 主控台能顯示中日韓文字。',
    minDiff3: '支援 ZFS。',
    minRest: '其餘與上游一致：套件清單、livecd/unmerge、livecd/empty、dracut 參數與 GRUB 主題皆為官方版本。',
    releasesLink: 'GitHub Releases',

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

    mirrorTitle: '下載鏡像',
    mirrorLead: build => `最新版本 ${build}。教育網鏡像在中國大陸通常快得多，但它們是排程同步，可能有幾個小時的延遲，請直接在對應目錄裡下載最新版本。`,
    mirrorSource: '源站',
    mirrorCernet: '校園網聯合鏡像站（自動就近）',
    mirrorNju: '南京大學',
    mirrorNyist: '南陽理工學院',
    mirrorHernet: '河南省教育科研網',
    mirrorBrowse: '開啟目錄',
    mirrorBrowseOf: name => `開啟${name}的目錄`,

    allver: '全部版本',
    allverLink: '在鏡像站瀏覽全部版本',
    footer: '本站是 <a href="https://www.gentoo.org.cn/">Gentoo 中文社群</a> 的 Live ISO 下載鏡像。新版建置通知：<a href="https://t.me/gentoomirror">Telegram @gentoomirror</a>。',

    aboutTitle: '關於',
    aboutDesc: 'Gentoo 中文社群 Live ISO 的使用說明：啟動選單、輸入法、顯示卡驅動、安裝到硬碟、硬體需求。',
    noIso: '暫時沒有可用的 ISO。',
  },

  'en': {
    lang: 'Language',
    theme: 'Theme',
    themeLight: 'Light', themeDark: 'Dark', themeSystem: 'System',
    skip: 'Skip to content',
    brand: 'Gentoo-zh Community · Mirror',
    navBinhost: 'Binaries and distfiles',
    navAbout: 'Guide',
    navHome: 'Download',

    docTitle: 'Gentoo-zh Community · Mirror',
    docDesc: 'The Gentoo-zh community mirror: a community-built KDE desktop Live ISO, and a minimal installation medium with the CJK kernel. Served from the community mirror and education-network mirrors.',
    eyebrow: 'iso.gentoozh.org',
    title: 'Gentoo-zh Community Live ISO',
    lead: 'Two amd64 images maintained by the community, both built weekly: a ready-to-use KDE desktop, and a minimal installation medium with the CJK kernel.',

    pick: 'Choose an image',
    prodDesktop: 'Gig-OS desktop image',
    prodMinimal: 'CJK minimal image',
    prodDesktopLead: 'A KDE Plasma 6 desktop with the Chinese environment and input methods already set up. Run it live or install it to disk.',
    prodMinimalLead: 'A third-party amd64 minimal installation medium, built by Catalyst from the official Release Engineering specs. It differs from install-amd64-minimal in three named ways only.',
    minDiffTitle: 'How it differs from the official minimal medium',
    minDiff1: 'The build has the <code>gentoo-zh</code> overlay configured.',
    minDiff2: 'The kernel is <code>sys-kernel/gentoo-cjk-kernel-bin</code>, which carries the cjktty patch, so the Linux console renders CJK.',
    minDiff3: 'ZFS support.',
    minRest: 'Everything else is upstream\'s: the package list, livecd/unmerge, livecd/empty, the dracut arguments and the GRUB theme.',
    releasesLink: 'GitHub Releases',

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

    mirrorTitle: 'Mirrors',
    mirrorLead: build => `The current build is ${build}. The education-network mirrors are much faster inside mainland China, but they sync on a schedule and can run several hours behind, so take the newest build from the directory itself.`,
    mirrorSource: 'Source',
    mirrorCernet: 'CERNET united mirror (nearest node)',
    mirrorNju: 'Nanjing University',
    mirrorNyist: 'Nanyang Institute of Technology',
    mirrorHernet: 'Henan Education and Research Network',
    mirrorBrowse: 'Open directory',
    mirrorBrowseOf: name => `Open the ${name} directory`,

    allver: 'All builds',
    allverLink: 'Browse all builds on the mirror',
    footer: 'The Live ISO download mirror of the <a href="https://www.gentoo.org.cn/">Gentoo-zh Community</a>. New-build notifications: <a href="https://t.me/gentoomirror">Telegram @gentoomirror</a>.',

    aboutTitle: 'About',
    aboutDesc: 'Using the Gentoo-zh community Live ISO: boot menu, input methods, graphics drivers, installing to disk, hardware requirements.',
    noIso: 'No ISO available yet.',
  },
};

export function t(locale, key) {
  const m = MESSAGES[locale] || MESSAGES[DEFAULT_LOCALE];
  const v = m[key];
  // 缺键直接抛，不让 undefined 进页面；npm run check 在构建前先触发同一条。
  if (v === undefined) throw new Error(`missing message: ${locale}.${key}`);
  return v;
}

// 仅供 index.js 的 elsewhere 判断未知路径的落点。已指名语言的路径一律照路径走，
// 因为分享出去的链接不应随接收者的浏览器变化，边缘缓存也不应按 header 分裂。
export function negotiate(header) {
  const want = String(header || '').toLowerCase();
  if (/(^|,|\s)en\b/.test(want) && !/zh/.test(want)) return 'en';
  if (/zh-(tw|hk|mo|hant)/.test(want)) return 'zh-tw';
  return DEFAULT_LOCALE;
}
