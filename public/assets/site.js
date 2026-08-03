/* 只做脚本才能做的两件事：写主题偏好、写剪贴板。
 * 页面在没有本文件时仍然完整，语言控件是三个链接。 */
(function () {
  'use strict';

  var root = document.documentElement;

  /* 控件默认 hidden，脚本运行后才显示，避免留下一个按不动的开关。 */
  var menu = document.querySelector('[data-theme-menu]');
  if (menu) {
    menu.hidden = false;
    var summary = menu.querySelector('summary');
    var items = menu.querySelectorAll('button[data-mode]');
    var read = function () { try { return localStorage.getItem('mirror-theme') || 'system'; } catch (e) { return 'system'; } };

    var paint = function (mode) {
      for (var i = 0; i < items.length; i++) {
        var on = items[i].dataset.mode === mode;
        items[i].setAttribute('aria-checked', on ? 'true' : 'false');
        if (on) summary.innerHTML = items[i].querySelector('svg').outerHTML;
      }
    };

    var apply = function (mode) {
      if (mode === 'light' || mode === 'dark') root.setAttribute('data-theme', mode);
      else root.removeAttribute('data-theme');
      try { localStorage.setItem('mirror-theme', mode); } catch (e) {}
      paint(mode);
    };

    for (var i = 0; i < items.length; i++) {
      (function (el) {
        el.addEventListener('click', function () {
          apply(el.dataset.mode);
          menu.open = false;
          summary.focus();
        });
      })(items[i]);
    }
    paint(read());
  }

  /* details 自身不处理点击外部与 Escape 关闭，这里补上。 */
  var menus = document.querySelectorAll('details.disclosure');
  document.addEventListener('click', function (e) {
    for (var i = 0; i < menus.length; i++) {
      if (menus[i].open && !menus[i].contains(e.target)) menus[i].open = false;
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    for (var i = 0; i < menus.length; i++) {
      if (menus[i].open) { menus[i].open = false; menus[i].querySelector('summary').focus(); }
    }
  });

  /* navigator.clipboard 在非安全上下文不存在，镜像站可能被以 http 访问，
     所以保留 execCommand 回退。 */
  var toast = document.getElementById('toast');
  if (!toast) return;
  var timer;
  var say = function (msg) {
    toast.textContent = msg;
    clearTimeout(timer);
    timer = setTimeout(function () { toast.textContent = ''; }, 1600);
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button.copy[data-copy]');
    if (!b) return;
    var v = b.getAttribute('data-copy');
    var done = function () { say(toast.dataset.copied || ''); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(v).then(done, done);
    } else {
      var t = document.createElement('textarea');
      t.value = v; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch (err) {}
      document.body.removeChild(t); done();
    }
  });
})();
