// Forwards the ad click id into the Play Store install referrer, so a paid install
// is attributable to its campaign instead of the page's hardcoded seo_page tag.
(function () {
  var KEY = 'omai_click_ref';
  var PLAY = 'play.google.com/store/apps';

  function clickRef() {
    try {
      var stored = sessionStorage.getItem(KEY);
      if (stored) return stored;

      var q = new URLSearchParams(location.search);
      var parts = [];
      ['gclid', 'gbraid', 'wbraid'].forEach(function (k) {
        if (q.get(k)) parts.push(k + '=' + q.get(k));
      });
      // Manual tags only when utm_source is present — a partial set still outranks
      // the click id in GA4 and would cost us the campaign name it resolves to.
      if (q.get('utm_source')) {
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term'].forEach(function (k) {
          if (q.get(k)) parts.push(k + '=' + q.get(k));
        });
      }

      var ref = parts.join('&');
      // Session-scoped: internal navigation drops the query string, and first touch
      // is the one that paid for the visit.
      if (ref) sessionStorage.setItem(KEY, ref);
      return ref;
    } catch (e) {
      return '';
    }
  }

  var ref = clickRef();
  if (!ref) return; // organic visit — leave the static referrer tags untouched

  function retag(a) {
    if (a.dataset.omaiRetagged) return;
    var url;
    try {
      url = new URL(a.getAttribute('href'), location.href);
    } catch (e) {
      return;
    }
    var prev = new URLSearchParams(url.searchParams.get('referrer') || '');
    var content = prev.get('utm_content');
    url.searchParams.set('referrer', content ? ref + '&utm_content=' + content : ref);
    a.setAttribute('href', url.toString());
    a.dataset.omaiRetagged = '1';
  }

  function sweep() {
    document.querySelectorAll('a[href*="' + PLAY + '"]').forEach(retag);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sweep);
  } else {
    sweep();
  }

  // Catches store links injected after the sweep, on pages that build a CTA in JS.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href*="' + PLAY + '"]');
    if (a) retag(a);
  }, true);
})();
