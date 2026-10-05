// Navbar collapse + dropdowns in place of bootstrap.bundle.js; sets the same classes/attributes its CSS reads.
(function () {
  var DD = '[data-bs-toggle="dropdown"]';

  function menuOf(toggle) {
    return toggle.parentElement.querySelector('.dropdown-menu');
  }

  function setOpen(toggle, open) {
    var menu = menuOf(toggle);
    toggle.classList.toggle('show', open);
    toggle.setAttribute('aria-expanded', open);
    if (!menu) return;
    menu.classList.toggle('show', open);
    if (open) menu.setAttribute('data-bs-popper', 'static');
    else menu.removeAttribute('data-bs-popper');
  }

  function closeAll(except) {
    document.querySelectorAll(DD + '.show').forEach(function (t) {
      if (t !== except) setOpen(t, false);
    });
  }

  document.addEventListener('click', function (e) {
    if (e.button === 2) return;
    var dd = e.target.closest(DD);
    closeAll(dd);
    if (dd) {
      e.preventDefault();
      var open = !dd.classList.contains('show');
      setOpen(dd, open);
      if (open) dd.focus();
      return;
    }
    var col = e.target.closest('[data-bs-toggle="collapse"]');
    var target = col && document.querySelector(col.getAttribute('data-bs-target'));
    if (!target) return;
    if (col.tagName === 'A') e.preventDefault();
    var show = target.classList.toggle('show');
    col.classList.toggle('collapsed', !show);
    col.setAttribute('aria-expanded', show);
  });

  // Open mobile menu: a tap on the dimmed page only closes it (swallowed, so nothing under it fires);
  // a tap on a menu link closes it and follows the link.
  document.addEventListener('click', function (e) {
    var open = document.querySelector('.navbar-collapse.show');
    if (!open || e.target.closest('[data-bs-toggle="collapse"]')) return;
    var inside = e.target.closest('.navbar-collapse');
    if (inside && !e.target.closest('.navbar-collapse a:not(.dropdown-toggle)')) return;
    if (!inside) { e.preventDefault(); e.stopPropagation(); }
    open.classList.remove('show');
    document.querySelectorAll('[data-bs-target="#' + open.id + '"]').forEach(function (t) {
      t.classList.add('collapsed');
      t.setAttribute('aria-expanded', 'false');
    });
  }, true);

  document.addEventListener('keydown', function (e) {
    var down = e.key === 'ArrowDown';
    if (!down && e.key !== 'ArrowUp' && e.key !== 'Escape') return;
    var menu = e.target.closest('.dropdown-menu');
    var toggle = e.target.closest(DD) || (menu && menu.parentElement.querySelector(DD));
    if (!toggle) return;
    if (e.key === 'Escape') {
      if (!toggle.classList.contains('show')) return;
      e.preventDefault();
      setOpen(toggle, false);
      toggle.focus();
      return;
    }
    e.preventDefault();
    closeAll(toggle);
    setOpen(toggle, true);
    var items = [].filter.call(menuOf(toggle).querySelectorAll('.dropdown-item:not(.disabled):not(:disabled)'), function (el) {
      return el.offsetParent !== null;
    });
    if (!items.length) return;
    var i = items.indexOf(e.target);
    i = i < 0 ? (down ? 0 : items.length - 1) : Math.max(0, Math.min(items.length - 1, i + (down ? 1 : -1)));
    items[i].focus();
  });

  // Tabbing out of an open menu closes it
  document.addEventListener('keyup', function (e) {
    if (e.key !== 'Tab') return;
    document.querySelectorAll(DD + '.show').forEach(function (t) {
      var menu = menuOf(t);
      if (!t.contains(e.target) && !(menu && menu.contains(e.target))) setOpen(t, false);
    });
  });
})();

// iPhone/iPad visitors: the App Store button becomes the primary one and comes first in each store pair.
(function () {
  var isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (!isIOS) return;
  document.querySelectorAll('a[href*="apps.apple.com"].btn').forEach(function (ios) {
    var android = ios.parentNode.querySelector('a[href*="play.google.com"].btn');
    if (!android) return;
    ios.className = ios.className.replace('btn--outline', 'btn--primary');
    android.className = android.className.replace('btn--primary', 'btn--outline');
    android.parentNode.insertBefore(ios, android);
  });
})();
