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
